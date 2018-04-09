const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    salary: {
      type: Number,
      require: true
    },
    equity: {
      type: Number,
      require: true
    }
  },
  {
    timestamps: true
  }
);

jobSchema.statics = {
  createJob(newJob) {
    return this.findOne({ id: newJob.id }).then(jobId => {
      if (jobId) {
        throw new Error(`The jobId ${newJob.id} exists already.`);
      }
      let Company = mongoose.model('Company');
      return newJob
        .save()
        .then(job => {
          return Company.findOneAndUpdate(
            job.company,
            { $addToSet: { jobs: job._id } },
            { new: true }
          );
        })
        .then(company => newJob)
        .catch(err => {
          return Promise.reject(err);
        });
    });
  }
};

jobSchema.post('findOneAndModify', job => {
  let Company = mongoose.model('Company');
  Company.findOneAndUpdate(job.company, { $addToSet: { jobs: job._id } }).then(
    () => {
      console.log('POST HOOK RAN');
    }
  );
});

jobSchema.post('findOneAndRemove', job => {
  let Company = mongoose.model('Company');
  Company.findOneAndUpdate(job.company, { $pull: { jobs: job._id } }).then(
    () => {
      console.log('POST HOOK RAN');
    }
  );
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
