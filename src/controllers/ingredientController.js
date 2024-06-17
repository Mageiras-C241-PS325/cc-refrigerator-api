const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const fileType = require('file-type');
const axios = require('axios');
const FormData = require('form-data');
const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');
dotenv.config();

const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  keyFilename: path.join(__dirname, '../gcpServiceAccountKey.json')
});

const bucketName = process.env.GCP_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

exports.getRecipeDataset = (db) => async (req, h) => {
  try {
    const recipeCollection = db.collection('recipes');
    const snapshot = await recipeCollection.get();
    if (snapshot.empty) {
      return h.response({ message: 'No recipes found' }).code(404);
    }
    let recipes = [];
    snapshot.forEach(doc => {
      recipes.push({ id: doc.id, ...doc.data() });
    });
    return h.response(recipes).code(200);
  } catch (error) {
    console.error('Error getting recipes:', error);
    return h.response({ error: error.message }).code(500);
  }
};

exports.addRecipe = (db) => async (req, h) => {
  const { title, genre, label, directions, ingredients } = req.payload;
  try {
    const recipeDoc = db.collection('recipes').doc();
    await recipeDoc.set({ title, genre, label, directions, ingredients });
    return h.response({ message: 'Recipe added successfully' }).code(201);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.updateRecipe = (db) => async (req, h) => {
  const { id } = req.params;
  const { title, genre, label, directions, ingredients } = req.payload;
  try {
    const recipeDoc = db.collection('recipes').doc(id);
    const recipe = await recipeDoc.get();
    if (!recipe.exists) {
      return h.response({ message: 'Recipe not found' }).code(404);
    }
    await recipeDoc.update({ title, genre, label, directions, ingredients });
    return h.response({ message: 'Recipe updated successfully' }).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.deleteRecipe = (db) => async (req, h) => {
  const { id } = req.params;
  try {
    const recipeDoc = db.collection('recipes').doc(id);
    const recipe = await recipeDoc.get();
    if (!recipe.exists) {
      return h.response({ message: 'Recipe not found' }).code(404);
    }
    await recipeDoc.delete();
    return h.response({ message: 'Recipe deleted successfully' }).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.predictIngredients = async (req, h) => {
  try {
    const { file } = req.payload;
    let imageBuffer;
    let fileName;

    if (file && file._data && Buffer.isBuffer(file._data)) {
      // Handle file upload
      imageBuffer = file._data;
      const { ext } = await fileType.fromBuffer(imageBuffer);
      if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        return h.response({ error: 'Invalid image format. Only jpg, jpeg, and png are allowed.' }).code(400);
      }
      fileName = `image_${Date.now()}.${ext}`;
    } else {
      return h.response({ error: 'File is missing or not a valid image' }).code(400);
    }

    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: fileName,
      contentType: 'image/jpeg',
    });

    const response = await axios.post(process.env.DJANGO_API_ENDPOINT, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return h.response({ message: 'File uploaded successfully', data: response.data }).code(200);
  } catch (error) {
    console.error('Error uploading file:', error);
    return h.response({ error: error.message }).code(500);
  }
};

exports.addIngredient = (db) => async (req, h) => {
  const { name, amount } = req.payload;
  const userId = req.user ? req.user.user_id : null;
  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  try {
    const ingredientDoc = db.collection('ingredients').doc();
    await ingredientDoc.set({ name, amount, userId });
    return h.response({ message: 'Ingredient added successfully' }).code(201);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.getIngredients = (db) => async (req, h) => {
  const userId = req.user ? req.user.user_id : null;
  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  try {
    const ingredients = [];
    const snapshot = await db.collection('ingredients').where('userId', '==', userId).get();
    snapshot.forEach((doc) => {
      ingredients.push({ id: doc.id, ...doc.data() });
    });
    return h.response(ingredients).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.getIngredientById = (db) => async (req, h) => {
  const { id } = req.params;
  const userId = req.user ? req.user.user_id : null;
  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  try {
    const ingredientDoc = db.collection('ingredients').doc(id);
    const ingredient = await ingredientDoc.get();
    if (!ingredient.exists || ingredient.data().userId !== userId) {
      return h.response({ message: 'Ingredient not found' }).code(404);
    }
    return h.response(ingredient.data());
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.updateIngredientAmount = (db) => async (req, h) => {
  const { id } = req.params;
  const { amount } = req.payload;
  const userId = req.user ? req.user.user_id : null;
  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  try {
    const ingredientDoc = db.collection('ingredients').doc(id);
    const ingredient = await ingredientDoc.get();
    if (!ingredient.exists || ingredient.data().userId !== userId) {
      return h.response({ message: 'Ingredient not found' }).code(404);
    }
    await ingredientDoc.update({ amount });
    return h.response({ message: 'Ingredient amount updated successfully' });
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.deleteIngredientById = (db) => async (req, h) => {
  const { id } = req.params;
  const userId = req.user ? req.user.user_id : null;
  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  try {
    const ingredientDoc = db.collection('ingredients').doc(id);
    const ingredient = await ingredientDoc.get();
    if (!ingredient.exists || ingredient.data().userId !== userId) {
      return h.response({ message: 'Ingredient not found' }).code(404);
    }
    await ingredientDoc.delete();
    return h.response({ message: 'Ingredient deleted successfully' }).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.deleteAllIngredients = (db) => async (req, h) => {
  const userId = req.user ? req.user.user_id : null;
  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  try {
    const batch = db.batch();
    const snapshot = await db.collection('ingredients').where('userId', '==', userId).get();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return h.response({ message: 'All ingredients deleted successfully' }).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};
