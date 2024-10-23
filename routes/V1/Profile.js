const express = require("express");
const router = express.Router();

const{auth} = require("../../middlewares/auth")
// const {
//     deleteAccount,
//     updateProfile,
//     getAllUserDetails,
//     updateDisplayPicture,
//     getEnrolledCourses
// } = require("../../controllers/Profile");

const profileController  = require("../../controllers/Profile");
const courseController= require("../../controllers/Course");




//*****************************************************
 //                  PROFILE ROUTES

//delete User account
router.delete("/deleteProfile", profileController.deleteAccount)
router.put("/updateProfile" ,auth ,profileController.updateProfile)
router.get("/getUserDetails" ,auth, profileController.getAllUserDetails)
//get enrolled courses
// router.get("/getEnrolledCourses" ,auth ,courseControllers.getEnrolledCourses)
// router.put("/updateDisplayPicture" , auth ,updateDisplayPicture)

module.exports = router;
