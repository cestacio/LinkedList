const express = require('express');
const router = express.Router();
const { auth } = require('../helpers');
const { usersHandler } = require('../handlers');

router
  .route('')
  .get(auth.ensureUserLoggedIn, usersHandler.readUsers)
  .post(usersHandler.createUser);

router.post('/user-auth', usersHandler.createUserToken);

router
  .route('/:username')
  .get(auth.ensureUserLoggedIn, usersHandler.readUser)
  .patch(
    auth.ensureUserLoggedIn,
    auth.ensureCorrectUser,
    usersHandler.updateUser
  )
  .delete(
    auth.ensureUserLoggedIn,
    auth.ensureCorrectUser,
    usersHandler.deleteUser
  );

module.exports = router;
