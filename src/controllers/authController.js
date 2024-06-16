const admin = require('firebase-admin');

exports.register = (db) => async (req, h) => {
  const { email, password, username } = req.payload;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });
    return h.response({ message: 'User registered successfully', userRecord }).code(201);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.login = (db) => async (req, h) => {
  const { email, password } = req.payload;
  try {
    const user = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(user.uid);
    return h.response({ token });
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.logout = async (req, h) => {
  return h.response({ message: 'Logout successful' });
};