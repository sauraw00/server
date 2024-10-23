const { errorMonitor } = require('nodemailer/lib/xoauth2');
const Course = require('../models/Course');
const Category = require("../models/Category");
const User = require('../models/User');
const{uploadImageToCloudinary} = require('../utils/imageUploader');

//createCourse handler function
const createCourse = async(req,res)=>{
    try {
        //fetch data 
        const {courseName, courseDescription ,whatWillYouLearn , price , category} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription ||!whatWillYouLearn || !price || !category || !thumbnail){
            return res.status(400).json(
                {
                   success:false,
                   message:"All fields are required", 
                }
            )
        }
        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details ", instructorDetails);
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:'Instructor Detail not found'
            });
        }

        //check given tag is valid or not
        const categoryDetails = await Tag.findById(category);
        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:'Instructor Detail not found'
            });
        }
        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatWillYouLearn:whatWillYouLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        //add the new course to the user schema of Instructor
        await User.findOneAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,

                }
            },
            {new:true},
        )
        //create new tag
      
        //update the tag schema

        await Course.findByIdAndUpdate(
            {_id:categoryDetails._id},
           {
            $push:{
                category:categoryDetails._id,
            }
           },
           {new:true},
        )
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Faild to create Course",
            error:error.message
        })
        
    }
}
// module.exports = createCourse;



//getAllCourses handler function
const showAllCourses = async(req,res)=>{
    try {
        const allCourses = await Course.find({},{courseName:true,
                                                 price:true,
                                                 thumbnail:true,
                                                 instructor:true,
                                                 ratingAndReviews:true,
                                                 studentEnrolled:true,
                                                 }).populate("instructor")
                                                 .exec();
        

         return res.status(200).json({
            success:true,
            message:'Data for all courses fetched successfully',
            data:allCourses,
         })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"canot course data",
            error:error.message,
        })
    
    }
}
// module.exports = showAllCourses;

//get all courses details
 const getCourseDetails = async(req,res) =>{
     try {
        //get id
        const {courseId} = req.body;

        //find course details
        const courseDetails = await Course.find(
                                     {_id:courseId})
                                     .populate({
                                        path:"instructor",
                                        populate:{
                                            path:"additionalDetails",

                                        },
                                     }
                                    )
                                     .populate("category")
                                     .populate("ratingAndReviews")
                                     .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subSection",
                                        },

                                     })
                                     .exec();
       

        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`
            });
        }
        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            data:courseDetails,
        })


     }    
     catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        });
     }
 }
 module.exports = {
    createCourse,
    showAllCourses,
    getCourseDetails,
 };