const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
  // Otros campos relevantes para tu modelo Message
});

module.exports = mongoose.model('Message', messageSchema);
