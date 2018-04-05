const mongoose = require('mongoose');
const User = require('./user');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
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
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
}, {
    timestamps: true
});

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

companySchema.post('findOneAndModify', company => {
    User.findOneAndUpdate(company.user, { $addToSet: { companies: company._id } }).then(() => {
        console.log('POST HOOK RAN');
    });
});

companySchema.post('findOneAndRemove', company => {
    User.findOneAndUpdate(company.user, { $pull: { companies: company._id } }).then(() => {
        console.log('POST HOOK RAN');
    });
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;