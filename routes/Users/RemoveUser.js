const router = require('express').Router();
const validator = require('validator');
const { t } = require('typy');
const axios = require('axios');
const qs = require('qs');

const User = require('../../models/User');


router.delete('/', (req, res) => {
    const email = t(req, 'body.email').safeObject;
    const password = t(req, 'body.password').safeObject;

    if (email === undefined) {
        return res.status(400).send({ error: true, message: 'Email is mandatory'});
    }

    if (password === undefined) {
        return res.status(400).send({ error: true, message: 'Password is mandatory'});
    }

    const data = qs.stringify({email, password});
    const config = {
        method: 'post',
        url: 'http://localhost:3000/auth/login',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      
      axios(config)
      .then((response) => {
        const reponseValue = response.data;
        if (!reponseValue.success) {
            return res.status(403).send({ success: false, message: 'Unauthorize access. Cannot delete user'});
        } 
         // delete the user
         User.findOneAndDelete({ email }).then((document) => {
            console.log(document);
            return res.status(200).send({
                success: true,
                message: 'User successfully delete'
            })
        }).catch(() => {
            return res.status(403).send({ success: false, message: 'Cannot delete user. Try again.'});
        });
      })
      .catch(() => {
        return res.status(500).send({ error: true, message: 'Internal server error'});
      });
      
});


module.exports = router;