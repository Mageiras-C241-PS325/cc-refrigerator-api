const {Firestore} = require('@google-cloud/firestore');
const fs = require('fs');
const path = require('path');

// Path ke file kunci akun layanan
const serviceAccountPath = path.join(__dirname, 'serviceaccount.json');

// Inisialisasi Firestore dengan kredensial akun layanan
const firestore = new Firestore({
  projectId: 'mageiras-app',
  keyFilename: serviceAccountPath,
});

// Path ke file JSON
const dataPath = path.join(__dirname, 'recipes.json');

// Baca file JSON
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Nama koleksi di Firestore
const collectionName = 'Mageiras';

// Fungsi untuk mengunggah data
const uploadData = async () => {
  for (const item of data) {
    await firestore.collection(collectionName).add(item);
  }
  console.log('Data berhasil diunggah ke Firestore.');
};

// Panggil fungsi untuk mengunggah data
uploadData().catch(console.error);
