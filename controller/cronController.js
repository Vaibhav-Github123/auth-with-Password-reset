const User = require("../models/User");

exports.UserVerify = async () => {
  try {
    const tenMinuteAgo = new Date(Date.now() - 1000 * 60 * 2);

    const filter = {
      emailVerify: false,
      createdAt: { $lt: tenMinuteAgo },
    };

    const result = await User.deleteMany(filter);

    console.log(`Delete ${result.deletedCount} Form The Database`);
  } catch (error) {
    console.log(error);
  }
};
