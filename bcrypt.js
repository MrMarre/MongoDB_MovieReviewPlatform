const bcrypt = require('bcryptjs');

const hashedPassword = async (password) => {
  const encryptedPassword = await bcrypt.hash(password, 10);

  return encryptedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const passwordMatch = await bcrypt.compare(password, hashedPassword);

  return passwordMatch;
};

module.exports = { hashedPassword, comparePassword };
