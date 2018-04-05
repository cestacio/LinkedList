const express = require('express');
const router = express.Router();

const { companiesHandler } = require('../handlers');

router
    .route('')
    .get(companiesHandler.readCompanies)
    .post(companiesHandler.createCompany);

router
    .route('/:handle')
    .get(companiesHandler.readCompany)
    .patch(companiesHandler.updateCompany)
    .delete(companiesHandler.deleteCompany);

module.exports = router;