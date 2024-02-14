// utils.js
const { User } = require('./userSchema');
const faker = require('faker');

// Función para generar un usuario de ejemplo con datos ficticios
function generateUser() {
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

module.exports = {
  generateUser,
};
