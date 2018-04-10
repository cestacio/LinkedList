const { Job } = require('../models');
const Validator = require('jsonschema').Validator;
const v = new Validator();
const { jobSchema } = require('../schemas');

function createJob(req, res, next) {
  const result = v.validate(req.body, jobSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(', ');
    return next({ message: errors });
  }
  return Job.createJob(new Job(req.body))
    .then(job => res.json({ data: job }))
    .catch(err => next(err));
}

function readJobs(req, res, next) {
  return Job.find().then(jobs => {
    return res.json({ data: jobs });
  });
}

function readJob(req, res, next) {
  return Job.findById(req.params.jobId)
    .populate('jobs')
    .exec()
    .then(job => {
      if (!job) {
        return res
          .status(404)
          .json({ message: `Job ${req.params.id} not found.` });
      }
      return res.json({ data: job });
    })
    .catch(err => {
      return res.json(err);
    });
}

function updateJob(req, res, next) {
  const result = v.validate(req.body, jobSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(', ');
    return next({ message: errors });
  }
  return Job.findOneAndUpdate(
    {
      jobId: req.params.id
    },
    req.body,
    {
      new: true
    }
  )
    .then(job => res.json({ data: job }))
    .catch(err => {
      return res.json(err);
    });
}

function deleteJob(req, res, next) {
  Job.findById(req.params.jobId)
    .then(job => {
      job.remove().then(() => {
        return res.json({ message: 'Job successfully deleted' });
      });
    })
    .catch(err => {
      return res.json('hey');
    });
}

module.exports = {
  createJob,
  readJobs,
  readJob,
  updateJob,
  deleteJob
};
