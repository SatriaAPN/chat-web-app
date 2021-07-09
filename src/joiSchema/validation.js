const joi = require('joi');

exports.userRegisterValidation = (data) => {
    const schema = joi.object({
        username: joi.string()
            .min(6)
            .required(),
        birthday: joi.string()
            .required(),
        gender: joi.string()
            .required(),
        email: joi.string()
            .min(6)
            .required()
            .email(),
        password: joi.string()
            .min(6)
            .required()
    });

    //VALIDATE DATA
    return schema.validate(data);
}

exports.userLoginValidation = (data) => {
    const schema = joi.object({
        email: joi.string()
            .min(6)
            .required()
            .email(),
        password: joi.string()
            .min(6)
            .required()
    });

    //VALIDATE DATA
    return schema.validate(data);
}

exports.chatSendValidation = (data) => {
    const schema = joi.object({
        text: joi.string()
            .min(1)
            .required(),
        receiverId: joi.string()
            .min(6)
            .required()
    });

    //VALIDATE DATA
    return schema.validate(data);
}