const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
const auth =async(req,res,next) =>{
    try {
        //extract token
        const token = req.cookies.token
                             || req.body.token
                             || req.header("Autherisation").replace("Bearer","");
    //if token missing , then return response
    if(!token) {
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            
        })
    }
    //verify the token
    try{
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;
    }
    catch(err){
        //verification - issue
        return res.status(401).json({
            success:false,
            message:"token is invalid",
        });
    }
    //go to next middleware
    next();

    }catch (error) {
        return res.status(401).json({
            success:false,
            message: 'Something went while validatng the token'
        });
        
    }
}
module.exports = auth;


//isStudent
const isStudent = async(req,res,next) =>{
try {
   if(req.user.acountType!= "Student"){
    return res.status(401).json({
        success:false,
        message:"This is a protected route for Students only"
    });

   }
   next();

} catch (error) {
    return res.status(500).json({
        success:false,
        message:'User role cannot be varified , please try again ...'
    })
}
}
module.exports = isStudent;

//isInstructor
const isInstructor = async(req,res,next) =>{
    try {
       if(req.user.acountType!= "Instructor"){
        return res.status(401).json({
            success:false,
            message:"This is a protected route for Instructor only"
        });
    
       }
       next();
       
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be varified , please try again ...'
        })
    }
    }
    module.exports = isInstructor;
    

//isAdmin
const isAdmin = async(req,res,next) =>{
    try {
       if(req.user.acountType!= "Admin"){
        return res.status(401).json({
            success:false,
            message:"This is a protected route for Admin only"
        });
    
       }
       next();
       
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be varified , please try again ...'
        })
    }
    }
    module.exports = isAdmin;
    