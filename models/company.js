const mongoose = require('mongoose');

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
    employees: [{ type: String }],
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
    let User = mongoose.model('User');
    User.findOneAndUpdate(company.user, { $addToSet: { company: company._id } }).then(() => {
        console.log('POST HOOK RAN');
    });
});

companySchema.post('findOneAndRemove', company => {
    let Job = mongoose.model('Job');
    let User = mongoose.model('User');
    User.updateMany({ currentCompany: company._id }, { currentCompany: null }).then(() => {
        console.log('POST HOOK RAN');
    })
    Job.remove({ company: company._id }).then(() => {
        console.log('POST HOOK RAN');
    });
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;