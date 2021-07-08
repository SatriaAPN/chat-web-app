const router = require('express').Router();
const controllers = require('../controllers/index');
const utils = require('../lib/utils');

router.get('/newchat', utils.authVerif, (req, res, next)=>{
    if(!req.jwt){res.redirect('/user/login')}
    else{res.render('newChatPage')}
});

router.post('/newchat', utils.authVerif, controllers.chat.chat_send_by_id);

module.exports = router;