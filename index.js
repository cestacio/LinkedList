const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// database config
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose
    .connect('mongodb://localhost/linkedlist')
    .then(() => {
        console.log('Successfully connect to database!');
    })
    .catch(err => {
        console.log(err);
    })

app.listen(PORT, () => {
    console.log(`LinkedList API is listening on port ${PORT}`);
})