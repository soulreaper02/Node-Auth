const router = require('express').Router();
const bycrypt = require('');

router.get('/', (req, res) => {
    res.send({ message: 'hello' });
});

module.exports = router;