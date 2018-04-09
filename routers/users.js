const express = require('express');
const router = express.Router();
const { userAuth, ensureCorrectUser } = require('../helpers');
const { usersHandler } = require('../handlers');


router
    .route('')
    .get(userAuth.userAuth, usersHandler.readUsers)
    .post(usersHandler.createUser);

router
    .post('/user-auth', usersHandler.userToken);

router
    .route('/:username')
    .get(userAuth.userAuth, usersHandler.readUser)
    .patch(userAuth.userAuth, userAuth.ensureCorrectUser, usersHandler.updateUser)
    .delete(userAuth.userAuth, userAuth.ensureCorrectUser, usersHandler.deleteUser);

module.exports = router;