const { auth } = require('../config/db');

module.exports = async (request, h) => {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) {
    return h.response({ message: 'No token, authorization denied' }).code(401);
  }

  const token = authorizationHeader.replace('Bearer ', '');
  if (!token) {
    return h.response({ message: 'No token, authorization denied' }).code(401);
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    request.user = decodedToken;
    return h.continue;
  } catch (error) {
    console.log("Token verification error\n", error);
    return h.response({ message: 'Token is not valid', error: error.message }).code(401);
  }
};
