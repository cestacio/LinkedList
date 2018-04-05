const express = require('express');
const router = express.Router();

const { jobsHandler } = require('../handlers');

router
    .route('')
    .get(jobsHandler.readJobs)
    .post(jobsHandler.createJob);

router
    .route('/:jobId')
    .get(jobsHandler.readJob)
    .patch(jobsHandler.updateJob)
    .delete(jobsHandler.deleteJob);

module.exports = router;