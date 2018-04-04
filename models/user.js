const mongoose = require('mongoose');
const Company = require('./company');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 1,
        maxLength: 55,
        required: true
    },
    lastName: {
        type: String,
        minLength: 1,
        maxLength: 55,
        required: true
    },
    username: {
        type: String,
        minLength: 1,
        maxLength: 55,
        required: true,
        immutable: true
    },
    email: {
        type: String,
        minLength: 1,
        maxLength: 55,
        required: true
    },
    password: {
        type: String,
        minLength: 1,
        maxLength: 55,
        required: true
    },
    currentCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    photo: String,
    experience: [{
        jobTitle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        startDate: Date, // ISO date-format timestamp
        endDate: Date // ISO date-format timestamp
    }],
    education: [{
        institution: String,
        degree: String,
        endDate: Date // ISO date-format timestamp
    }],
    skills: String
});

userSchema.statics = {
    createUser(newUser) {
        return this.findOne({ name: newUser.username }).then(username => {
            if (username) {
                throw new Error(`The username ${newUser.username} exists already.`);
            }
            return newUser
                .save()
                .then(user => user)
                .catch(err => {
                    return Promise.reject(err);
                });
        });
    }
};

userSchema.post('findOneAndUpdate', user => {
    Company.findOneAndUpdate(user.company, { $addToSet: { users: user._id } }).then(() => {
        console.log('POST HOOK RAN');
    });
});

userSchema.post('findOneAndRemove', user => {
    Company.findOneAndUpdate(user.company, { $pull: { users: user._id } }).then(() => {
        console.log('POST HOOK RAN');
    });
});

const User = mongoose.model('User', userSchema);
module.exports = User;