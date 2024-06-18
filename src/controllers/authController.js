const { auth } = require('../config/db');
const axios = require('axios');

exports.register = (db) => async (req, h) => {
  const { email, password, username } = req.payload;
  try {
    const userRecord = await auth.createUser({
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
    // Sign in the user with email and password using Firebase Auth REST API
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
      email,
      password,
      returnSecureToken: true
    });

    const idToken = response.data.idToken;

    return h.response({ idToken });
  } catch (error) {
    return h.response({ error: error.response ? error.response.data : error.message }).code(500);
  }
};

exports.logout = async (req, h) => {
  return h.response({ message: 'Logout successful' });
};
