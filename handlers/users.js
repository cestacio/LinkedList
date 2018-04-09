const { User } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const { userSchema } = require('../schemas');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../helpers');

function createUserToken(req, res, next) {
  return User.findOne({ username: req.body.username }).then(
    user => {
      if (!user) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
      return user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch) {
          const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: 60 * 60
            }
          );
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
}

function createUser(req, res, next) {
  const result = validator.validate(req.body, userSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(', ');
    return next({ message: errors });
  }
  return User.createUser(new User(req.body))
    .then(user => res.json({ data: user }))
    .catch(err => next(err));
}

function readUsers(req, res, next) {
  return User.find()
    .then(users => {
      return res.json({ data: users });
    })
    .catch(err => {
      return next(new ApiError());
    });
}

function readUser(req, res, next) {
  return User.findOne({
    username: req.params.username
  })
    .populate('users')
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ message: `User ${req.params.username} not found.` });
      }
      return res.json({ data: user });
    })
    .catch(err => {
      return res.json(err);
    });
}

function updateUser(req, res, next) {
  const result = validator.validate(req.body, userSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(', ');
    return next({ message: errors });
  }
  return User.findOneAndUpdate(
    {
      username: req.params.username
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
    .then(user => res.json({ data: user }))
    .catch(err => next(err));
}

function deleteUser(req, res, next) {
  return User.findOneAndRemove({
    username: req.params.username
  }).then(() => {
    return res.json({ message: 'User successfully deleted' });
  });
}

module.exports = {
  createUserToken,
  createUser,
  readUsers,
  readUser,
  updateUser,
  deleteUser
};
