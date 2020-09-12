const router = require('express').Router();
const validator = require('validator');
const { t } = require('typy');

const {
    compareHash
} = require('../../helpers/Hashing');
const User = require('../../models/User');

router.post('/', (req, res) => {
    const email = t(req, 'body.email').safeObject;
    const password = t(req, 'body.password').safeObject;

    if (t(email).isNullOrUndefined) {
        res.status(403).send({
            error: true,
            message: 'Invalid input parameter. Email is mandatory'
        });
    }

    if (t(password).isNullOrUndefined) {
        res.status(403).send({
            error: true,
            message: 'Invalid input parameter. Password is mandatory'
        });
    }


    const isEmailValid = validator.isEmail(email);
    const isPasswordStrong = !validator.isAlpha(password)
    const isPasswordLong = password.length >= 6 ? true : false

    if (!isEmailValid) {
        return res.status(400).send({ error: true, message: 'Email is not valid'});
    }

    if (!isPasswordStrong) {
        return res.status(400).send({ 
            error: true, 
            message: 'Password should contain NUMBERS & LETTERS'
        });
    }

    if (!isPasswordLong) {
        return res.status(400).send({ 
            error: true, 
            message: 'Password should contain more than 6 characters'
        });
    }

    User.findOne({ email }).then((document) => {
        if (t(document).isNullOrUndefined) {
            return res.status(203).send({ 
                success: false, 
                message: 'Email does not exist. Please signup'
            });
        }
        const hashedPassword = t(document, 'password').safeObject;
        compareHash(password, hashedPassword).then((result) => {
            if (result) {
                return res.status(200).send({
                    success: true,
                    message: 'Successful login.'
                });
            }
        }).catch(() => {
            return res.status(200).send({
                success: false,
                message: 'Invalid Email or Password'
            });
        })
    }).catch(() => {
        return res.status(500).send({ 
            error: true, 
            message: 'Internal server error'
        });
    })
});


module.exports = router;