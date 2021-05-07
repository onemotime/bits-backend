const mongoose = require("mongoose");

const User = new mongoose.Schema({
  naem: {
    type: Stirng,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'A user must have an email']
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

module.exports = mongoose.model("User", User);
