const { User } = require('../models');
const Validator = require('jsonschema').Validator;
const v = new Validator();
const { userSchema } = require('../schemas');

// function createUser(req, res, next) {
//     const newUser = new User(req.body);
//     newUser.save().then(user => {
//             return res.status(201).json(user);
//         })
//         .catch(err => {
//             return res.json(err);
//         });
// }

function createUser(req, res, next) {
    const result = v.validate(req.body, userSchema);
    if (!result.valid) {
        const errors = result.errors.map(e => e.message).join(', ');
        return next({ message: errors });
    }
    return User.createUser(new User(req.body))
        .then(user => res.json({ data: user })).catch(err => next(err));
}

function readUsers(req, res, next) {
    return User.find().then(users => {
        return res.json({ data: users });
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
    return User.findOneAndUpdate({
            username: req.params.username
        }, req.body, {
            new: true
        })
        .then(user => res.json({ data: user }))
        .catch(err => {
            return res.json(err)
        });
}

function deleteUser(req, res, next) {
    return User.findOneAndRemove({
        username: req.params.username
    }).then(() => {
        return res.json({ message: 'User successfully deleted' });
    });
}

module.exports = {
    createUser,
    readUsers,
    readUser,
    updateUser,
    deleteUser
};