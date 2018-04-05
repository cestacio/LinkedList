const mongoose = require('mongoose');
const Company = require('./company');

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

jobSchema.statics = {
    createJob(newJob) {
        return this.findOne({ id: newJob.id }).then(jobId => {
            if (jobId) {
                throw new Error(`The jobId ${newJob.id} exists already.`);
            }
            return newJob
                .save()
                .then(job => job)
                .catch(err => {
                    return Promise.reject(err);
                });
        });
    }
};

jobSchema.post('findOneAndModify', job => {
    Company.findOneAndUpdate(job.company, { $addToSet: { jobs: job._id } }).then(() => {
        console.log('POST HOOK RAN');
    });
});

jobSchema.post('findOneAndRemove', job => {
    Company.findOneAndUpdate(job.company, { $pull: { jobs: job._id } }).then(() => {
        console.log('POST HOOK RAN');
    });
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;