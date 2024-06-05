const admin = require('firebase-admin');

module.exports = async (request, h) => {
  const token = request.headers.authorization.replace('Bearer ', '');
  if (!token) {
    return h.response({ message: 'No token, authorization denied' }).code(401);
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    request.user = decodedToken;
    return h.continue;
  } catch (error) {
    return h.response({ message: 'Token is not valid' }).code(401);
  }
};
