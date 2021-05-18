const User = require('../model/User');
const createError =  require('http-errors');

module.exports.postHabit = async (req, res, next) => {
  try {
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

      res.json({
        status: 201,
        habits: user.habits,
        message: 'habit registered successfully'
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

    res.json({
      status: 201,
      habits: user.habits,
      message: 'habit registered successfully'
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports.patchHabit = async (req, res, next) => {
  try {
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
      message: 'habit patched successfully'
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports.patchHabitLike = async (req, res, next) => {
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
      message: 'like successful'
    });

    return;
  }

  res.json({
    status: 404,
    message: 'cant find habit'
  });
};

module.exports.deleteHabit = async (req, res, next) => {
  try {
    const email = req.email;
    const { targetIndex } = req.body;
    const user = await User.findOne({ email });

    if (!user) next(createError(404, 'can not find user'));

    user.habits.splice(targetIndex, 1);

    await user.save();

    res.json({
        status: 200,
        result: 'success',
        message: 'habit deleted succefully'
      });
  } catch (err) {
    next(createError(500, err.message));
  }
};
