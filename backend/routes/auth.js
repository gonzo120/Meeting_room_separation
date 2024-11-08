const express = require('express');
const User = require('../models/user');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const router = express.Router();

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom(async(email)=> {
                const user = await User.findByEmail(email);
                if (user[0].length > 0) {
                    return Promise.reject('Email address already exists!');
                }
            })
            .normalizeEmail(),
        body('password').trim().isLength({ min: 7 }),
        body('username').trim().not().isEmpty(),
    ], authController.signup
);

router.post('/login', authController.login);

module.exports = router;