const mongoose = require('mongoose');
const User = require('./user');
const Job = require('./job');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const bcrypt = require('bcrypt');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: function(validator) {
          return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(
            validator
          );
        },
        message: 'Invalid Email! Try again.'
      },
      required: true
    },
    handle: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    logo: String,
    employees: [{ type: String }],
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ]
  },
  {
    timestamps: true
  }
);

companySchema.statics = {
  createCompany(newCompany) {
    return this.findOne({ name: newCompany.handle }).then(handle => {
      if (handle) {
        throw new Error(`The handle ${newCompany.handle} exists already.`);
      }
      return newCompany
        .save()
        .then(company => company)
        .catch(err => {
          return Promise.reject(err);
        });
    });
  }
};

companySchema.pre('save', function(next) {
  const company = this;

  if (!company.isModified('password')) {
    return next();
  }

  bcrypt.hash(company.password, 10).then(
    hashedPassword => {
      company.password = hashedPassword;
      return next();
    },
    err => next(err)
  );
});

companySchema.methods.comparePassword = function(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return next(err);
    }
    return next(null, isMatch);
  });
};

companySchema.post('findOneAndModify', company => {
  let User = mongoose.model('User');
  User.findOneAndUpdate(company.user, {
    $addToSet: { company: company._id }
  }).then(() => {
    console.log('POST HOOK RAN');
  });
});

companySchema.post('findOneAndRemove', company => {
  let Job = mongoose.model('Job');
  let User = mongoose.model('User');
  User.updateMany(
    { currentCompany: company._id },
    { currentCompany: null }
  ).then(() => {
    console.log('POST HOOK RAN');
  });
  Job.remove({ company: company._id }).then(() => {
    console.log('POST HOOK RAN');
  });
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
