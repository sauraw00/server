const {User} = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailsender = require("../utils/mailSender");
require("dotenv").config();


//sendOTP
const sendOTP = async (req,res) =>{
   
   try {
    //fetch  email from request body
    // const {email} = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne(req.body.email );

    //if user already exist , then return a response
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already registered" ,
        })
    }

    //generate otp
    let otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })

    console.log("OTP generated" , otp);

   // check unique otp or not 
   let result = await OTP.findOne({otp:otp});

   while(result){
    otp = otpGenerator(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    result = await OTP.findOne({otp:otp});

   }
 
   const otpPayload = {email , otp};
   
   //insert otp in databse 
   const otpBody = await OTP.create(otpPayload);
   console.log(otpBody);

   res.status(200).json({
    success:true,
    message:"OTP send successfully",
    otp,
   })
   



   } 
   catch (error) {
    console.log("Something is Wrong in Auth for SendOtp",error);
    return res.status(500).json({
        success:false,
        message:error.message,
    })
    
   }
     
};

//module.exports = sendOTP;

//signup
const signup = async (req , res) =>{
    
    try {
        //data fetch from req ki body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body;
    console.log(req.body);
    //validate krlo
    if(!req.body.firstName || !req.body.lastName || !req.body.email ||!req.body.password ||!req.body.confirmPassword || !req.body.contactNumber || !req.body.otp)  {
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
    //dono password match krlo
    if(password !==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and ConfirmPassword Value does not match, Please try again"
        })
    }
    //check user already exist or not
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already registered"
        });
    }

    //find most recent OTP stored for the user
    const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOTP);

    //validate OTP
    if(recentOTP.length ==0){
        //otp not found
        return res.status(400).json({
            success:false,
            message:"OTP not found"
        })
    }else if(otp!== recentOTP.otp){
        //Invalid OTP
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        });
    }


    //hash password
    const hashedPassword = await bcrypt.hash(password,10);
    //entry create in DB
    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null
    })

    const User = await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebar.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    
    // return res
    return res.status(200).json({
        success:true,
        message:"User registered Successfully",
    })
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"User cannot be registered. Please try again"
        })
        
    }
};
//module.exports = signup;

//login controller for authentication__>
const login = async (req,res) =>{
   try {
    //get data from req bosy
     const{email, password} = req.body;

    //validatoin data
    if(!email||!password){
        return res.status(403).json({
            success:false,
            message:"All fields are required, please try again",
        })
    }
    //user check exist or not
    const user = await User.findOne({email}).populate("additionalDetails")
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User is not registered, Please signup first",
        })
    }
    //generate JWT, after password matching
    if(await bcrypt.compare(password, user.password)){
         
        const payload = {
            email:user.email,
            id: user._id,
            accountType :user.accountType,
        }
        
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
        });
        user.token = token;
        user.password = undefined;

        //create cookie and send response
        const options ={
            expires:new Date(Date.now() +3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token", token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in successfully"
        })
    }
    else{
        return res.status(401).json({
            success:false,
            message:"Password is in correct"
        })
    }
   } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Login Failure,please try again"
    });
   }
};
//module.exports = login;

//change Password
const changePassword = async (req,res)=>{
    //get data from req body
    //get oldPassword newPassword, confirmPassword
    //validation

    //update in DB
    //send mail -> password updated
    //return response

}
module.exports = {
    changePassword,
    login,
    signup,
    sendOTP

}
