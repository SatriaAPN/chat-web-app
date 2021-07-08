const router = require('express').Router();


router.use('/',  require('./home'));

router.use('/user', require('./user'));

router.use('/chat', require('./chat'));

module.exports = router;