const mongoose = require('mongoose');

const failedOtpAttemptSchema = new mongoose.Schema({
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
failedOtpAttemptSchema.index({ expireAt: 1 }, { expireAfterSeconds: 86400 });

const FailedOtpAttempt = mongoose.model('FailedOtpAttempt', failedOtpAttemptSchema);
module.exports = FailedOtpAttempt;