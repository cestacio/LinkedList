const express = require('express');
const { User } = require('../models');
const router = express.Router();

// all users at /users
router
    .route('')
    .get((req, res, next) => {
        return User.find().then(user => {
            return res.render('users/index', { users });
        });
    })
    .post((req, res, next) => {
        return User.create(req, body).then(user => {
            return res.redirect('users/index');
        });
    });

// create a new user form