const userServices = require("../../service/user.service");
const { mobileNoValidation } = require("../../utils/validation/common-validation");

const sendLoginOtp = async (request, response) => {
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

        //check user exist or not using mobile no
        const isUserExist = await userServices.getUserByMobile(mobile);
        if (!isUserExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "User not exist with entered mobile no. Please check mobile no"
            });
        };

        //user can get only 2 otp in a day
        const isNoOfAttemptExist = await userServices.getNoOfOTPAttempt(String(mobile));
        if (isNoOfAttemptExist && isNoOfAttemptExist?.attempt === 10) {
            return response.status(200).json({
                status: "FAILED",
                message: "You have been already used all otp attempt, Please try again after 24 Hours"
            });
        }


        //generate random otp
        const otp = Math.floor(1000 + Math.random() * 9000);
        const isOTPSave = await userServices.saveOtp({ mobile, otp });
        if (isOTPSave) {
            //save the no. of attempt applied for otp
            if (!isNoOfAttemptExist) {
                let NoOfAttempt = 1
                const saveNoOfAttempt = await userServices.saveNoOTPAttempt({ mobile, NoOfAttempt, expireAt: new Date() })
            } else {
                const NoOfAttempt = isNoOfAttemptExist.attempt + 1;
                const saveNoOfAttempt = await userServices.updateNoOTPAttempt(mobile, NoOfAttempt)
            }
            return response.status(200).json({
                status: "SUCCESS",
                message: "OTP send on your mobile number.",
                otp
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to send OTP"
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    };
};

module.exports = sendLoginOtp