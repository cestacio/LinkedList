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
    .patch(usersHandler.updateUser)
    .delete(usersHandler.deleteUser);

module.exports = router;