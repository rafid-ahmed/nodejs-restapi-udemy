const validationResult = require('express-validator').validationResult;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const user = require('../models/user');

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

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            name: name
        });

        return user.save();
    })
    .then(result => {
        res.status(201).json({message: 'User created!', userId: result._id});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            const error = new Error('this email could not be found');
            error.statusCode = 404;
            throw error;
        }

        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(result => {
        if (!result) {
            const error = new Error('wrong password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({
            email: user.email, 
            userId: loadedUser._id.toString()
        }, 'somesuperdupersecret', {expiresIn: '1h'});
        
        res.status(200).json({token: token, userId: loadedUser._id.toString()})
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}