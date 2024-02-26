// userDao.js
const { User } = require('./userSchema');

class UserDao {
  async createUser(nombre, apellido, email, contraseña) {
    const newUser = new User({ nombre, apellido, email, contraseña });
    return await newUser.save();
  }

  async getUserById(userId) {
    return await User.findById(userId);
  }

  async updateUser(userId, newData) {
    return await User.findByIdAndUpdate(userId, newData, { new: true });
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async getAllUsers() {
    return await User.find();
  }
}

module.exports = UserDao;

