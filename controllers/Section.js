const Section = require("../models/Section");
const Course = require("../models/Course");

const createSection = async(req,res) =>{
    try {
        //data fetch
        const {SectionName , CourseId} = req.body;
        //data validation
        if(!SectionName || ! CourseId) {
            return res.status(400).json({
                success:false,
                message:"Missing Properties are required",
            })
        }
        //section create
        const newSection = await Section.create({sectionName});

        //update course with section ObjectID
        const updatedCourseDetails= await Course.findByIdAndUpdate(
                                                       CourseId,
                                                       { 
                                                        $push:{
                                                            courseContent:newSection._id,
                                                        },
                                                                       },
                                                                       {new:true}
     
                                                                    )
                                                                    .populate({
                                                                      path:"courseContent",
                                                                      populate:{
                                                                        path:"subSection",
                                                                      },
                                                                     })
                                                                     .exec();
//HW-------------------->

       return res.status(200).json({
        success:true,
        message:"Section created successfully",
        updatedCourseDetails,
       })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to create Section ,please try again",
            error:error.message,
            
           })
        
    }
}
//module.exports = createSection;
//________________________> update section

const updateSection = async(req,res) =>{
    try {
        //data input
        const {SectionName, sectionId} = req.body;
        //data validation
        if(!SectionName || ! sectionIdectionId) {
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }
        //data update
        const section = await Section.findByIdAndUpdate(sectionId ,{sectionName},{new:true});
        //retutn res
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
          
           })
            
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to update Section ,please try again",
            error:error.message,
            
           })
    }
}
//module.exports = updateSection;

//____________________> deleteSection

const deleteSection = async(req,res) =>{
    try {
        //get ID - assuming that we are sending ID in parameters
        const{sectionId} = req.params;
        //use findByIdandDelete
        await Section.findByIdAndDelete(sectionId);
        //TODO [Testing]-------
        //return response

        return res.status(200).json({
            success:true,
            message:"Section delete successfully",
          
           })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section ,please try again",
            error:error.message,
            
           })
    }
}
module.exports = {
    deleteSection,
    updateSection,
    createSection
}
