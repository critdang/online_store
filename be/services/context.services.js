const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verify = promisify(jwt.verify);
const decodedToken = async (bearer) => {
  const token = bearer.split(' ')[1];
  const temp = await verify(token, process.env.JWT_SECRET);

  return temp;
};
// Authorization Bearer + token
module.exports = async ({ req }) => {
  let authToken;
  let currentUser;
  try {
    authToken = req.headers.authorization;
    if (authToken) { currentUser = await decodedToken(authToken); }
  } catch (error) {
    throw new Error(error);
  }
  return {
    currentUser,
  };
};
