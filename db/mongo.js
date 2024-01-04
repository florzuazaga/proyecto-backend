//mongo.js
const { MongoClient } = require('mongodb');

const { connectToDatabase } = require('../config/databaseConfig');
connectToDatabase();

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(err => {
  if (err) {
    console.error('Error en la conexión a MongoDB:', err);
    return;
  }

  const db = client.db();

  module.exports = { client, db };
});

