const createError = require('http-errors');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { MESSAGE } = require('../constans');

module.exports.fetchFollowingUser = async (req, res, next) => {
  try {
    const email = req.email;

    if (!email) {
      res.json({
        status: 400,
        message: MESSAGE.CANT_FIND_EMAIL
      });

      return;
    }

    const populatedUser = await User
                                  .findOne({ email })
                                  .populate('following.id');

    const followingUserHabits = populatedUser.following.map(user => {

      return {
        userId: user.id._id,
        userName: user.id.userName,
        habits: user.id.habits,
        imageUri: user.id.imageUri
      };
    });

    res.json({
      status: 200,
      followingUserHabits
    });
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports.fetchUser = async (req, res, next) => {
  try {
    const email = req.email;
    const users = await User.find({}, { userName : 1, following: 1, imageUri: 1 })
    const user = await User.findOne({ email });

    res.json({
      status: 200,
      payload: {
        users,
        following: user.following
      }
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports.fetchTokens = async (req, res, next) => {
  try {
    const email = req.email;
    const populatedUser = await User
                                  .findOne({ email })
                                  .populate('followers');

    const followerPushTokens = populatedUser.followers.map(follower => {
      return follower.pushToken;
    });

    res.json({
      status: 200,
      pushTokens: followerPushTokens
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password, pushToken } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(400, MESSAGE.CANT_FIND_USER));
    }

    const isCorrectPassword = await argon2.verify(user.password, password);

    if (!isCorrectPassword) {
      return next(createError(403, MESSAGE.INVALID_PASSWORD));
    }

    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET);

    user.pushToken = pushToken;
    await user.save();

    res.json({
      status: 200,
      userName: user.userName,
      email,
      accessToken,
      habits: user.habits,
      followers: user.followers,
      following: user.following,
      imageUri: user.imageUri,
      completedDates: user.completedDates,
      completedHabits: user.completedHabits
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
      return next(createError(409, MESSAGE.ALREADY_EXISTING_USER));
    }

    await User.create({
      email,
      userName,
      password: hashedPassword
    });

    res.json({
      status: 201,
      message: MESSAGE.USER_SIGNEDUP_SUCCESSFULLY
    });
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports.followUser = async (req, res, next) => {
  try {
    const email = req.email;
    const { followId } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(400, MESSAGE.CANT_FIND_USER));
    }

    const followUser = await User.findById(followId);

    user.following.push({ id: followUser._id, isSubscribing: true });
    followUser.followers.push(user._id);

    await user.save();
    await followUser.save();

    res.json({
      status: 200,
      following: user.following
    });
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports.postImageUrl = async (req, res, next) => {
  try {
    const { uri } = req.body;
    const email = req.email;
    const user = await User.findOne({ email });

    user.imageUri = uri;
    user.save();

    res.json({
      status: 201,
      uri
    });
  } catch (err) {
    next(createError(500, err));
  }
};
