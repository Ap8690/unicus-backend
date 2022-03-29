const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  console.log("create", token, process.env.JWT_SECRET);
  return token;
};

const createLimitedTimeToken = ({ payload, expiresIn }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
  return token;
};

// const isTokenValid = (token) => {
//   try {
//     console.log("valid", token, process.env.JWT_SECRET);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded;
//   } catch (err) {
//     return false;
//   }
// };
const isTokenValid = (token) =>{
  try{
   const decoded = jwt.verify(token, String(process.env.JWT_SECRET))
   return decoded
}
catch(err){
  console.log(err);
  return false;
}

}
module.exports = {
  createJWT,
  isTokenValid,
  createLimitedTimeToken,
};
