const mongoose = require('mongoose');
const Company = require('./company');
const bcrypt = require('bcrypt');

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
        jobTitle: String,
        company: String,
        startDate: Date,
        endDate: Date
    }],
    education: [{
        institution: String,
        degree: String,
        endDate: Date
    }],
    skills: String
}, {
    timestamps: true
});

userSchema.statics = {
    createUser(newUser) {
        return this.findOne({ username: newUser.username }).then(username => {
            if (username) {
                throw new Error(`The username ${newUser.username} exists already.`);
            }
            return newUser
                .save()
                .then(user => user)
                .catch(err => {
                    return Promise.reject(err);
                });
        }).catch(err => {
            return Promise.reject(err);
        });
    }
};

userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.hash(user.password, 10).then(
        hashedPassword => {
            user.password = hashedPassword;
            return next();
        },
        err => next(err)
    );
});

userSchema.methods.comparePassword = function(candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return next(err);
        }
        return next(null, isMatch);
    });
};

userSchema.post('findOneAndModify', user => {
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