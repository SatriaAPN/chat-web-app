const { ...validation } = require('../joiSchema/validation');
const User = require('../models/User'); 
const utils = require('../lib/utils');

exports.user_register = async(req, res, next) => {
    //validating the data
    const {error} = validation.userRegisterValidation(req.body);
    if(error){
        res.status(401).send(error.details[0].message)
        return;
    };



    //checking if email already exist in the database
    const user = await User.findOne({email: req.body.email});
    if(user){
        res.status(401).send('the email already registered')
        return;
    };



    //generate salt and create hash password
    const saltHash = utils.genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        hash: hash,
        salt: salt
    });

    //save the user to the database
    try {
        const registeredUser = await newUser.save();
        if(registeredUser) {res.status(200).json({ success: true, user: user })}
        else {throw new Error('the user did not registered!!')}
    } catch (err) {
        res.json({ success: false, msg: err });
    }
}

exports.user_login = async(req, res, next) => {
    try{
        //validating the data
        const {error} = validation.userLoginValidation(req.body);
        if(error){
            res.status(401).send(error.details[0].message)
            return;
        };

        //checking if email already exist in the database
        const user = await User.findOne({email: req.body.email});
        if(!user){
            res.status(401).send('the email did not exist');
            return;
        };

        //validate the password
        const validPassword = await utils.verifyPassword(req.body.password, user.hash, user.salt);
        if(validPassword){
            const tokenObject = utils.issueJWT(user);
            res.setHeader('Set-Cookie', [`token=${tokenObject.token}; path=/; expires=Thu, 01 Jan 2022 00:00:00 GMT;Secure; HttpOnly`]);
            res.status(200).redirect('/');
            return;
        }else{
            res.status(401).send('password is not correct');
            return;
        }
    }catch(err){
        res.status(400).send(err);
    }
}