// userSchema.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
    set: (rawPassword) => bcrypt.hashSync(rawPassword, 10),
  },
  carrito: {
    type: Schema.Types.ObjectId,
    ref: 'Carts',
  },
  rol: {
    type: String,
    default: 'usuario',
  },
  username: {
    type: String,
    sparse: true,
    unique: true,
  },
}, { timestamps: true });

userSchema.plugin(mongoosePaginate);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.rol }, 'secretKey', {
    expiresIn: '1h',
  });
  return token;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.contraseña);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };






  