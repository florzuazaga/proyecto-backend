//productSchema.js
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  owner: {
    type: String,  
  },
  
},{ timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product ;