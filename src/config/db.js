const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Inisialisasi Firebase Admin SDK untuk autentikasi
const firebaseServiceAccount = require(path.join(__dirname, 'firebaseServiceAccountKey.json'));
const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
}, 'firebaseAuth'); // Memberi nama instance ini

// Inisialisasi Firebase Admin SDK untuk Firestore
const gcpServiceAccount = require(path.join(__dirname, 'gcpServiceAccountKey.json'));
const gcpAdmin = admin.initializeApp({
  credential: admin.credential.cert(gcpServiceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.GCP_BUCKET_NAME
}, 'firestore'); // Memberi nama instance ini

const auth = firebaseAdmin.auth(); // Instance untuk autentikasi
const db = gcpAdmin.firestore(); // Instance untuk Firestore
const bucket = gcpAdmin.storage().bucket(); // Instance untuk Cloud Storage

module.exports = { db, bucket, auth };
