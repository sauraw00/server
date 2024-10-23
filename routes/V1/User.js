const express = require("express");
const router = express.Router();
const {auth} = require("../../middlewares/auth");


//import auth
// const{
//     login,
//     signup,
//     sendotp,
//     changePassword
// } = require("../../controllers/Auth")

const authController = require("../../controllers/Auth");

// const {
//     resetPasswordToken,
//     resetPassword,
// } = require("../../controllers/ResetPassword");

const resetPasswordController = require("../../controllers/ResetPassword");



//**************************************************** */
//                   Authentication Routes
//**************************************************** */

//route for user login
router.post("/login",authController.login)


// localhost:4000/api/v1/user/signup 
//route for user signin
router.post("/signup", authController.signup)

//route for send otp
router.post("/sendotp", authController.sendOTP)

//route for change passsword
router.post("/changepassword",auth,authController.changePassword)

//**************************************************** */
//                     reset Password
//**************************************************** */

//route for generating a reset password token
router.post("/reset-password-token",resetPasswordController.resetPasswordToken)

//Route for resetting user's password after verification
router.post("/reset-password",resetPasswordController.resetPassword)

module.exports = router;

