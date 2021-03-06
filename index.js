// npm packages
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// globals
dotenv.config();
const app = express();

// body parser setup
app.use(bodyParser.json({ type: '*/*' }));

const PORT = process.env.PORT || 3000;

// app imports
let userRouters = require('./routers/users');
let companyRouters = require('./routers/companies');
let jobRouters = require('./routers/jobs');

// database config
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to the database!');
  })
  .catch(err => {
    console.log(err);
  });
app.get('/', (req, res, next) =>
  res.send(
    'THE LINKED LIST API. Read about our JSON API here: <a href="https://linkedlist.docs.apiary.io/">https://linkedlist.docs.apiary.io/</a>'
  )
);
app.use('/users', userRouters);
app.use('/companies', companyRouters);
app.use('/jobs', jobRouters);

// error handler
app.use((err, req, res, next) =>
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  })
);

app.listen(PORT, () => {
  console.log(`LinkedList API is listening on port ${PORT}`);
});
