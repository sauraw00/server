const cloudinary = require("cloudinary").v2 //cloudinary is being required
require('dotenv').config();

// const cloudinaryConnect = () =>{
//     try {
//         cloudinary.config({
//             // configuring the cloudinary to upload MEDIA#######
//             cloud_name:process.env.CLOUD_NAME,
//             api_key:process.env.API_KEY,
//             api_secret:process.env.API_SECRET,
//         });
//     } catch (error) {
//         console.error("Something is wrong in Cloudinary");
        
//     }
// }
class CloudConnect {
    
    async cloudinaryConnect() {
        try {
            cloudinary.config({
                // configuring the cloudinary to upload MEDIA#######
                cloud_name:process.env.CLOUD_NAME,
                api_key:process.env.API_KEY,
                api_secret:process.env.API_SECRET,
            });
        } catch (error) {
            console.error("Something is wrong in Cloudinary");
            
        }
    }
}
module.exports = CloudConnect;