const express = require("express")
const router = express.Router()

//import the course controller

// const{
//     createCourse,
//     getAllCourses,
//     getCourseDetails,
// } = require("../../controllers/Course.js")
const  CourseControllers = require("../../controllers/Course.js")

//category controllers import
// const{
//     showAllCategories,
//     createCategory,
//     categoryPageDetails
// } = require("../../controllers/Category.js")
const  CategoryController = require("../../controllers/Category.js")

//sections controllers Imports
// const{
//     createSection,
//     updateSection,
//     deleteSection
// } = require("../../controllers/Section.js")

const sectionController = require("../../controllers/Section.js")

//Sub- Section controller Import
// const{
//     createSubSection,
//     updateSubSection,
//     deleteSubSection
// } = require("../../controllers/SubSection.js")

const subSectionController = require("../../controllers/SubSection.js")

//Rating controller Import

// const{
//     createRating,
//     getAverageRating,
//     getAllRating
// } = require("../../controllers/RatingAndReview.js")

const ratingAndReviewsController = require("../../controllers/RatingAndReview.js")

//Import middleware
 const{auth ,isInstructor , isStudent ,isAdmin} = require("../../middlewares/auth.js")
const { create } = require("../../models/User.js")


 //*********************************************************************************
 //                   Course routes
 //*********************************************************************************

 //course can only created by Instructor
 router.post("/createCourse" , CourseControllers.createCourse)
 //Add a Section to a course
 router.post("/addSection", sectionController.createSection)
 //update a section 

 router.post("/updateSection",sectionController.updateSection)
 //delete a Section
 router.post("/deleteSection" ,sectionController.deleteSection)
 //Edit Subsection
//  router.post("/updateSubSection" ,subSectionController.updateSubSection)
 //delete subsection
//  router.post("/deleteSubSection" ,deleteSubSection)
 //Add a Sub Section to a Section
 router.post("/addSubSection" ,subSectionController.createSubSection)
 //Get All registered courses
 router.get("/getAllCourses" , CourseControllers.showAllCourses)
 //get Details for a specific Courses
 router.get("/getCourseDetails" , CourseControllers.getCourseDetails)

 //category can be created by only admin
 router.post("/createCategory", CategoryController.createCategory)
 router.get("/showAllCategories" ,CategoryController.showAllCategory)
 router.post("/getCategoryPageDetails" ,CategoryController.categoryPageDetails)


 //***************************************************************************** */
                     //Rating and Reviews
 //***************************************************************************** */
 router.post("/createRating"  ,ratingAndReviewsController.createRating)
 router.post("/getAverageRating" ,ratingAndReviewsController.getAverageRating)
 router.get("/getReviews", ratingAndReviewsController.getAllRating)

 module.exports = router