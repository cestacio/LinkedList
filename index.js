// npm packages
const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// globals
const app = express();

// body parser setup
app.use(bodyParser.json({ type: '*/*' }));

const PORT = 3000;
const SECRET = 'secret';
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

// user & company auth
app.post('/user-auth', (req, res, next) => {
    console.log(req.body);
    return User.findOne({ username: req.body.username }).then(
        user => {
            console.log('USER', user);
            if (!user) {
                return res.status(401).json({ message: 'Invalid Credentials' });
            }
            return user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch) {
                    const token = jwt.sign({ username: user.username }, SECRET, {
                        expiresIn: 60 * 60 // expire in one hour
                    });
                    return res.json({
                        message: 'Authenticated!',
                        token
                    });
                } else {
                    return res.status(401).json({ message: 'Invalid Credentials' });
                }
            });
        },
        err => next(err)
    );
});

app.post('/company-auth', (req, res, next) => {
    return Company.findOne({ handle: req.body.handle }).then(
        company => {
            console.log('COMPANY', company);
            if (!company) {
                return res.status(401).json({ message: 'Invalid Credentials' });
            }
            return company.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch) {
                    const token = jwt.sign({ handle: company.handle }, SECRET, {
                        expiresIn: 60 * 60 // expire in one hour
                    });
                    return res.json({
                        message: 'Authenticated!',
                        token
                    });
                } else {
                    return res.status(401).json({ message: 'Invalid Credentials' });
                }
            });
        },
        err => next(err)
    );
});

app.use('/users', userRouters);
app.use('/companies', companyRouters);
app.use('/jobs', jobRouters);

app.listen(PORT, () => {
    console.log(`LinkedList API is listening on port ${PORT}`);
});