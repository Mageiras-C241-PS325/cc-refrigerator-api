const { Firestore } = require('@google-cloud/firestore');

// Initialize Firestore
// const firestore = new Firestore({
//   projectId: 'your-project-id',
//   keyFilename: 'path-to-your-service-account-file.json',
// });

const firestore = new Firestore();

// Function to delete a specific document
async function deleteDocument(collectionName, documentId) {
  try {
    const docRef = firestore.collection(collectionName).doc(documentId);
    await docRef.delete();
    console.log(`Document with ID: ${documentId} has been deleted from collection: ${collectionName}`);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
}

// Example usage
const collectionName = 'refrigerator';
const documentId = ''; // Replace with your document ID

deleteDocument(collectionName, documentId);
