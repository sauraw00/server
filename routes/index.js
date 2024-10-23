const express = require("express")
const route = express.Router();
const V1Course = require("./V1/Course")
const V1Payment = require("./V1/Payments");
const V1profile = require("./V1/Profile");
const V1User = require("./V1/User")


route.use("/v1/course", V1Course);
route.use("/v1/payment", V1Payment);
route.use("/v1/profile", V1profile);
route.use("/v1/user", V1User);



module.exports = route;