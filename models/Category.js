const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
name:{
    type:String,
    requried:true
},
descripiton:{
    type:String
},
course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
},

})

module.exports = mongoose.model("Category", categorySchema);