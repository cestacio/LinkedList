const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    currentCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    photo: String,
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;