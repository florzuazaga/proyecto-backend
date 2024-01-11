// userQueries.js
const { User } = require('../dao/models/userSchema');

const paginateUsers = async (page, limit) => {
  const options = {
    page: page,
    limit: limit,
  };

  try {
    const result = await User.paginate({}, options);
    return result;
  } catch (error) {
    throw error;
  }
};

const searchUsers = async (searchTerm) => {
  try {
    const result = await User.find({ $text: { $search: searchTerm } });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { paginateUsers, searchUsers };
