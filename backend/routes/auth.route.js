const { LoginController } = require("../controllers/auth.controller");

const authRoute = require("express").Router();
 


authRoute.post("/login", LoginController)


module.exports = authRoute;