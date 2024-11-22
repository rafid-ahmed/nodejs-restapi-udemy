const express = require('express');
const body = require('express-validator').body;

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({email: value.email})
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-mail already exists!')
            }
        })
    }),
    body('password').trim().isLength({min: 5}),
    body('name').trim().notEmpty()
], authController.signup);

module.exports = router;
