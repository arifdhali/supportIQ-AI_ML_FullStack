const userRoute = require("./user.routes");
const router = require("express").Router();

router.use("/users", userRoute);


module.exports = router;