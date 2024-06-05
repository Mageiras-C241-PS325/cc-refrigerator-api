const { db, bucket } = require('../config/db');

// Fungsi untuk mengelola interaksi dengan database machine learning di Firestore dan bucket GCP
const saveModel = async (modelId, data) => {
  const modelRef = db.collection('mlModels').doc(modelId);
  await modelRef.set(data);
};

const getModel = async (modelId) => {
  const modelRef = db.collection('mlModels').doc(modelId);
  const doc = await modelRef.get();
  if (!doc.exists) {
    throw new Error('No such model!');
  }
  return doc.data();
};

const uploadFile = async (filePath, destination) => {
  await bucket.upload(filePath, {
    destination,
  });
};

module.exports = {
  saveModel,
  getModel,
  uploadFile,
};
