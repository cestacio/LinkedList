const express = require('express');
const router = express.Router();
const { auth } = require('../helpers');
const { companiesHandler } = require('../handlers');

router
    .route('')
    .get(auth.ensureGeneralLoggedIn, companiesHandler.readCompanies)
    .post(companiesHandler.createCompany);

router.post('/company-auth', companiesHandler.createCompanyToken);

router
    .route('/:handle')
    .get(auth.ensureCompanyLoggedIn, companiesHandler.readCompany)
    .patch(
        auth.ensureCompanyLoggedIn,
        auth.ensureCorrectCompany,
        companiesHandler.updateCompany
    )
    .delete(
        auth.ensureCompanyLoggedIn,
        auth.ensureCorrectCompany,
        companiesHandler.deleteCompany
    );

module.exports = router;