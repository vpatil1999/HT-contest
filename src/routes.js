const { Router } = require('express');
const prisma = require('./prismaClient');
const router = Router();

const invalidParam = (res, message = 'Invalid Params') => {
    res.status(400).send(message);
};

const internalServerError = (res, error) => {
    res.status(500).send('Internal Server Error');
};

const successResponse = (res, data, message = 'Success') => {
    res.status(200).send({ message, data });
};

const badResponse = (res, message = 'Bad Request') => {
    res.status(400).send(message);
};

router.post('/register', async (req, res) => {
    try {
        const { name, age, prediction } = req.body;
        if (!name || !age || !prediction) {
            return invalidParam(res);
        }
        const previousMinion = await prisma.minions.findMany();
        const isAlreadyParticipated = previousMinion.some((minion) => minion.name === name);
        if (previousMinion.length >= 2) {
            await prisma.minions.deleteMany();
        }
        if (isAlreadyParticipated) {
            return successResponse(res, "Already participated");
        }
        const newMinion = await prisma.minions.create({ data: req.body });
        if (newMinion) {
            return successResponse(res, newMinion);
        }
        return badResponse(res);
    } catch (error) {
        return internalServerError(res, error);
    }
});

router.get('/result', async (req, res) => {
    try {
        const prediction = { 1: 'Head', 2: 'Tail' };
        const randomIndex = Math.floor(Math.random() * 2) + 1;
        const result = prediction[randomIndex];
        let participants = await prisma.minions.findMany();
        if (!participants.length || participants.length < 2) {
            return successResponse(res, (!participants.length ? "No participants participated yet" : "One more participant needed"));
        }
        const findWinner = participants.find((minion) => minion.prediction === result);
        if (findWinner) {
            const winnerMessage = `Winner is ${findWinner.name} with a prediction of ${findWinner.prediction}`;
            return successResponse(res, winnerMessage);
        } else {
            return successResponse(res, 'No winner found.');
        }
    } catch (error) {
        return internalServerError(res, error);
    }
});

module.exports = router;
