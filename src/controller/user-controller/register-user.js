const userServices = require("../../service/user.service");
const { registerUserValidation } = require("../../utils/validation/user-validation");


const registerUser = async (request, response) => {
    try {
        const { name, email, mobile } = request.body;

        //check validation
        const validationResult = await registerUserValidation.validate({ name, email, mobile: mobile?.toString() }, { abortEarly: true });
        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
        };

        //Check with this mobile no user already exist or not
        const isUserExist = await userServices.getUserByMobile(String(mobile));
        if (isUserExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "User already register with this mobile number."
            })
        };

        const dataToInsert = {
            name: name?.toLowerCase(),
            email,
            mobile
        };

        const result = await userServices.addUser(dataToInsert);
        if (result?._id) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "User register successfully."
            })
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to register user, Please try again!"
            })
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = registerUser