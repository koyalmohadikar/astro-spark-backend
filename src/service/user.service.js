const FailedOtpAttempt = require("../model/failed-otp-attempt-model");
const otpAttempt = require("../model/otp-attempt-model");
const Otp = require("../model/otp-model");
const User = require("../model/user-model");
const { ObjectId } = require("mongodb");


const userServices = {
    saveOtp: async (dataToInsert) => {
        try {
            return await Otp.create(dataToInsert);
        } catch (error) {
            throw error
        }
    },
    getOTPByMobileNo: async (mobile) => {
        let filter = {
            mobile: String(mobile)
        };
        try {
            return await Otp.find(filter);
        } catch (error) {
            throw error
        }
    },
    getUserByMobile: async (mobile) => {
        try {
            return await User.findOne({ mobile: String(mobile) });
        } catch (error) {
            throw error
        }
    },
    saveDeviceToken: async (id, dataToUpdate) => {
        try {
            return await User.updateOne({ _id: new ObjectId(id) }, { $set: dataToUpdate });
        } catch (error) {
            throw error;
        }
    },
    deleteOtp: async (mobile) => {
        try {
            return await Otp.deleteMany({ mobile: String(mobile) });
        } catch (error) {
            throw error
        }
    },
    addUser: async (dataToInsert) => {
        try {
            return await User.create(dataToInsert)
        } catch (error) {
            throw error
        }
    },
    getNoOfFailedOTPAttempt: async (mobile) => {
        try {
            return await FailedOtpAttempt.findOne({ mobile })
        } catch (error) {
            throw error;
        }
    },
    saveNoOfFailedOTPAttempt: async (dataToInsert) => {
        try {
            return await FailedOtpAttempt.create(dataToInsert);
        } catch (error) {
            throw error;
        }
    },
    updateNoOfFailedOTPAttempt: async (mobile, attempt) => {
        try {
            return await FailedOtpAttempt.updateOne({ mobile: mobile }, { $set: { expireAt: new Date(), attempt: attempt } });
        } catch (error) {
            throw error;
        }
    },
    getNoOfOTPAttempt: async (mobile) => {
        try {
            return await otpAttempt.findOne({ mobile: mobile });
        } catch (error) {
            throw error;
        }
    },
    saveNoOTPAttempt: async (dataToInsert) => {
        try {
            return await otpAttempt.insertOne(dataToInsert);
        } catch (error) {
            throw error;
        }
    },
    updateNoOTPAttempt: async (mobile, attempt) => {
        try {
            return await otpAttempt.updateOne({ mobile: mobile }, { $set: { expireAt: new Date(), attempt: attempt } });
        } catch (error) {
            throw error;
        }
    },
}

module.exports = userServices;