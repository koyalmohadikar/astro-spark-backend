const Joi = require("joi");


exports.mobileNoValidation = Joi.object({
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Invalid mobile number format',
    }),
});

//validation for login
exports.otpValidation = Joi.object().keys({
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Invalid mobile number format',
    }),
    otp: Joi.string().min(4).max(4).required(),
});