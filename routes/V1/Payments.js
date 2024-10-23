const express = require("express");
const router = express.Router();


// const{capturePayment ,verifySignature } = require("../../controllers/Payments")

const PaymentController = require("../../controllers/Payments");

// const{auth , isInstructor , isStudent , isAdmin} = require("../middlewares/auth.js")
const AuthMiddleware =  require("../../middlewares/auth")

router.post("/capturePayment",
    AuthMiddleware.auth ,
    AuthMiddleware.isStudent,
    PaymentController.capturePayment)


router.post("/verifySignature" , 
    PaymentController.verifySignature)

module.exports = router