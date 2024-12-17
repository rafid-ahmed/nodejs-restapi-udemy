const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Sign Up', function() {
    before(async function() {
        await mongoose.connect('mongodb+srv://rafidahmed:j6NHJpNFKcPZHR8D@mongocluster.zufav.mongodb.net/test-messages?retryWrites=true&w=majority&appName=MongoCluster');
    });

    it('POST /signup - should pass with code 201, message and userId', async function() {
        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester',
                name: 'Tester'
            }
        };

        const res = {
            statusCode: 500,
            message: null,
            userId: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function({message, userId}) {
                this.message = message;
                this.userId = userId;
            }
        };
        
        await AuthController.signup(req, res, () => {});
        expect(res.statusCode).to.be.equal(201);
        expect(res.message).to.be.equal('User created!');
        expect(res.userId).to.not.be.null;
    });

    after(async function() {
        await User.deleteMany({});
        await mongoose.disconnect();
    });
})

describe('Auth Controller - Login', function() {
    before(async function() {
        await mongoose.connect('mongodb+srv://rafidahmed:j6NHJpNFKcPZHR8D@mongocluster.zufav.mongodb.net/test-messages?retryWrites=true&w=majority&appName=MongoCluster');
        const hashedPassword = await bcrypt.hash('tester', 12);
        const user = new User({
            email: 'test@test.com',
            password: hashedPassword,
            name: 'Test',
            posts: [],
            _id: '672754fa755b0a29bb4db033'
        });
        await user.save();
    });

    it('POST /login - should throw error with code 404 if username cannot be found', async function() {
        const req = {
            body: {
                email: 'test2@test.com',
                password: 'tester'
            }
        }
        
        const result = await AuthController.login(req, {}, () => {});
        expect(result).to.be.an('Error', 'This email could not be found.');
        expect(result).to.have.property('statusCode', 404);
    });

    it('POST /login - should throw error with code 401 if password does not match', async function() {
        const req = {
            body: {
                email: 'test@test.com',
                password: 'wrongpass'
            }
        }

        const result = await AuthController.login(req, {}, () => {});
        expect(result).to.be.an('Error', 'Wrong password.');
        expect(result).to.have.property('statusCode', 401);
    });

    it('POST /login - should pass with code 200, token and userId', async function() {
        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        }
        const res = {
            statusCode: 500,
            token: null,
            userId: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function({token, userId}) {
                this.token = token;
                this.userId = userId;
            }
        };
        
        await AuthController.login(req, res, () => {});
        expect(res.statusCode).to.be.equal(200);
        expect(res.token).to.not.be.null;
        expect(res.userId).to.not.be.null;
    });

    after(async function() {
        await User.deleteMany({});
        await mongoose.disconnect();
    });
})