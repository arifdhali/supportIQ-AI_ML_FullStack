const authRoute = require("./auth.route");
const router = require("express").Router();

router.use("/auth", authRoute)


module.exports = router;