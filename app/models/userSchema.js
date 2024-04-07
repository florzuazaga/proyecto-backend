// userSchema.js
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  edad: {
    type: Number,
  },
  contraseña: {
    type: String,
    required: true,
  },
  carrito: {
    type: Schema.Types.ObjectId,
    ref: 'Carts',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  rol: {
    type: String,
    enum: ['usuario', 'premium', 'admin'],
    default: 'usuario',
  },
  username: {
    type: String,
    sparse: true,
    unique: true,
  },
  // Nuevas propiedades para las imágenes y el indicador de premium
  identificationImage: String,
  addressProofImage: String,
  accountStatementImage: String,
  isPremium: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

module.exports = User;





  