const express = require("express");
const router = express.Router();

const authController = require("../controller/authcontroller");
const validator = require("../utils/validateRequest");

router.get("/auth/login", authController.getLogin);

router.get("/auth/signup", authController.getSignup);

router.post("/auth/signup", validator("signupUser"), authController.postSignup);

router.get("/auth/tokenVerify/:token",authController.getEmailVerify)

router.post("/auth/login", validator("loginUser"), authController.postLogin);

router.get("/auth/reset", authController.getResetPassword);

router.post("/auth/reset", authController.postReset);

router.get("/auth/reset/:token",authController.getNewPassword)

router.post("/auth/new_pass",authController.postNewPassword)

module.exports = router;
