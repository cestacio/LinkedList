const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'abc123';
const MONGODB_URI = process.env.MONGODB_URI;
module.exports = {
  JWT_SECRET_KEY,
  MONGODB_URI
};
