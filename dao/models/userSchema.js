// userSchema.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Schema } = mongoose; // Agrega esta línea para importar Schema

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  correo_electronico: {
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
  rol: {
    type: String,
    default: 'usuario',
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.rol }, 'secretKey', {
    expiresIn: '1h', // Cambia la expiración según tus necesidades
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;




  