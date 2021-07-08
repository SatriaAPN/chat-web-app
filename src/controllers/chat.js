const Chat = require('../models/Chat');
const User = require('../models/User');
const { ...validation } = require('../joiSchema/validation');
const utils = require('../lib/utils');

exports.chat_open_all = async(req, res, next) => {
    if(!req.jwt){
        res.redirect('/user/login')
        return;
    }


    //the side chat notification(finding list of people that chatting you or you chatting them)
    const result = await utils.sideChatSorting(req);
 

    res.status(200).render('home',{'selectedChat': [], 'chat' : result, 'sender': ''} );
}

exports.chat_open_by_id = async(req, res, next) => {
    if(!req.jwt){
        res.redirect('/user/login')
        return;
    }

    //the side chat notification(finding list of people that chatting you or you chatting them)
    const result = await utils.sideChatSorting(req);

    //checking the received chat in the database
    const findChatReceived = await Chat.find({senderId: req.params.id ,receiverId: req.jwt.sub});
    if(findChatReceived.length<1){
        res.redirect('/')
        return;
    }

    //checking the sended chat in the database
    const findChatSended = await Chat.find({senderId: req.jwt.sub ,receiverId: req.params.id});
    

    //sorting the received and sended chat into an array, sort by date(oldest to most recent) 
    const sortedChat = await utils.chatSorting(findChatReceived, findChatSended);

    res.status(200).render('home',{'selectedChat': sortedChat, 'chat' : result, 'sender': req.params.id} );
}

exports.chat_send_by_id = async(req, res, next) => {
    if(req.params.id === undefined){
        receiverData = await User.findOne({email: req.body.receiver});
        if(!receiverData){
            res.status(402).send('receiver not found');
            return;
        }
        req.params.id = receiverData._id.toString();
        console.log(req.params.id);
    }
    console.log('here1')
    //checking the authorization
    if(!req.jwt){
        res.redirect('/user/login')
        return;
    }

    //validating the data
    const {error} = validation.chatSendValidation({
        text: req.body.text,
        receiverId: req.params.id
    });
    if(error){
        res.status(401).send(error.details[0].message);
        return;
    }

    //validating the receiver id
    const receiver = User.findOne({_id: req.params.id});
    if(!receiver){
        res.status(401).send('receiver did not found');
        return;
    }

    //save the chat to the database
    const newChat = new Chat({
        senderId: req.jwt.sub,
        text: req.body.text,
        receiverId: req.params.id
    })

    try{
        newChat.save();
        res.status(200).redirect(`/${req.params.id}`);
    }catch(err){
        res.status(400).send(err);
    }
    
     
}

