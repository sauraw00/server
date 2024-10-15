const { default: mongoose } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require('../models/User');
const mailSender = require("../utils/mailSender");
//const {courseEnrollmentEmail} = requrie("../mail/templetes/courseEnrollmentEmail");

//capture the payment and initiate the rozerpay order
const capturePayment= async(req,res) =>{

    //get courseId and userId
    const {course_id} = req.body;
    const userId = req.user.id;
    //validation
    //valid courseId
    if(!course_id){
        return res.json({
            success:false,
            message:"please provide valid course ID",
        })
    }

    //valid courseDetails
    let course;

    try {
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:true,
                message:"Could not find the course"
            })
        }

        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled"
            })
        }
        

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }
    //order create
    const amount = course.price;
    const currency = "INR"

    const options = {
        amount:amount *100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            message:"Could not find the course"
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Could not initiate order",
        })
        
    }
    //return response

    

};
module.exports = capturePayment;


//verify signature of razorpay and server_______________>

const verifySignature = async (req,res) =>{
   const webhookSecret ="12345678";

   const signature = req.headers["x-razorpay-signature"];

   const shasum = crypto.createHmac("sha256",webhookSecret);
   //convert into string
   shasum.update(JSON.stringify(req.body));
   //
   const digest = shasum.digest("hex");

   if(signature===digest){
    console.log("Payment is Authorized");

    const {courseId , userId} = req.body.payload.payment.entity.notes;
   
    // filfull the action after the payment done successfully enroll studnet in the course...


    try {
        //find the course and enroll the student in it..
        const enrolledCouse = await Course.findOneAndUpdate({_id:courseId},
                                                           { $push:{studentEnrolled:userId}},
                                                           {new:true},
        );
        if(!enrolledCouse){
            return res.status(500).json({
                success:false,
                message:"Course not Found",
            });
        }

        console.log(enrolledCouse);

        //find the student and add course to their list enrolled courses me
        const enrolledStudent = await User.findOneAndUpdate(
                                                           {_id:userId},
                                                           {$push:{courses:courseId}},
                                                           {new:true},
        );
        console.log(enrolledStudent);

         
        //SEND confirmation mail to student
        const emailResponse = await mailSender(
                                             enrolledStudent.email,
                                             "Congratulation form codehelp",
                                             "Congratulation , You are onboarded into new Codehelp Course"


        );
        console.log(emailResponse);
        return res.status(200).json({
            success:true,
            message:"Signature verified and course added"
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

   }
   else{
      return res.status(400).json({
        success:false,
        message:'Invalid request',
      })
   }
   
};

module.exports = verifySignature;