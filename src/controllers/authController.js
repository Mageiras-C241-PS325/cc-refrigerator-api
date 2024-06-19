const { auth } = require('../config/db');
const { Firestore } = require('@google-cloud/firestore');
const db_fs = new Firestore();
const axios = require('axios');

exports.register = (db) => async (req, h) => {
  const { email, password, username } = req.payload;
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Menyimpan userId ke Firestore
    const userDocRef = db_fs.collection('refrigerator').doc(userRecord.uid);
    await userDocRef.set({ userId: userRecord.uid, email, username });

    return h.response({ message: 'User registered successfully', userRecord }).code(201);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.login = (db) => async (req, h) => {
  const { email, password } = req.payload;
  try {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
      email,
      password,
      returnSecureToken: true
    });

    const idToken = response.data.idToken;
    const userId = response.data.localId;

    // Menyimpan userId ke Firestore jika belum ada
    const userDocRef = db_fs.collection('refrigerator').doc(userId);
    const doc = await userDocRef.get();
    if (!doc.exists) {
      await userDocRef.set({ userId: userId, email });
    }

    return h.response({ idToken }).code(200);
  } catch (error) {
    return h.response({ error: error.response ? error.response.data : error.message }).code(500);
  }
};

exports.logout = async (req, h) => {
  return h.response({ message: 'Logout successful' });
};
