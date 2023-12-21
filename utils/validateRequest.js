const Validators = require("./validation");

module.exports = (validator) => async (req, res, next) => {
  try {
    if (!Validators.hasOwnProperty(validator)) {
      throw new Error(`'${validator}' validator is not exsit`);
    }

    const validated = await Validators[validator].validateAsync(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error.isJoi) {
      error.statusCode = 422;
      next(error);
    }
  }
};
