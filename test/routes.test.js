const { after, before, describe, it } = require('mocha');
const prisma = require('../src/prismaClient');
const request = require('supertest');
const app = require('../src/server');
const { expect } = require('chai');

describe('HT-Contest', () => {
    before(async () => {
        await prisma.$connect();
    });
    after(async () => {
        await prisma.$disconnect();
    });
    
    it('should register a new minion', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ name: 'Tsunade', age: 45, prediction: 'Head' });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message' , 'Success');
    });

    it('should declare a result of contest' , async ()=>{
        const response = await request(app).get('/api/result');
        expect(response.status).to.equal(200);
    })
});
