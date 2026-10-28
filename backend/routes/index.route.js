const authRoute = require("./auth.route");
const userRoute = require("./users.routes");
const router = require("express").Router();

router.use("/auth", authRoute);
router.use("/users", userRoute)


module.exports = router;