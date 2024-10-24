const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

 //createRating
 const createRating = async(req,res) =>{
     try {
        

        //get user id
        const userId = req.user.id;
        //fetching data from user body
        const {rating ,review , courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
                                     {_id:courseId,
                                        studentEnrolled: {$elemMatch: {$eq: userId}},
                                     });
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course'
            })
        }         
        //check if user already recived the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                 user:userId,
                                                 course:courseId
                                              });
        
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:'Course is already reviewed by the user'
            });
        }
        //create rating and reviews
         const ratingReview = await RatingAndReview.create({
                                                    rating,review,
                                                    course:courseId,
                                                    user:userId

                                                       });
        //update course with this rating/review
        const updatedCourseDetails =await Course.findByIdAndUpdate({_id:courseId},
                                    {
                                        $push:{
                                            ratingAndReviews:ratingReview._id,
                                        }
                                    },
                                {new:true});

        console.log(updatedCourseDetails);
        //return response   

        return res.status(200).json({
            success:true,
            message:'Rating and Review created successfully',
            ratingReview,
        })

     } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
     }
 }
 //module.exports = createRating;

 //get average Rating______________________>

 const getAverageRating = async(req,res) =>{
    try {

        //get course ID
        const courseId = req.body.courseId;
        //calculate avg rating  //'GOOGLE AGGREGATE'
        const result = await RatingAndReview.aggregate([
                {
                  $match:{
                    //match this courseId's with rated course
                    course: new mongoose.Types.ObjectId(courseId),
                  },
                },
                {    // group all rating pass id as null ..use avg operator for average
                      $group:{
                        _id:null,
                        averageRating:{ $avg:"$rating" },
                      }
                }
        ]);


        //return rating 
        if(result.length > 0){

            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }      
        
        //if no rating/review exist
        return res.status(200).json({
            success:true,
            message:'Average Rating is 0, no rating given till now',
            averageRating:0,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
 }
 //module.exports = getAverageRating;

  //get all Rating and Review___________________________>

 const getAllRating = async(req,res) =>{
     try {
        //all rating and reviews
        const allReviews = await ratingAndReviews.find({})
                                                       .populate({
                                                        path:"user",
                                                        select:"firstName lastName email image"
                                                       })
                                                       .populate({
                                                        path:"course",
                                                        select:"courseName",
                                                       })
                                                       .exec();

       return res.status(200).json({
        success:true,
        message:"All reviews fetched successfully",
        data:allReviews,
       })  
        
     } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
     }
 }

 module.exports = {
    getAllRating,
    createRating,
    getAverageRating
 }

 