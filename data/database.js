const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Database already initialized');
    return callback(null, database);
  }
  MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
      database = client.db(); // uses the default database from connection string
      console.log("Connected to database:", database.databaseName);
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};

module.exports = { initDb, getDatabase };
