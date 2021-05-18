const mongoose = require('mongoose');
const { databaseURI, databasePassword } = require('./index');
const { MESSAGE } = require('../constans');

const connectMongoose = async () => {
  try {
    await mongoose.connect(
      databaseURI.replace('<password>', databasePassword),
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        dbName: 'bits',
      }
    );

    console.log(`${MESSAGE.MONGODB_CONNECT_SUCCESS}`);
  } catch (err) {
    console.error(`${MESSAGE.MONGODB_CONNECT_ERROR} ${err}`);
  }
};

connectMongoose();
