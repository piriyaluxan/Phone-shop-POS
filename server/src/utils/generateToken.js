const jwt = require("jsonwebtoken");

const generateToken = (id, userId, role) => {
  return jwt.sign({ id, userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
