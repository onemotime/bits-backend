const createError = require("http-errors");
const User = require("../models/User");

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

module.exports.postHabit = async (req, res, next) => {
  // 팔로잉 하고 있는 사람 있는지 확인 후 mate 수도 늘려줘야 함.
  try {
    const email = req.userEmail;
    const { habitType, settedDay, settedTime } = req.body;
    const newHabit = {
      habitType,
      settedDay,
      settedTime
    };

    const user = await User.findOne({ email });
    // 팔로잉 하고 있는 사람이 없고
    // 기존에 이 타입의 습관이 없으면 새로 넣는다
    if (!user.following) {
      const isHabitRegistered = user.habbit.some(item => {
        return item.habitType === habitType;
      });

      if (isHabitRegistered) {
        res
          .status(208)
          .json({
            result: 'fail',
            message: 'data in already registered'
          });

        return;
      }

      user.habbit.push(newHabit);
      user.save();

      res
        .status(201)
        .json({
          result: 'success',
          message: 'habit registered successfully'
        });

      return;
    }

    for (const objectId of user.following) {
      // 이 유저 오브젝트 아이디로 document 찾아서
      // 같은 습관을 가진 사람을 배열로 뽑아오거나 수만
      // 뽑아올수 있나 ??
    }
  } catch (err) {
    next(createError(500, err.message));
  }
};
