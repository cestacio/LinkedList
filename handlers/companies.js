const { Company } = require('../models');
const Validator = require('jsonschema').Validator;
const v = new Validator();
const { companySchema } = require('../schemas');

function createCompany(req, res, next) {
    const result = v.validate(req.body, companySchema);
    if (!result.valid) {
        const errors = result.errors.map(e => e.message).join(', ');
        return next({ message: errors });
    }
    return Company.createCompany(new Company(req.body))
        .then(company => res.json({ data: company })).catch(err => next(err));
}

function readCompanies(req, res, next) {
    return Company.find().then(companies => {
        return res.json({ data: companies });
    }).catch(err => next(err));
}

function readCompany(req, res, next) {
    return Company.findOne({
            handle: req.params.handle
        })
        .populate('jobs')
        .exec()
        .then(company => {
            if (!company) {
                return res
                    .status(404)
                    .json({ message: `Company ${req.params.handle} not found.` });
            }
            return res.json({ data: company });
        })
        .catch(err => {
            return res.json(err);
        });
}

function updateCompany(req, res, next) {
    const result = v.validate(req.body, companySchema);
    if (!result.valid) {
        const errors = result.errors.map(e => e.message).join(', ');
        return next({ message: errors });
    }
    return Company.findOneAndUpdate({
            handle: req.params.handle
        }, req.body, {
            new: true
        })
        .then(company => res.json({ data: company }))
        .catch(err => {
            return res.json(err)
        });
}

function deleteCompany(req, res, next) {
    return Company.findOneAndRemove({
            handle: req.params.handle
        })
        .then(() => {
            return res.json({ message: 'Company successfully deleted' });
        });
}

module.exports = {
    createCompany,
    readCompanies,
    readCompany,
    updateCompany,
    deleteCompany
};