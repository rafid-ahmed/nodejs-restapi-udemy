const validationResult = require('express-validator').validationResult;

const User = require('../models/user');

exports.signup = (req, res, next ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors;
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
}