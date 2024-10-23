const { model } = require("mongoose");
const Category = require("../models/Category");

//create tag ka handler  
const createCategory =async (req,res) =>{
    try {
        //fetch data
        const {name,description} = req.body;
        //validation
        if(!name || ! description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //create a entry in DB
        const tagDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(CategoryDetails);
        //return response

        return res.status(200).json({
            success:true,
            message:"Category created successfully",
        })

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }
};

//module.exports = createCategory;

//getAll Category handler function

const showAllCategory = async(req,res) =>{
    try {
        const allCategorys = await Category.find({},{name:true , description:true});

        return res.status(200).json({
            success:true,
           date:allCategorys,
        })

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }
}
//module.exports = showAllCategory;

//category Page__________________>

const categoryPageDetails = async (req,res) =>{
    try {
        const {CategoryId} = req.body;

        //Get courses for the specified catgory

        const selectedCategory = await Category.findById(CategoryId).populate("courses").exec();
         console.log(selectedCategory)

         //Handle the case when the category is not found
         if(!selectedCategory){
            console.log("category not found");
            return res.status(404).json({
                success:false,
                message:"category not found"
            });

         }
         if(selectedCategory.courses.length ===0){
            console.log("No course found for the selected category.");
            return res.status(404).json({
                success:false,
                message:"Non course foound for the selected category"
            });
         }

         const selectedCourses = selectedCategory.courses;

         //Get courses for other categories
         const categoriesExpectSelected = await Category.find({
            _id: {$ne: CategoryId},
         }).populate("courses");
         let differentCourses =[];
         
         for (const Category of categoriesExpectSelected){
            differentCourses.push(...categoryPageDetails.courses);
         }

         //Get top selling courses accross all categories 
         const allCategories = await Category.find().populate("courses");
         const allCourses = allCategories.flatMap((category)=> category.courses);
         const mostSellingCourses = allCourses
                                         .sort((a,b) => b.sold - a.sold)
                                         .slice(0,10);

               res.status(200).json({
                selectedCourses:selectedCourses,
                differentCourses:differentCourses,
                mostSellingCourses:mostSellingCourses,
               });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message,
        })
        
    }
}
module.exports ={

    categoryPageDetails,
    createCategory,
    showAllCategory



}