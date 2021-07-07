const router = require('express').Router();


router.use('/',  require('./chat'));
router.use('/user', require('./user'));


module.exports = router;