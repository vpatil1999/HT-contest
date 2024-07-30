const express = require('express');
const cors = require('cors');
const router = require('./routes');
const path = require('path');

const port = process.env.PORT || 4545;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.type('html');
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server Started at Port: ${port}`);
});

module.exports = app;
