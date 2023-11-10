const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  // Otros campos relevantes para tu modelo Product
});

module.exports = mongoose.model('Product', productSchema);
