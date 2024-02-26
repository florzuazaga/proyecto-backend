// userDao.js
const { User } = require('./userSchema');

async function createUser(nombre, apellido, email, contraseña) {
  const newUser = new User({ nombre, apellido, email, contraseña });
  return await newUser.save();
}

async function getUserById(userId) {
  return await User.findById(userId);
}

async function updateUser(userId, newData) {
  return await User.findByIdAndUpdate(userId, newData, { new: true });
}

async function deleteUser(userId) {
  return await User.findByIdAndDelete(userId);
}

// userDto.js
class UserDto {
  constructor(user) {
    this.id = user._id;
    this.nombre = user.nombre;
    this.apellido = user.apellido;
    this.email = user.email;
    this.edad = user.edad;
    this.rol = user.rol;
    this.username = user.username;
  }
}

// userFactory.js
const faker = require('faker');

class UserFactory {
  static generateUser() {
    return new User({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      email: faker.internet.email(),
      edad: faker.random.number({ min: 18, max: 99 }),
      contraseña: faker.internet.password(),
      rol: 'usuario',
      username: faker.internet.userName(),
    });
  }
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  UserDto,
  UserFactory,
};

