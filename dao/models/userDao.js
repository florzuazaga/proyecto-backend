// userDao.js
const User = require('./userSchema').User; 

async function createUser(nombre, apellido, email, contraseña) {
  const newUser = new User({ nombre, apellido, email, contraseña});
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

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
