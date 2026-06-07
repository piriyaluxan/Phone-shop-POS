const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, // payload — what's inside the token
    process.env.JWT_SECRET, // secret key to sign it
    { expiresIn: "7d" }, // token expires in 7 days
  );
};

module.exports = generateToken;
