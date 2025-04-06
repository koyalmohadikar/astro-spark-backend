const userServices = require("../../service/user.service");
const { mobileNoValidation } = require("../../utils/validation/common-validation");


const resendOtp = async (request, response) => {
    try {
        const { mobile } = request.body;

        //check validation
        const validationResult = await mobileNoValidation.validate({ mobile: mobile?.toString() }, { abortEarly: true });
        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
        };

        //Check attempts Of OTP
        const isNoOfAttemptExist = await userServices.getNoOfFailedOTPAttempt(String(mobile));
        if (isNoOfAttemptExist && isNoOfAttemptExist?.attempt === 2) {
            return response.status(200).json({
                status: "FAILED",
                message: "You have been already used all otp attempt, Please try again after 24 Hours"
            });
        }

        //generate random otp
        const OTP = Math.floor(1000 + Math.random() * 9000);

        const dataToInsert = {
            mobile,
            OTP,
            expireAt: new Date()
        }

        const isOTPSave = await userServices.saveOtp(dataToInsert);


        //save the no. of attempt applied for otp
        if (!isNoOfAttemptExist) {
            let NoOfAttempt = 1
            const saveNoOfAttempt = await userServices.saveNoOfFailedOTPAttempt({ mobile, NoOfAttempt, expireAt: new Date() })
        } else {
            const NoOfAttempt = isNoOfAttemptExist.attempt + 1;
            const saveNoOfAttempt = await userServices.updateNoOfFailedOTPAttempt(mobile, NoOfAttempt)
        };

        if (isOTPSave) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "OTP send on your mobile number.",
                OTP
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to send OTP",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
};

module.exports = resendOtp;