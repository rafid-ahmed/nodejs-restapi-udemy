const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');

module.exports = {
    createUser: async function ( {userInput}, req) {
        const errors = [];
        if (!validator.isEmail(userInput.email))
        {
            errors.push(new Error('Email is invalid'));
        }
        if (!validator.isLength(userInput.email, {min: 5}))
        {
            errors.push(new Error('Password too short'));
        }
        if (errors.length > 0) {
            const error = new Error('invalid input');
            throw error;
        }
        const existingUser = await User.findOne({email: userInput.email});
        if (existingUser) {
            const error = new Error('User already exists!');
            throw error;
        }
        const hashpw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            password: hashpw,
            name: userInput.name
        });

        const createdUser = await user.save();

        return { ...createdUser._doc, _id: createdUser._id.toString() };
    }
};