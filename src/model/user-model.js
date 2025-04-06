const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'member', 'agent', 'staff', 'district user', 'guest', 'member user', "financer", "financer user"]
    },
    name: {
        type: String,
        required: function () {
            return ['admin', 'member', 'agent', 'staff', 'district user', 'member user', "financer", "financer user"].includes(this.userType)
        }
    },
    email: {
        type: String,
        required: function () {
            return this.userType === "staff";
        }
    },
    profile: {
        type: String,
        required: false,
        default: null,
    },
    mobile: {
        type: String,
        required: function () {
            return ['admin', 'member', 'agent', 'staff', 'district user', 'guest', 'member user', "financer", "financer user"].includes(this.userType)
        },
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