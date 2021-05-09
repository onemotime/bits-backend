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
          newHabit,
          status: 201,
          message: 'habit registered successfully'
        });
      }
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports.deleteHabit = async (req, res, next) => {
  try {
    const { email, targetIndex } = req.body;

    const user = await User.findOne({ email });

    if (!user) next(createError(404, 'can not find user'));

    // const deleteIndex = user.habit.findIndex(item => {
    //   return item.habitType === habitType;
    // });

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
