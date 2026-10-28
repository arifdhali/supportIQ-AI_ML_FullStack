const { createTicket } = require("../controllers/users.controller");

const userRoute = require("express").Router();

userRoute.post("/create-ticket",createTicket)

module.exports = userRoute;