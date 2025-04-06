const resendOtp = require("../controller/otp/resend-otp");
const sendLoginOtp = require("../controller/otp/send-login-otp");
const verifyLoginOtp = require("../controller/otp/verify-otp");
const registerUser = require("../controller/user-controller/register-user");

const userRoutes = require("express").Router();

userRoutes.post("/login-otp", sendLoginOtp);
userRoutes.post("/verify-otp", verifyLoginOtp);
userRoutes.post("/register-user", registerUser);
userRoutes.post("/resend-otp", resendOtp);


module.exports = userRoutes;