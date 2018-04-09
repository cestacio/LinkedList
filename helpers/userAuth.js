const jwt = require('jsonwebtoken');
const { ApiError } = require('../helpers');
let jwtDecode = require('jwt-decode');
const JWT_SECRET_KEY = 'VERY_SECRET_CODE';

// auth required
function userAuth(req, res, next) {
    console.log('hello');
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, JWT_SECRET_KEY);
        const decoded = jwtDecode(token);
        console.log('DECODED', decoded);

        if (!decoded.username) {
            return next(
                new ApiError(401, 'Unauthorized', 'Invalid auth token')
            );
        }
        return next();
    } catch (e) {
        return next(new ApiError(401, 'Unauthorized', 'Missing auth token'));
    }
}

function ensureCorrectUser(req, res, next) {
    try {
        var token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, JWT_SECRET_KEY, function(err, decoded) {
            if (decoded.username === req.params.username) {
                return next();
            } else {
                return next(new ApiError(401, 'Unauthorized', 'Invalid auth token'));
            }
        });
    } catch (e) {
        return next(new ApiError(401, 'Unauthorized', 'Missing auth token'));
    }
}

module.exports = {
    userAuth,
    ensureCorrectUser
}