const { json } = require("express");
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt");

//reset password token
const resetPasswordToken = async(req, res) =>{
   try {
     //get email from req body
     const email = req.body.email;
     //check user for this email, email validation
     const user = await User.findOne({email:email});
     if(!user ){
         return res.json({
             success:false,
             message:`This Email: ${email} is not registered with us Enter a valid Email`,
         });
     }
     //generate token
     const token = crypto.randomBytes(20).toString("hex");
     //update user by adding token and expiration time
     const updateDetails = await User.findOneAndUpdate(
                                                {email:email},
                                                {
                                                 token:token,
                                                 resetPasswordExpires:Date.now() + 3600000,
                                                },
                                                //updated reseponse will return
                                                {new:true}
     )
     //create url-->>>
     //link generate use token here to unique links for reset the password
     //this link for front end rest the password
     const url = `http://localhost:3000/update-password/${token}`
 
 
     //send mail containing the url
     await mailSender(email,
                         "Password Reset link",
                         `Your Link for email verification is ${url} . please check your email to continue further`
     );
     // return response
     return res.json({
         success: true,
         message: "Email sent successfully, please check email and change password"
     });
 
     
    
   } catch (error) {
     console.log(error);
     return res.status(500).json({
        success:false ,
        message: "Something went wrong while sending reset pwd mail"
     })
   }



}
//module.exports = resetPasswordToken;


//reset password--------------------------->
const resetPassword = async(req,res) =>{
try {
    //data fetch
const {password , confirmPassword ,token} = req.body; 
//validation
if(password!= confirmPassword){
    return res.json({
        success:false,
        message:"Password not matching"

    });
}
//get user details from db using token
const userDetail = await User.findOne({token:token});

// if no entry of token-> invalid token
if(!userDetail){
    return res.json({
        success:false,
        message:"Token is invalid"
    })
}
//check token time
if(userDetail.resetPasswordExpires > Date.now()){
    return res.json({
        success:false,
        message:"Please regenerate the token, Token is expired"
    });

}
//hash password
const hasedPassword = await bcrypt.hash(password,10); 
//Password Update
await User.findOneAndUpdate(
            {token:token},
            {password:hasedPassword},
            {new:true},
        
        )

// retrun response 
return res.status(200).json({
    success:true,
    message:"Password reset successfully"
}); 

    
} catch (error) {
    console.log(error)
    return res.status(500).json({
        success:falses,
        message:"Something went wrong reseting the password"
    })

    
}
}
module.exports = {
    resetPassword,
    resetPasswordToken
}