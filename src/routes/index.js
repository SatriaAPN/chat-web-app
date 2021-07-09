const router = require('express').Router();


router.use('/user', require('./user'));

router.use('/chat', require('./chat'));

router.use('/',  require('./home'));


module.exports = router;