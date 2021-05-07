const createError = require("http-errors");
const User = require("../models/User");

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const userEmail = req.userEmail;
    const userInfo = await User.findOne({ userEmail });

    if (!userInfo) next(createError(404, 'can not find user'));

    res
      .status(200)
      .json(userInfo);
  } catch (err) {
    next(createError(500, err.message));
  }
};
