const authRoute = require("express").Router();
const { LoginController } = require("../controllers/users.controller");



authRoute.post("/login", LoginController)
module.exports = authRoute;