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

module.exports.fetchUser = async (req, res, next) => {
  try {
    const users = await User.find({}, { userName : 1, following: 1 })

    res.json({
      status: 200,
      users
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return next(createError(400, 'user not exist'));
    }

    const isCorrectPassword = argon2.verify(user.password, password);

    if (!isCorrectPassword) {
      return next(createError(403, 'invalid password'));
    }

    const accessToken = jwt.sign(JSON.stringify(user._id), process.env.JWT_SECRET);
    const habits = user.habits;

    res.json({
      status: 200,
      userName: user.userName,
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

    res.json({
      status: 201,
      message: 'user signedup sucessfully'
    });
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports.followUser = async (req, res, next) => {
  try {
    const { email, followId } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(400, 'user not exist'));
    }

    const followUser = await User.findById(followId);

    user.following.push({ id: followUser._id, isSubscribing: true });
    user.save();

    res.json({
      status: 200,
      following: user.following
    });
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports.fetchFollowingUser = async (req, res, next) => {
  console.log('패칭 팔로잉 유저 진입 완료');
  try {
    const { email } = req.body;
    console.log('이메일' + email);
    User.findOne({ email })
      .populate('following.id')
      .exec((err, followingUser) => {
        if (err) {
          next(createError(500, err.message));
        }

        const followingUserHabits = followingUser.following.map(user => {
          const userName = user.id.userName;
          const habits = user.id.habits;

          return {
            userName,
            habits
          };
        });

        res.json({
          status: 200,
          followingUserHabits
        });
      });
  } catch (err) {
    next(createError(500, err));
  }
};
