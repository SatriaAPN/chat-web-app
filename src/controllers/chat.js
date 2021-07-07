const Chat = require('../models/Chat');
const User = require('../models/User');
const { ...validation } = require('../joiSchema/validation');
const utils = require('../lib/utils');

exports.chat_open_all = async(req, res, next) => {
    if(!req.jwt){
        res.redirect('/user/login')
        return;
    }

    //checking the chat in the database
    const findChat = await Chat.find({receiverId: req.jwt.sub});
    const user = [];
    for(let as of findChat){
        if(user.indexOf(as.senderId)<0){
            user.unshift(as.senderId);
        }
    }

    for(let i=0; i<user.length; i++){
        let foundUser = await User.findOne({_id: user[i]});
        user[i] = {'senderId': user[i], 'senderUsername': foundUser.username};
    }
    console.log(user)
    res.status(200).render('home',{'selectedChat': [], 'chat' : user, 'sender': ''} );
}

exports.chat_open_by_id = async(req, res, next) => {
    if(!req.jwt){
        res.redirect('/user/login')
        return;
    }

    //checking the chat in the database
    const findChat = await Chat.find({receiverId: req.jwt.sub});
    
    const user = [];
    for(let as of findChat){
        if(user.indexOf(as.senderId)<0){
            user.unshift(as.senderId);
        }
    }


    for(let i=0; i<user.length; i++){
        let foundUser = await User.findOne({_id: user[i]});
        user[i] = {'senderId': user[i], 'senderUsername': foundUser.username};
    }

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

    res.status(200).render('home',{'selectedChat': sortedChat, 'chat' : user, 'sender': req.params.id} );
}

exports.chat_send_by_id = async(req, res, next) => {
    //checking the authorization
    if(!req.jwt){
        res.redirect('/user/login')
        return;
    }

    console.log(req.body);

    //validating the data
    const {error} = validation.chatSendValidation({
        text: req.body.text,
        receiverId: req.params.id
    });
    if(error){
        console.log(error)
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

