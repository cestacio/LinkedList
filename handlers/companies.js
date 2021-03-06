const { Company } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const { companySchema } = require('../schemas');
const jwt = require('jsonwebtoken');

function createCompanyToken(req, res, next) {
  return Company.findOne({ handle: req.body.handle }).then(
    company => {
      if (!company) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
      return company.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch) {
          const token = jwt.sign(
            { handle: company.handle },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: 60 * 60
            }
          );
          return res.json({
            message: 'Authenticated!',
            token
          });
        } else {
          return res.status(401).json({ message: 'Invalid Credentials' });
        }
      });
    },
    err => next(err)
  );
}

function createCompany(req, res, next) {
  const result = validator.validate(req.body, companySchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(', ');
    return next({ message: errors });
  }
  return Company.createCompany(new Company(req.body))
    .then(company => res.json({ data: company }))
    .catch(err => next(err));
}

function readCompanies(req, res, next) {
  return Company.find()
    .then(companies => {
      return res.json({ data: companies });
    })
    .catch(err => next(err));
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
  const result = validator.validate(req.body, companySchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(', ');
    return next({ message: errors });
  }
  return Company.findOneAndUpdate(
    {
      handle: req.params.handle
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
    .then(company => res.json({ data: company }))
    .catch(err => {
      return res.json(err);
    });
}

function deleteCompany(req, res, next) {
  return Company.findOneAndRemove({
    handle: req.params.handle
  }).then(() => {
    return res.json({ message: 'Company successfully deleted' });
  });
}

module.exports = {
  createCompanyToken,
  createCompany,
  readCompanies,
  readCompany,
  updateCompany,
  deleteCompany
};
