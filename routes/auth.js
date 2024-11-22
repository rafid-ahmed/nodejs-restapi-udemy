const express = require('express');
const body = require('express-validator').body;

const router = express.Router();

router.put('/signup');

const userController = require('../controllers/auth');

