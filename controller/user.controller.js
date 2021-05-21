const createError = require('http-errors');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const catchAsync = require('../utils/catchAsync');
const { MESSAGE } = require('../constants');

module.exports.fetchFollowingUser = catchAsync(async (req, res, next) => {
  const email = req.email;

  if (!email) {
    res
      .status(400)
      .json({
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
});

module.exports.fetchUser = catchAsync(async (req, res, next) => {
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
});

module.exports.fetchTokens = catchAsync(async (req, res, next) => {
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
});

module.exports.login = catchAsync(async (req, res, next) => {
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
});

module.exports.signup = catchAsync(async (req, res, next) => {
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

  res
    .status(201)
    .json({
        status: 201,
        message: MESSAGE.USER_SIGNEDUP_SUCCESSFULLY
      });
});

module.exports.followUser = catchAsync(async (req, res, next) => {
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
});

module.exports.postImageUrl = catchAsync(async (req, res, next) => {
  const email = req.email;
  const { uri } = req.body;
  const user = await User.findOne({ email });

  user.imageUri = uri;
  await user.save();

  res
    .status(201)
    .json({
      status: 201,
      uri
    });
});
