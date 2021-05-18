const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { MESSAGE } = require('../constans');

module.exports = async (req, res, next) => {
  try {
    const token = req.get('authorization');
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email });

    if (user) {
      req.email = email;

      next();
      return;
    }

    res
      .status(204)
      .json({ message: MESSAGE.CANT_FIND_USER });
  } catch (err) {
    next(createError(500, err.message));
  }
};
