const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'A user must have a name']
  },
  password: {
    type: String,
    minLength: 8,
    trime: true,
    required: [true, 'A user must have a password']
  },
  followers: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      }
    ],
    default: []
  },
  following: {
    type: [
      {
        isSubscribing: {
          type: Boolean
        },
        id: {
          type: mongoose.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    default: [],
  },
  habit: {
    type: [
      {
        mate: {
          type: Number
        },
        habitType: {
          type: String,
          unique: true
        },
        isDoneToday: {
          type: Boolean
        },
        settedDay: {
          type: String
        },
        achivedDay: {
          type: String
        },
        settedTime: {
          type: Number
        },
        startTime: {
          type: Date
        },
        likes: {
          type: Number
        }
      }
    ],
    default: []
  }
});

userSchema.statics.checkUserExists = function (userId) {
  return this.exists({ userId });
};

module.exports = mongoose.model('User', userSchema);
