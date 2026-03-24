const jwt = require("jsonwebtoken");
const env = require("../config/env");

function generateAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};