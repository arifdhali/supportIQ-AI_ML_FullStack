const userRoute = require("express").Router();


userRoute.get("/login", (req, res) => { 
    res.send("login route")
})

module.exports = userRoute;