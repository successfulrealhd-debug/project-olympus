const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
};

module.exports = { hashPassword, verifyPassword };
