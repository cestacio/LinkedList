const { User } = require('../models');

function createUser(req, res, next) {
    const newUser = new User(req.body);
    newUser.save().then(user => {
        return res.status(201).json(user);
    });
}

function readUsers(req, res, next) {
    return User.find().then(users => {
        return res.json(users);
    });
}

function readUser(req, res, next) {
    return User.findById(req.params.userId)
        .populate('pets')
        .exec()
        .then(user => {
            if (!user) {
                return res
                    .status(404)
                    .json({ message: `User ${req.params.userId} not found.` });
            }
            return res.json(user);
        })
        .catch(err => {
            return res.json(err);
        });
}

function updateUser(req, res, next) {
    return User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true
    }).then(user => res.json(user));
}

function deleteUser(req, res, next) {
    return User.findByIdAndRemove(req.params.userId).then(() => {
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