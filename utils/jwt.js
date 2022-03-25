const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

const createLimitedTimeToken = ({ payload, expiresIn }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
  return token;
};

const isTokenValid = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return false;
  }
};

module.exports = {
  createJWT,
  isTokenValid,
  createLimitedTimeToken,
};
