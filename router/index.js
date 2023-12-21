const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const croncontroller = require("../controller/cronController");

const authRouter = require("../router/authRoute");

cron.schedule("* * * * *", croncontroller.UserVerify);

// cron.schedule("/10  * * * *", function () {
//   console.log("running a task every 10 second");
// });

router.use("/", authRouter);

module.exports = router;
