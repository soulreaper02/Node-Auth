const router = require('express').Router();

router.use('/create-user', require('./CreateUser'));

module.exports = router;