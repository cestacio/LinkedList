const { User } = require('../models');

function createUser(req, res, next) {
    const newUser = new User(req.body);
    newUser.save().then(user => {
            return res.status(201).json(user);
        })
        .catch(err => {
            return res.json(err);
        });
}

function readUsers(req, res, next) {
    return User.find().then(users => {
        return res.json(users);
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
            return res.json(user);
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
        .then(user => res.json(user))
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