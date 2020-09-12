const router = require('express').Router();
const validator = require('validator');
const { t } = require('typy');

const User = require('../../models/User');
const {
    createHash,
    createJWT
} = require('../../helpers/Hashing');



router.post('/', (req, res) => {
    const email = t(req, 'body.email').safeObject;
    const password = t(req, 'body.password').safeObject;

    if (email === undefined) {
        return res.status(400).send({ error: true, message: 'Email is mandatory'});
    }

    if (password === undefined) {
        return res.status(400).send({ error: true, message: 'Password is mandatory'});
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

    createHash(password).then((hashedPassword) => {
        const createUser = new User({
            email,
            password: hashedPassword
        });


        User.findOne({ email }).then((document) => {
            if (t(document).isNullOrUndefined) {
                createUser.save((newErr, newDoc) => {
                    if (newErr) {
                        return res.status(500).send({ 
                            error: true, 
                            message: 'Error while create a user. please try again.'
                        });
                    }
                    createJWT(newDoc).then((token) => {
                        res.status(200).send({
                            success: true,
                            payload: token
                        });
                    });
                })
            } else {
                const existingEmail = t(document, 'email').safeObject;
                res.status(203).send({
                    success: false,
                    message: `${existingEmail} is already registered. Please login`
                });
            }
        }).catch(() => {
            return res.status(500).send({ 
                error: true, 
                message: 'Internal server error.'
            });
        })
    }).catch(() => {
        return res.status(500).send({ 
            error: true, 
            message: 'Internal server error.'
        });
    });
});

module.exports = router;