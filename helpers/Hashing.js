const bcrypt = require('bcrypt');
const e = require('express');
const JWT = require('jsonwebtoken');
const { resolve } = require('path');
const { t } = require('typy');

const createHash = (plainPassowrd) => new Promise((resolve, reject) => {
    const password = t(plainPassowrd).safeObject;
    const saltRounds = 10;

    if (password === undefined) {
        const error = new Error('function requires a string to be hashed.');
        reject(error);
    }

    bcrypt.hash(password, saltRounds, function(err, hash) {
       if (err) {
        reject(err);
       }

       resolve(hash);
    });
});


const compareHash = (plainPassowrd, hash) => new Promise(async (resolve, reject) => {
    const result = await bcrypt.compareSync(plainPassowrd, hash);
    if (!result) {
        const error = new Error('Password Mismatch')
        reject(error);
    }

    resolve(result)
});


const createJWT = (data) => new Promise((resolve, reject) => {
    const payload = {
        email: t(data, 'email').safeObject,
        user_id: t(data, '_id').safeObject.toString(),
    }

    JWT.sign(payload, process.env.JWT_KEY, (err, token) => {
        if (err) {
            reject(err)
        }

        resolve(token);
    })
});

module.exports = {
    createHash,
    createJWT,
    compareHash
};