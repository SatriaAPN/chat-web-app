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

    console.log('its working ya habibi');

    //checking if email already exist in the database
    const user = await User.findOne({email: req.body.email});
    if(user){
        res.status(401).send('the email already registered')
        return;
    };

    console.log('its working ya habibi2');

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
    console.log('berhasil user login');
}