// npm packages
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// globals
dotenv.config();
const app = express();

// body parser setup
app.use(bodyParser.json({ type: '*/*' }));

const PORT = 3000;
const { User, Company } = require('./models');

// app imports
let userRouters = require('./routers/users');
let companyRouters = require('./routers/companies');
let jobRouters = require('./routers/jobs');

// database config
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose
    .connect('mongodb://localhost/linkedlist')
    .then(() => {
        console.log('Successfully connected to the database!');
    })
    .catch(err => {
        console.log(err);
    })

app.use('/users', userRouters);
app.use('/companies', companyRouters);
app.use('/jobs', jobRouters);

// error handler
app.use((err, req, res, next) =>
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    })
);

app.listen(PORT, () => {
    console.log(`LinkedList API is listening on port ${PORT}`);
});