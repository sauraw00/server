const mongoose = require("mongoose");
require("dotenv").config();


const connect =() =>{
   mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
   })
   .then(()=> console.log("DB connect successfully"))
   
 
   .catch((error) =>{
    console.log("DB connection failed")
    console.error(error);
    process.exit(1);

   })

   }
module.exports =connect;