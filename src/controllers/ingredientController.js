const axios = require('axios');
const FormData = require('form-data');
const { nanoid } = require('nanoid');

const { Firestore } = require('@google-cloud/firestore');
const db_fs = new Firestore();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const dotenv = require('dotenv');
dotenv.config();

exports.predictIngredients = async (req, h) => {
  try {
    const userId = req.user ? req.user.user_id : null;

    if (!userId) {
      return h.response({ error: 'User not authenticated' }).code(401);
    }

    // Step 1: Accept image file from frontend
    const file = req.payload.file;
    console.log(file);
    if (!file) {
      return h.response({ error: 'No image file provided' }).code(400);
    }

    // Step 2: Pass the image to Django API for recognition
    const formData = new FormData();
    formData.append('file', file._data, file.hapi.filename);
    const djangoApiUrl = process.env.DJANGO_API_ENDPOINT;

    const djangoResponse = await axios.post(djangoApiUrl, formData, {
      headers: formData.getHeaders()
    });

    console.log('API Response:', djangoResponse.data);
    if (djangoResponse.status !== 200) {
      return h.response({ error: 'Failed to recognize image' }).code(500);
    }

    const id = nanoid(4);
    const predictedIngredients = djangoResponse.data.ingredients;
    
    // Get a reference to the user's refrigerator document
    const refrigeratorCollection = db_fs.collection('refrigerators').doc(userId);
    
    // Get the user's refrigerator document
    const userDoc = await refrigeratorCollection.get();
    if (!userDoc.exists) {
      throw new Error('User refrigerator document not found');
    }

    // Get a reference to the user ingredients collection
    const userIngredientsRef = refrigeratorCollection.collection('user_ingredients');

    // Start a Firestore transaction
    const batch = db.batch();

    // Iterate over the ingredients to update
    for (const ingredientName in predictedIngredients) {
      // Count the number of times the ingredient appears in the array
      const ingredientAmount = predictedIngredients.filter(name => name === ingredientName).length;

      // Check if the ingredient exists in the user's ingredients collection
      const ingredientQuery = await userIngredientsRef.where('name', '==', ingredientName).get();
      if (!ingredientQuery.empty) {
        // If the ingredient exists, update its amount
        const ingredientDoc = ingredientQuery.docs[0];
        batch.update(ingredientDoc.ref, { amount: ingredientAmount });
      } else {
        // If the ingredient doesn't exist, add it to the user's ingredients collection
        const newIngredientDocRef = userIngredientsRef.doc();
        batch.set(newIngredientDocRef, { name: ingredientName, amount: ingredientAmount });
      }
    }

    // Commit the batched writes
    await batch.commit();
    
    console.log(id, predictedIngredients);
    return h.response({ ingredient_id: id, message: 'Ingredient added successfully' }).code(201);
  } catch (error) {
    if (error.code === 'ECONNRESET') {
      return h.response({ error: 'Connection to the Django API was reset' }).code(500);
    }
    
    console.error('Error in predictIngredients:', error);
    return h.response({ error: error.message }).code(500);
  }
};

exports.recommendMenu = async (req, h) => {
  try {
    const userId = req.user ? req.user.user_id : null;

    if (!userId) {
      return h.response({ error: 'User not authenticated' }).code(401);
    }

    // Get a reference to the user's refrigerator document
    const refrigeratorCollection = db.collection('refrigerators').doc(userId);
    
    // Get the user's refrigerator document
    const userDoc = await refrigeratorCollection.get();
    if (!userDoc.exists) {
      throw new Error('User refrigerator document not found');
    }

    // Perform full-text search in Firestore
    const recipeCollection = db_fs.collection('recipes');
    let recipes = [];

    // Get all ingredients from the user's refrigerator
    const userIngredientsSnapshot = await refrigeratorCollection.collection('user_ingredients').get();
    const userIngredients = userIngredientsSnapshot.docs.map(doc => doc.data().name);

    // Perform a full-text search for recipes based on the user's ingredients
    for (const ingredient of userIngredients) {
      const querySnapshot = await recipesRef.where('ingredients', 'array-contains', ingredient).get();
      querySnapshot.forEach(doc => {
        recipes.push({ id: doc.id, ...doc.data() });
      });
    }

    if (querySnapshot.empty) {
      return h.response({ message: 'No recipes found' }).code(404);
    }

    // Return the recipes
    return h.response(recipes).code(200);

  } catch (error) {
    console.error('Error in recommendMenu:', error);
    return h.response({ error: error.message }).code(500);
  }
};

exports.addIngredient = (db) => async (req, h) => {
  const { name, amount } = req.payload;
  const userId = req.user ? req.user.user_id : null;

  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  const id = nanoid(4);
  const data = {
    "userId": userId,
    "name": name,
    "amount": amount
  }
  
  const refrigeratorCollection = db_fs.collection('refrigerator');
  console.log(id, data);

  try {
    await refrigeratorCollection.doc(id).set(data);
    return h.response({ ingredient_id: id, message: 'Ingredient added successfully' }).code(201);
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
    const snapshot = await db.collection('recipes').get();
    // const snapshot = await db.collection('ingredients').where('userId', '==', userId).get();
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
