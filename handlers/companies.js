const { Company } = require('../models');

function createCompany(req, res, next) {
    const newCompany = new Company(req.body);
    newCompany.save().then(company => {
            return res.status(201).json(company);
        })
        .catch(err => {
            return res.json(err);
        });
}

function readCompanies(req, res, next) {
    return Company.find().then(companies => {
        return res.json(companies);
    });
}

function readCompany(req, res, next) {
    return Company.findOne({
            handle: req.params.handle
        })
        .populate('companies')
        .exec()
        .then(company => {
            if (!company) {
                return res
                    .status(404)
                    .json({ message: `Company ${req.params.handle} not found.` });
            }
            return res.json(company);
        })
        .catch(err => {
            return res.json(err);
        });
}

function updateCompany(req, res, next) {
    return Company.findOneAndUpdate({
            handle: req.params.handle
        }, req.body, {
            new: true
        })
        .then(company => res.json(company))
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