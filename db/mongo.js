//mongo.js
const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://florenciazuazaga36:Fabi3926@cluster0.t6cqann.mongodb.net/?retryWrites=true&w=majority';

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

