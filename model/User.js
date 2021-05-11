const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  userName: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    minLength: 8,
    required: true,
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
          type: Boolean,
          default: true
        },
        id: {
          type: mongoose.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    default: [],
  },
  completedHabits: {
    type: [
      {
        type: String
      }
    ],
    default: []
  },
  habits: {
    type: [
      {
        mate: {
          type: Number
        },
        habitType: {
          type: String
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
          type: String
        },
        startTime: {
          type: Date
        },
        like: {
          type: Number
        }
      }
    ],
    default: []
  }
});

userSchema.statics.checkUserExists = function (email) {
  return this.exists({ email });
};

module.exports = mongoose.model('User', userSchema);
