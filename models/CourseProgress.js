const mongoose = require("mongoose");

const courseProgress = mongoose.Schema({
   
    couseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completedVideos:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection"
    }
});

module.exports = mongoose.model("CourseProgress" ,courseProgress)