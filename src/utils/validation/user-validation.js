const Joi = require("joi");


exports.registerUserValidation = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Invalid mobile number format',
    })
});