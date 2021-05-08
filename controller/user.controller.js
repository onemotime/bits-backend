const createError = require('http-errors');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

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

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const currentUser = await User.findOne({ email }).lean();

    if (!currentUser) {
      return next(createError(400, 'user not exist'));
    }

    const isCorrectPassword = argon2.verify(currentUser.password, password);

    if (!isCorrectPassword) {
      return next(createError(403, 'invalid password'));
    }

    const accessToken = jwt.sign(JSON.stringify(currentUser._id), process.env.JWT_SECRET);

    res
      .status(200)
      .json({
        currentUser,
        accessToken
      });
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    const isUserExists = await User.checkUserExists(req.body.email);

    if (isUserExists) {
      return next(createError(409, 'already existing user'));
    }

    const { email, password } = req.body;
    const hashedPassword = await argon2.hash(password);

    await User.create({
      email,
      password: hashedPassword
    });

    res
      .status(201)
      .json({
        message: 'user signedup sucessfully'
      });
  } catch (err) {
    next(createError(500, err));
  }
};
