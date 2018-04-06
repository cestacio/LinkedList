// npm packages
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// app imports
const { ENV, PORT, MONGODB_URI } = require('./config');
let authHandler = require('./handlers/auth');
let userRouters = require('./routers/users');
let companyRouters = require('./routers/companies');
let jobRouters = require('./routers/jobs');

// globals
dotenv.config();
const app = express();

// database config
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to the database!');
    })
    .catch(err => {
        console.log(err);
    })

// body parser setup
app.use(bodyParser.json());

// app.post('/auth', authHandler);
app.use('/users', userRouters);
app.use('/companies', companyRouters);
app.use('/jobs', jobRouters);

app.listen(PORT, () => {
    console.log(`LinkedList API is listening on port ${PORT}`);
})