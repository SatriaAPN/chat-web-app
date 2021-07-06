const router = require('express').Router();
const controllers = require('../controllers/index');
const { ...user } = require('../controllers/user');


router.post('/register', controllers.user_register);
router.post('/login', controllers.user_login);

module.exports = router;