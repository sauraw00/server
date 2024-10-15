const Profile = require('../models/Profile');
const User = require('../models/User');
const {uploadImageToCloudinay} = require("../utils/imageUploader");


//method for updating profile
const updateProfile = async(req,res) =>{
    try {
        //get data
        const{dateOfBirth="",about="",contactNumber,gender} = req.body;
        //user id
        const id = req.user.id;
     
       
        //find profile by id
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);
        //update profile
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contectNumber=contactNumber;

        await profile.save();

        //return res. 
        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            profile,
          
           })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
          
            error:error.message,
            
           })
    }
} 
module.exports = updateProfile;

//delete account_____________________>

const deleteAccount = async(req,res) =>{   
    try {
        //get id
        const id = req.user.id;
        //validation
        const user = await User.findById({_id: id});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not foundn"
            });
        }
        //delete associated profile with the user
    await Profile.findByIdAndDelete({_id:user.userDetails});
    //TODO HOMEWORK __> unroll user form all enrolled courses
   
        //delete user
        await User.findByIdAndDelete({_id:id});
        
        //return res
    return res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User canot be deleted successfuly"

        })
        
    }
}
module.exports = deleteAccount;

//get all details of user________________>

const getAllUserDetails = async(req,res) =>{
    
try {
    //get id
    const id = req.user.id;

    //validation and get user details
    const userDetails = await User.findById(id).populate("additionalDetails").exec();
    console.log(userDetails);
    
    return res.status(200).json({
        success:true,
        message:"User data fetched successfully"
    });
    
} catch (error) {
    return res.status(500).json({
        success:true,
        message:error.message,
    })
    
}

}
module.exports =getAllUserDetails;
