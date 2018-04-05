const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    salary: Number,
    equity: Number // this is a float
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;