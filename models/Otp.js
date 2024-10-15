const mongoose = require("mongoose");
const mailsender = require("../../utils/mailSender");

const otpSchema = mongoose.Schema({

    email:{
        type:String,
        required:true,

    },
    otp:{
        type:String,
        requried:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    }
})

//a function -> to send otp emails
async function sendVerificationEmail(email,otp) {
   try {
    
    const mailResponse = await mailsender(email, "Verification Email from StudyNotion",otp);
    console.log("Email send successfully ", error);

} catch (error) {
    console.log("error occured while sending mails",error);
    throw error;
    
   }    
}

otpSchema.pre("save",async function(next){
     await sendVerificationEmail(this.email , this.otp);
     next();
})

module.exports = mongoose.model("Otp",otpSchema)