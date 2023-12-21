const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { json } = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.getLogin = async (req, res) => {
  const message = req.flash("message");
  const error = req.flash("error");
  res.render("auth/login", { messages: message, Error: error });
};

exports.getSignup = async (req, res) => {
  const error = req.flash("error");
  res.render("auth/signup", { Error: error });
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      req.flash("error", "required fields are missing");
      return res.redirect("/auth/signup");
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.flash("error", "User already exists");
      return res.redirect("/auth/signup");
    }

    let hashPassword = await bcryptjs.hash(password, 10);

    const token = jwt.sign({ email }, process.env.Secret, {
      expiresIn: "10min",
    });

    let user = new User({
      // _id: mongoose.Types.ObjectId,
      name: name,
      email: email,
      password: hashPassword,
      // VerificationToken: token,
    });

    // const verificationToken = user.generateVerificationToken();

    await user.save();
    req.flash("message", "Please Verify Your Email!!...");
    res.redirect("/auth/login");

    transporter.sendMail({
      to: email,
      from: "mathukiyavaibhav0809@gmail.com",
      subject: "Signup succeeded!",
      html: `  <p>You successfully signed up!</p>
      <p>Click this <a href="http://localhost:9001/auth/tokenVerify/${token}">link</a> to Variated Your EmailAddress.</p>`,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getEmailVerify = async (req, res) => {
  try {
    const token = req.params.token;

    let deCodeToken;
    try {
      deCodeToken = await jwt.verify(token, process.env.Secret);
    } catch (error) {
      console.log(error);
    }

    await User.updateOne({email: deCodeToken.email},{ emailVerify: true });

    res.send("Your Email is Variated!!");
  } catch (error) {
    console.log(error);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userExisting = await User.findOne({ email: email });
    if (!userExisting) {
      req.flash("error", "Invalid Email OR Password");
      res.redirect("/auth/login");
    }

    const invalid = await bcryptjs.compare(password, userExisting.password);
    if (!invalid) {
      req.flash("error", "Invalid Email OR Password");
      return res.redirect("/auth/login");
    }

    req.flash("message", "User Login Successfully Done..");
    res.redirect("/");
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getResetPassword = (req, res) => {
  const message = req.flash("error");
  res.render("auth/reset", { messages: message });
};

exports.postReset = async (req, res) => {
  try {
    const userEmail = req.body.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.redirect("/auth/reset");
    }

    const token = await generateRandomString(32);

    const now = Date.now();

    if (!user.resetPasswordCount) {
      sendResetPasswordMail(token, userEmail);

      // console.log(pwResetMailSend);

      user.resetPasswordCount = 1;
      user.resetPasswordExpiration = now + 1000 * 60 * 5;
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 1000 * 60 * 60 * 24;

      await user.save();

      // flash message

      return res.redirect("/auth/login");
    }

    if (user.resetPasswordExpiration > now) {
      if (user.resetPasswordCount < 2) {
        sendResetPasswordMail(token, userEmail);
        // console.log(sendmail);

        user.resetPasswordCount = +user.resetPasswordCount + 1;

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1000 * 60 * 60 * 24;

        await user.save();

        // flash message

        return res.redirect("/auth/login");
      } else {
        const lastResetAttempt = user.resetPasswordExpiration;
        if (lastResetAttempt > now) {
          const remainingTime = lastResetAttempt - now;
          res
            .status(429)
            .send(
              "message",
              `Too many reset attempts. Please try again in ${Math.ceil(
                remainingTime / 60 / 1000
              )} minutes.`
            );
        }
        // generate left time and flash message
        res.redirect("/auth/login");
        // return await user;
      }
    }

    sendResetPasswordMail(token, userEmail);

    user.resetPasswordCount = 1;
    user.resetPasswordExpiration = now + 1000 * 60 * 5;

    await user.save();

    // flash message

    return res.redirect("/auth/login");
  } catch (error) {
    res.redirect("/auth/reset");
  }
};

// crypto.randomBytes(42, async (err, buffer) => {
//   //The buffers module provides a way of handling streams of binary data.
//   if (err) {
//     console.log(err);
//     return res.redirect("/auth/reset");
//   }

//   const token = buffer.toString("hex");
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     req.flash("error", "No account with that email found.");
//     return res.redirect("/auth/reset");
//   }
//   // let users;
//   const lastresetAttempt = user.resetPasswordExpiration;
//   const now = Date.now();

//   const fiveMin = Date.now() + 1000 * 60 * 3;
//   if (lastresetAttempt > fiveMin) {
//     user.resetPasswordExpiration = 0;
//   }

//   const resetPWcount = user.resetPasswordCount
//     ? +user.resetPasswordCount + 1
//     : 1;
//   if (resetPWcount > 2) {
//     return res.redirect("/auth/login");
//   }

//   if (!user.resetPasswordExpiration) {
//     user.resetPasswordExpiration = new Date(Date.now());
//   }

//   const resetPWtime = user.resetPasswordExpiration;
//   if (resetPWtime > Date.now()) {
//     req.flash("message", "Your time is valid");
//   }

//   user.resetToken = token;
//   user.resetTokenExpiration = Date.now() + 1000 * 60 * 60;
//   user.resetPasswordExpiration = resetPWtime;
//   user.resetPasswordCount = resetPWcount;
//   user.lastresetAttempt = now;

//   await user.save();

//   transporter.sendMail({
//     to: req.body.email,
//     from: "mathukiyavaibhav0809@gmail.com",
//     subject: "Sending Email using Node.js",
//     html: `  <p>You requested a password reset</p>
//                   <p>Click this <a href="http://localhost:9001/auth/reset/${token}">link</a> to set a new password.</p>`,
//   });
// });

exports.getNewPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    let message = req.flash("error");
    let messaged = req.flash("message");

    res.render("auth/new_pass", {
      messages: message,
      messaged,
      userId: user._id,
      passwordToken: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.postNewPassword = async (req, res) => {
  try {
    const NewPassword = req.body.password;
    const ConfirmPassword = req.body.confirmPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    // console.log(user);

    if (NewPassword !== ConfirmPassword) {
      req.flash("error", "Password is Not matched");
      res.redirect("/auth/new_pass");
    }

    let hashPassword = await bcryptjs.hash(NewPassword, 10);
    let resetUser = user;

    resetUser.password = hashPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;

    await resetUser.save();

    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
};

const generateRandomString = async (bytes) => {
  return new Promise((resolve, rejects) => {
    crypto.randomBytes(bytes, async (err, buffer) => {
      if (err) rejects(err);
      else resolve(buffer.toString("hex"));
    });
  });
};

const sendResetPasswordMail = async (token, receiver) => {
  return await transporter.sendMail({
    to: receiver,
    from: "mathukiyavaibhav0809@gmail.com",
    subject: "Sending Email using Node.js",
    html: `  <p>You requested a password reset</p>
    <p>Click this <a href="http://localhost:9001/auth/reset/${token}">link</a> to set a new password.</p>`,
  });
};
