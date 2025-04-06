const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: false,
        default: null,
    },
    password: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Use a regular expression to validate the phone number format
                return /^[0-9]{10}$/g.test(value);
            },
            message: 'Mobile number must be 10 digit'
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    fcm_token: {
        type: String,
        required: false
    }
}, {
    strict: false,
    timestamps: true, // Adds createdAt and updatedAt automatically
});

const User = mongoose.model('User', userSchema);
module.exports = User;