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
  imageUri: {
    type: String,
    default: ''
  },
  pushToken: {
    type: String
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
  completedDates: {
    type: [
      {
        type: String
      }
    ],
    default: []
  },
  completedHabits: {
    type: [
      {
        habitType: {
          type: String
        },
        completeCount: {
          type: Number,
          default: 0
        }
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
          type: Number,
          default: 0
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
