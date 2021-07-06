const joi = require('joi');

exports.userRegisterValidation = (data) => {
    const schema = joi.object({
        username: joi.string()
            .min(6)
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