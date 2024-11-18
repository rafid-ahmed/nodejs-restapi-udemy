const validationResult = require('express-validator').validationResult;

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: 1,
            title: 'My new car',
            content: 'Won LAMBO in a Lottery!',
            imageUrl: 'images/lambo.jpg',
            creator: {
                name: 'Zoro'
            },
            createdAt: new Date()
        }]
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({message: 'Validation Failed!', errors: errors.array()});
    }
    const title = req.body.title;
    const content = req.body.content;

    // create post in database
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            _id: new Date().toISOString(), 
            title: title, 
            content: content,
            creator: {
                name: 'Kratos'
            },
            createdAt: new Date()
        }
    });
};