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
    required: true,
    unique: true,
  },
}, { timestamps: true });

// Aplica el plugin mongoose-paginate al esquema
userSchema.plugin(mongoosePaginate);

// Agrega lógica para cifrar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.rol }, 'secretKey', {
    expiresIn: '1h', 
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.contraseña);
};

// Método para comparar contraseñas
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.contraseña);
};


// Exporta el modelo
const User = mongoose.model('User', userSchema, 'users');

module.exports = { User };





  