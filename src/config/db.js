const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const serviceAccount = require('./serviceAccountKey.json');

// Inisialisasi Firebase Admin SDK menggunakan akun layanan dari GCP
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  apiKey: process.env.FIREBASE_API_KEY,
  storageBucket: process.env.GCP_BUCKET_NAME
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
