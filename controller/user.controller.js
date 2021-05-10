const createError = require('http-errors');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

// module.exports.getUserInfo = async (req, res, next) => {
//   try {
//     const userEmail = req.userEmail;
//     const userInfo = await User.findOne({ userEmail });

//     if (!userInfo) next(createError(404, 'can not find user'));

//     res
//       .status(200)
//       .json(userInfo);
//   } catch (err) {
//     next(createError(500, err.message));
//   }
// };

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
    const habits = currentUser.habits

    res.json({
        status: 200,
        userName: currentUser.userName,
        email,
        accessToken,
        habits
      });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;
    const isUserExists = await User.checkUserExists(email);
    const hashedPassword = await argon2.hash(password, 10);

    if (isUserExists) {
      return next(createError(409, 'already existing user'));
    }

    await User.create({
      email,
      userName,
      password: hashedPassword
    });

    res
      .json({
        status: 201,
        message: 'user signedup sucessfully'
      });
  } catch (err) {
    console.log('에러' + err)
    next(createError(500, err));
  }
};

module.exports.fetchUser = async (req, res, next) => {
  try {
    const users = await User.find({}, { userName : 1 })

    res.json({
      status: 200,
      users
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};
