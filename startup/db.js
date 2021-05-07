const config = require('config');
const mongoose = require('mongoose');

module.exports.connect = async () => {
  const db = mongoose.connection;

  mongoose.connect(config.get('mongoDB.url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  db.on('error', console.error.bind(console, 'connection error:'));
  await db.once('open', () => {
    console.log('Db connected successfully');
  });
};
