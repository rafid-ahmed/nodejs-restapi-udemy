const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const graphqlHttp = require('express-graphql').graphqlHTTP;

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// mongodb connect string
const MONGODB_URI = 'mongodb+srv://rafidahmed:j6NHJpNFKcPZHR8D@mongocluster.zufav.mongodb.net/messages?retryWrites=true&w=majority&appName=MongoCluster';

app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}));
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const msg = err.message;
    // res.status(status).json(msg);
    const data = err.data;
    res.status(status).json({message: msg, data: data});
})

mongoose.connect(MONGODB_URI)
.then(() => {
    app.listen(8080);
})
.catch(err => console.log(err));