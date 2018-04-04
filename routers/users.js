const express = require('express');
const router = express.Router();

const { usersHandler } = require('../handlers');

router
    .route('')
    .get(usersHandler.readUsers)
    .post(usersHandler.createUser);

router
    .route('/:username')
    .get(usersHandler.readUser)
    .patch(usersHandler.updateUser) // 2
    .delete(usersHandler.deleteUser); // 3

module.exports = router;