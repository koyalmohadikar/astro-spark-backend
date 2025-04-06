const userServices = require("../../service/user.service");
const { otpValidation } = require("../../utils/validation/common-validation");


const verifyLoginOtp = async (request, response) => {
    try {
        //extract data from request body
        const { mobile, otp, fcm_token } = request.body;

        //check validation
        const validationResult = await otpValidation.validate({ mobile: mobile?.toString(), otp: otp?.toString() }, { abortEarly: true });
        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
        };

        //check otp exist or not
        const isOTPExist = await userServices.getOTPByMobileNo(mobile);
        if (isOTPExist.length <= 0) {
            return response.status(200).json({
                status: "EXPIRED",
                message: "OTP expired try to resend!"
            });
        };

        //verify otp
        if (isOTPExist[isOTPExist.length - 1].otp?.toString() === otp?.toString()) {

            let userDetails = {}
            //get user details from db
            const isUserExist = await userServices.getUserByMobile(mobile);
            if (isUserExist) {
                if (fcm_token) {
                    if (!isUserExist?.fcm_token) {
                        const insertFcmToken = {
                            fcm_token
                        };
                        const saveToken = await userServices.saveDeviceToken(isUserExist?._id, insertFcmToken)
                    }
                };
                userDetails = { name: isUserExist?.name, _id: isUserExist?._id, mobile: isUserExist?.mobile, userType: isUserExist?.userType, profile: isUserExist?.profile, email: isUserExist?.email }
                const deleteOtp = await userServices.deleteOtp(mobile);
                return response.status(200).json({
                    status: "SUCCESS",
                    message: "Login Successfully",
                    userDetails
                });
            } else {
                response.status(200).json({
                    status: "FAILED",
                    message: "Failed to match otp"
                });
                return;
            }
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "OTP Mismatch, Please check otp"
            });
        }
    } catch (error) {
        response.status(500).json({
            status: "FAILED",
            message: error.message
        });
        return;
    };
};

module.exports = verifyLoginOtp;