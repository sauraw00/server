const express = require("express");

const app = express();

// import all routes
// const userRoutes = require("./routes/User")
// const profileRoutes = require("./routes/Profile")
// const paymentRoutes = require("./routes/Payments")
// const courseRoutes = require("./routes/Course")
const apiRoutes = require("./routes/index")

const database = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const CloudConnect = require("./config/cloudinary")
const cloudConnectObj = new CloudConnect();
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")

dotenv.config()
const PORT = process.env.PORT||4000;

//databse connect
database();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)
 
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp",
    })
)

//cloudinary Connection
cloudConnectObj.cloudinaryConnect();

//routes
app.use("/api" ,apiRoutes)
// app.use("/api/v1/profile" ,profileRoutes)
// app.use("/api/v1/course" ,courseRoutes)
// app.use("/api/v1/payment" ,paymentRoutes)

//default route
app.get("/" ,(req,res) =>{
    return res.json({
        success:true,
        message:'Your server is up and running.......'
    })
});

//activate the server
app.listen(PORT , () =>{
    console.log(`App is running at ${PORT} `)
})
