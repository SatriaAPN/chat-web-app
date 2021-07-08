const router = require('express').Router();
const controllers = require('../controllers/index');
const utils = require('../lib/utils');


router.get('/', utils.authVerif, controllers.chat.chat_open_all);

router.get('/:id', utils.authVerif, controllers.chat.chat_open_by_id);

router.post('/:id', utils.authVerif, controllers.chat.chat_send_by_id);

module.exports = router;