const User = require('../model/User');
const createError =  require('http-errors');
const { MESSAGE } = require('../constants');
const catchAsync = require('../utils/catchAsync');

module.exports.postHabit = catchAsync(async (req, res, next) => {
  const email = req.email;
  const { actType, day, time } = req.body;
  const user = await User.findOne({ email });
  const isFollowing = user.following.length === 0;

  if (isFollowing) {
    const newHabit = {
      habitType: actType,
      settedDay: day,
      settedTime: time,
      achivedDay: 0,
      mate: 0,
      like: 0
    };

    user.habits.push(newHabit);
    user.save();

    res
      .status(201)
      .json({
        status: 201,
        habits: user.habits,
        message: MESSAGE.HABIT_REGISTERED_SUCCESS
      });

    return;
  }

  const populatedUser = await User
                                .findOne({ email })
                                .populate('following.id');

  let sameHabitCount = 0;

  populatedUser.following.map(followingUser => {
    followingUser.id.habits.forEach(habit => {
      if (habit.habitType === actType) {
        sameHabitCount++;
      }
    });
  });

  const newHabit = {
    habitType: actType,
    settedDay: day,
    settedTime: time,
    achivedDay: 0,
    mate: sameHabitCount,
    like: 0
  };

  user.habits.push(newHabit);
  user.save();

  res
    .status(201)
    .json({
      status: 201,
      habits: user.habits,
      message: MESSAGE.HABIT_REGISTERED_SUCCESS
    });
});

module.exports.patchHabit = catchAsync(async (req, res, next) => {
  const email = req.email;
  const { habitType, date } = req.body;
  const user = await User.findOne({ email });

  const sameHabitIndex = user.habits.findIndex(habit => {
    return habit.habitType === habitType;
  });

  user.habits[sameHabitIndex].achivedDay = Number(user.habits[sameHabitIndex].achivedDay) + 1;

  if (user.habits[sameHabitIndex].achivedDay === user.habits[sameHabitIndex].settedDay) {
    const isRegisteredHabit = user.completedHabits.some(habit => {
      return habit.habitType === habitType;
    });

    user.habits.splice(sameHabitIndex, 1);

    if (isRegisteredHabit) {
      const completeHabitIndex = user.completedHabits.findIndex(habit => {
        return habit.habitType === habitType;
      });

      user.completedHabits[completeHabitIndex].completeCount += 1;
    }

    if (!isRegisteredHabit) user.completedHabits.push({ habitType });

    if (!user.completedDates.includes(date)) {
      user.completedDates.push(date);
    }
  }

  user.save();

  res.json({
    status: 200,
    habits: user.habits,
    completedHabits: user.completedHabits,
    completedDates: user.completedDates,
    message: MESSAGE.HABIT_PATCHED_SUCCESS
  });
});

module.exports.patchHabitLike = catchAsync(async (req, res, next) => {
  const { habitId, userId } = req.body;
  const followUser = await User.findById(userId);

  const habitIndex = followUser.habits.findIndex((habit) => {

    return String(habit._id) === habitId;
  });

  if (habitIndex !== -1) {
    followUser.habits[habitIndex].like += 1;
    followUser.save();

    res.json({
      status: 200,
      message: MESSAGE.LIKE_PATCHED_SUCCESS
    });

    return;
  }

  res
    .status(200)
    .json({
      status: 200,
      message: MESSAGE.CANT_FIND_HABIT
    });
});

module.exports.deleteHabit = catchAsync(async (req, res, next) => {
  const email = req.email;
  const { targetIndex } = req.body;
  const user = await User.findOne({ email });

  if (!user) next(createError(404, MESSAGE.CANT_FIND_USER));

  user.habits.splice(targetIndex, 1);

  await user.save();

  res.json({
      status: 200,
      message: MESSAGE.HABIT_DELETED_SUCCESS
    });
});
