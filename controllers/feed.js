const validationResult = require('express-validator').validationResult;

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find()
    .then(posts => {
        res.status(200).json({
            posts: posts
        });
    })
    .catch(err => console.log(err));
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({message: 'Validation Failed!', errors: errors.array()});
    }
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title, 
        imageUrl: 'images/knife.jpg',
        content: content,
        creator: {
            name: 'Kratos'
        },
    });
    post.save()
    .then(result => {
        res.status(201).json({
            message: 'Post created successfully!',
            post: result
        });
    })
    .catch(err => console.log(err));
};