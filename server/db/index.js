const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost/hostInfo';
// const { MONGO_CLOUD_USERNAME, MONGO_CLOUD_PASSWORD, DB_NAME } = require('../../config/config');
// const mongoUri = `mongodb+srv://${MONGO_CLOUD_USERNAME}:${MONGO_CLOUD_PASSWORD}@cluster0.9j0yc.mongodb.net/${DB_NAME}`;


mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);
mongoose.connection.on('connected', () => console.log('Mongoose connected.'));

mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected.');
});

module.exports = mongoose.connection;





