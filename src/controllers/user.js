const { ...validation } = require('../joiSchema/validation');
const User = require('../models/User'); 
const utils = require('../lib/utils');

exports.user_register = async(req, res, next) => {
    //validating the data
    const {error} = validation.userRegisterValidation(req.body);
    if(error){
        res.status(422).render('registerPage',{'message': error.details[0].message});
        return;
    };

    //checking if email already exist in the database
    const user = await User.findOne({email: req.body.email});
    if(user){
        res.status(422).render('registerPage',{'message': 'the email already registered'});
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

        //issued a authorization token 
        const tokenObject = utils.issueJWT(registeredUser);
        res.setHeader('Set-Cookie', [`token=${tokenObject.token}; path=/; expires=Thu, 01 Jan 2022 00:00:00 GMT;Secure; HttpOnly`]);
        res.status(200).redirect('/');
    } catch (err) {
        res.status(500).render('registerPage',{'message': 'an error occured in the system, try again in a moment'});
    }
}

exports.user_login = async(req, res, next) => {
    try{
        //validating the data
        const {error} = validation.userLoginValidation(req.body);
        if(error){
            res.status(422).render('loginPage',{'message': error.details[0].message});
            return;
        };

        //checking if email already exist in the database
        const user = await User.findOne({email: req.body.email});
        if(!user){
            res.status(403).render('loginPage',{'message': 'account did not exist'});
            return;
        };

        //validate the password
        const validPassword = await utils.verifyPassword(req.body.password, user.hash, user.salt);
        if(validPassword){
            //issued a authorization token 
            const tokenObject = utils.issueJWT(user);
            res.setHeader('Set-Cookie', [`token=${tokenObject.token}; path=/; expires=Thu, 01 Jan 2022 00:00:00 GMT;Secure; HttpOnly`]);
            res.status(200).redirect('/');
            return;
        }else{
            res.status(403).render('loginPage',{'message': 'you input wrong password'});
            return;
        }
    }catch(err){
        res.status(500).render('loginPage',{'message': 'an error has occured in the system, please try again later'});
    }
}