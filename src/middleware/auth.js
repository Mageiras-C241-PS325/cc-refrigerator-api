const { auth } = require('../config/db');

module.exports = async (request, h) => {
  const authorizationHeader = request.headers.authorization;
  console.log("Authorization Header:", authorizationHeader); // Tambahkan log ini

  if (!authorizationHeader) {
    return h.response({ message: 'No token, authorization denied' }).code(401);
  }

  const token = authorizationHeader.replace('Bearer ', '');
  console.log("Token:", token); // Tambahkan log ini

  if (!token) {
    return h.response({ message: 'No token, authorization denied' }).code(401);
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    console.log("Decoded Token:", decodedToken); // Tambahkan log ini

    request.user = decodedToken;
    return h.continue;
  } catch (error) {
    console.log("Token verification error:", error); // Tambahkan log ini
    return h.response({ message: 'Token is not valid', error: error.message }).code(401);
  }
};
