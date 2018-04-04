const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    currentCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    photo: String,
    experience: {
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
    },
    education: {
        institution: String,
        degree: String,
        endDate: Date // ISO date-format timestamp
    },
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
    User.findOneAndUpdate(user, { $pul })

})

const User = mongoose.model('User', userSchema);
module.exports = User;