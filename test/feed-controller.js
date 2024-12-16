const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {
    before(function(done) {
        mongoose.connect('mongodb+srv://rafidahmed:j6NHJpNFKcPZHR8D@mongocluster.zufav.mongodb.net/test-messages?retryWrites=true&w=majority&appName=MongoCluster')
        .then(() => {
            const user = new User({
                email: 'test@test.com',
                password: 'tester',
                name: 'Test',
                posts: [],
                _id: '672754fa755b0a29bb4db033'
            });
            return user.save();
        })
        .then(() => {
            done();
        });
    })

    it('should send a response with a valid status for existing user', function(done) {
        const req = {
            userId: '672754fa755b0a29bb4db033'
        };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStatus = data.status;
            }
        };
        FeedController.getStatus(req, res, () => {})
        .then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('New Here!');
            done();
        });
    });
    
    after(function(done) {
        User.deleteMany({}).then(() => {
            return mongoose.disconnect();
        })
        .then(() => {
            done();
        });
    })
})