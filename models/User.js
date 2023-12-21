const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    // _id:  mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    confirmPassword: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
    resetPasswordExpiration: {
      type: Date,
    },
    resetPasswordCount: {
      type: Number,
    },
    emailVerify: {
      type: Boolean,
      default: false,
    },
    // VerificationToken: {
    //   type: String
    // }
  },
  {
    timestamps: true,
  }
);

// UserSchema.methods.generateVerificationToken = function () {
//   const user = this;
//   const verificationToken = jwt.sign({ ID: user._id }, process.env.Secret, {
//     expiresIn: "10min",
//   });
//   return verificationToken;
// };

module.exports = mongoose.model("User", UserSchema);
