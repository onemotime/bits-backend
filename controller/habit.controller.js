const User = require('../model/User');
const createError =  require('http-errors');

module.exports.postHabit = async (req, res, next) => {
  try {
    const { email, actType, day, time } = req.body;

    User.findOne({ email }, (err , user) => {
      if (!user.following.length) {
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
      }
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports.patchHabit = async (req, res, next) => {
  try {
    const { email, habitType } = req.body;

    const user = await User.findOne({ email });

    const targetIndex = user.habits.findIndex(habit => {
      return habit.habitType === habitType;
    });

    user.habits[targetIndex].achivedDay = Number(user.habits[targetIndex].achivedDay) + 1;

    if (user.habits[targetIndex].achivedDay === user.habits[targetIndex].settedDay) {
      const isRegisteredHabit = user.completedHabits.some(habit => {
        return habit === habitType;
      });

      user.habits.splice(targetIndex, 1);

      if (!isRegisteredHabit) user.completedHabits.push(habitType);
    }

    user.save();

    res.json({
      status: 200,
      habits: user.habits,
      message: 'habit patched successfully'
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports.deleteHabit = async (req, res, next) => {
  try {
    const { email, targetIndex } = req.body;

    const currentUser = await User.findOne({ email });

    if (!currentUser) next(createError(404, 'can not find user'));

    // const deleteIndex = user.habit.findIndex(item => {
    //   return item.habitType === habitType;
    // });

    currentUser.habits.splice(targetIndex, 1);

    await currentUser.save();

    res.json({
        status: 200,
        result: 'success',
        message: 'habit deleted succefully'
      });
  } catch (err) {
    next(createError(500, err.message));
  }
};
