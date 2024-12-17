const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {
    before(async function() {
        await mongoose.connect('mongodb+srv://rafidahmed:j6NHJpNFKcPZHR8D@mongocluster.zufav.mongodb.net/test-messages?retryWrites=true&w=majority&appName=MongoCluster');
        let post = new Post({
            title: 'Item1',
            imageUrl: 'item1_imageUrl',
            content: 'Item1_desc',
            creator: '672754fa755b0a29bb4db033',
            _id: '675c8354087a967ff841c992'
        });
        await post.save();
        post = new Post({
            title: 'Item2',
            imageUrl: 'item2_imageUrl',
            content: 'Item2_desc',
            creator: '672754fa755b0a29bb4db033',
            _id: '675c8354087a967ff841c993'
        });
        await post.save();
        post = new Post({
            title: 'Item3',
            imageUrl: 'item3_imageUrl',
            content: 'Item3_desc',
            creator: '672754fa755b0a29bb4db033',
            _id: '675c8354087a967ff841c994'
        });
        await post.save();
        const user = new User({
            email: 'test@test.com',
            password: 'tester',
            name: 'Test',
            posts: ['675c8354087a967ff841c992', '675c8354087a967ff841c993', '675c8354087a967ff841c994'],
            _id: '672754fa755b0a29bb4db033'
        });
        await user.save();
    });

    it('GET /status - should pass with code 200 and status', async function() {
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

        await FeedController.getStatus(req, res, () => {});
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('New Here!');
    });

    it('PUT /status - should pass with code 200, message and updated status', async function() {
        const req = {
            userId: '672754fa755b0a29bb4db033',
            body: {
                status: 'Here We Go!'
            }
        };
        
        const res = {
            statusCode: 500,
            message: null,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function({message, status}) {
                this.message = message;
                this.userStatus = status;
            }
        };

        await FeedController.updateStatus(req, res, () => {});
        expect(res.statusCode).to.be.equal(200);
        expect(res.message).to.be.equal('Status Updated.');
        expect(res.userStatus).to.be.equal('Here We Go!');
    });

    it('POST /post - should pass with ', async function() {
        const req = {
            userId: '672754fa755b0a29bb4db033',
            body: {
                title: 'Test Post',
                content: 'Dummy test post',
            },
            file: {
                path: 'dummy path'
            }
        };

        const res = {
            statusCode: 500,
            message: null,
            post: null,
            creator: {
                _id: 0,
                name: 0
            },
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function({message, post, creator}) {
                this.message = message;
                this.post = post;
                this.creator = creator;
            }
        };

        const savedUser = await FeedController.createPost(req, res, () => {});
        expect(res.statusCode).to.be.equal(201);
        expect(res.post).not.to.be.null;
        expect(res.creator).not.to.be.undefined;
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(4);
    });

    it('GET /posts - should pass with a message and total number of posts - req unspecified', async function() {
        const req = {
            query: {

            }
        };

        const res = {
            statusCode: 500,
            message: null, 
            posts: [],
            totalItems: 0,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function({message, posts, totalItems}) {
                this.message = message;
                this.posts = posts;
                this.totalItems = totalItems;
            }
        };

        await FeedController.getPosts(req, res, () => {});
        expect(res.statusCode).to.be.equal(200);
        expect(res.message).to.be.equal('Fetched posts successfully!');
        expect(res.posts).is.length(2);
    });

    it('GET /posts - should get posts with a message and total number of posts - req specified', async function() {
        const req = {
            query: {
                page: 2,
                perPage: 2
            }
        };

        const res = {
            statusCode: 500,
            message: null, 
            posts: [],
            totalItems: 0,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function({message, posts, totalItems}) {
                this.message = message;
                this.posts = posts;
                this.totalItems = totalItems;
            }
        };

        await FeedController.getPosts(req, res, () => {});
        expect(res.statusCode).to.be.equal(200);
        expect(res.message).to.be.equal('Fetched posts successfully!');
        expect(res.posts).is.length(2);
        expect(res.posts[0].title).to.be.equal('Item3');
    });
    
    after(async function() {
        await User.deleteMany({});
        await Post.deleteMany({});
        await mongoose.disconnect();
    });
})