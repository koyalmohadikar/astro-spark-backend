const mongoose = require('mongoose');

const otpAttemptSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true
    },
    attempt: {
        type: Number,
        required: true
    },
    expireAt: {
        type: Date,
        required: true,
        default: () => new Date()
    }
});

// TTL index to auto-delete document after 1 day
otpAttemptSchema.index({ expireAt: 1 }, { expireAfterSeconds: 86400 });

const otpAttempt = mongoose.model('otpAttempt', otpAttemptSchema);
module.exports = otpAttempt;