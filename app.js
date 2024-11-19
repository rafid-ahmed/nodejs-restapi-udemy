const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const { stat } = require('fs');

const app = express();

// mongodb connect string
const MONGODB_URI = 'mongodb+srv://rafidahmed:j6NHJpNFKcPZHR8D@mongocluster.zufav.mongodb.net/messages?retryWrites=true&w=majority&appName=MongoCluster';

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/feed', feedRoutes);
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const msg = err.message;
    res.status(status).json(msg);
})

mongoose.connect(MONGODB_URI)
.then(() => {
    app.listen(8080);
})
.catch(err => console.log(err));