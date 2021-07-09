const router = require('express').Router();
const controllers = require('../controllers/index');
const utils = require('../lib/utils');

//register
router.get('/register', utils.authVerif, (req, res, next)=>{
    if(req.jwt){res.redirect('/')}
    else{res.render('registerPage')}
})
router.post('/register', controllers.user.user_register);

//login
router.get('/login', utils.authVerif,  (req, res) => {
    if(req.jwt){res.redirect('/')}
    else{res.render('loginPage')}
})
router.post('/login', controllers.user.user_login);

//logout
router.get('/logout', (req, res, next)=>{
    res.setHeader('Set-Cookie', [`token= ; path=/`]);
    res.status(200).redirect('/user/login');
})

//setting
router.get('/setting', utils.authVerif, controllers.user.get_user_setting)

router.post('/setting', utils.authVerif, controllers.user.post_user_setting)

module.exports = router;