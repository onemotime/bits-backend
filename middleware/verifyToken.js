const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies['authToken'];
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email });

    if (user) {
      req.userEmail = email;

      next();
    }

    res
      .status(204)
      .json({
        result: 'failure',
        message: 'user not found',
      });
  } catch (err) {
    next(createError(500, err.message));
  }
};
