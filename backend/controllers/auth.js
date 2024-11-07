const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { email, password, username } = req.body;
    const tipoUsuarioId = 1; // Asigna el tipoUsuarioId genérico aquí

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User(null, username, email, hashedPassword, tipoUsuarioId);
        await user.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (err) { 
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(422).json({ message: 'Email address already exists!' });
        }
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }  
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.loginFindByEmail(email);
        if (user[0].length === 0) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        const storedUser = user[0][0];
        const isEqual = await bcrypt.compare(password, storedUser.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: storedUser.email,
                userType: storedUser.nombre
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
        );
        res.status(200).json({ token: token, userType   : storedUser.nombre, userId: storedUser.id_usuario });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};