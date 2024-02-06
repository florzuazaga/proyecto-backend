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
    unique: true
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

// Aplica el plugin mongoose-paginate al esquema
userSchema.plugin(mongoosePaginate);




userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.rol }, 'secretKey', {
    expiresIn: '1h', 
  });
  return token;
};
userSchema.methods.comparePassword = async function (password) {
  try {
    console.log('Contraseña proporcionada:', password);
    console.log('Contraseña almacenada:', this.contraseña);

    // Aplica trim a la contraseña proporcionada
    const trimmedPassword = password.trim();

    const match = await bcrypt.compare(trimmedPassword, this.contraseña);

    console.log('Coincide la contraseña:', match);

    return match;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    throw error;
  }
};



// Exporta el modelo
const User = mongoose.model('User', userSchema);

module.exports = { User };





  