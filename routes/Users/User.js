const router = require('express').Router();

router.use('/create-user', require('./CreateUser'));
router.use('/login', require('./AuthenticateUser'));
router.use('/delete-user', require('./RemoveUser'));

module.exports = router;