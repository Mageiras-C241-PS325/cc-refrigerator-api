const axios = require('axios');
const FormData = require('form-data');
const { nanoid } = require('nanoid');
const { Firestore } = require('@google-cloud/firestore');
const db_fs = new Firestore();
const dotenv = require('dotenv');
dotenv.config();

const ingredientsWithFixedIds = {
  "chicken": "0EwX5m2jEsRpWwQPLZFq",
  "calamansi": "1fqZPNPEaRiftMEG77Pa",
  "chili": "27c1CvFMG5kA4PoooWh3",
  "carrot": "J5UoHavi60KIw41uGAI5",
  "onion": "JjG96eQwn3NXdyaK5sa2",
  "garlic": "RQ16xVV0U9a6CAZgFKbf",
  "bell pepper": "TzWdAwrf6rrTMSkSOsK2",
  "potato": "Uv4DlqLxcKbZRCnGXhXX",
  "cucumber": "VLe7KZhF9GcUqkw9zeUe",
  "ginger": "hWPZoZF72ul9VD7ShGrI",
  "tomato": "pzDKhAAGaOtPEIWZejXR",
  "long chili": "sUDIUiInif3veRqz9dDf",
  "pig": "xx5rPL1KoxRkENcQspm5"
};

exports.predictIngredients = async (req, h) => {
  try {
    const userId = req.user ? req.user.user_id : null;

    if (!userId) {
      return h.response({ error: 'User not authenticated' }).code(401);
    }

    const file = req.payload.file;
    if (!file) {
      return h.response({ error: 'No image file provided' }).code(400);
    }

    const formData = new FormData();
    formData.append('file', file._data, file.hapi.filename);
    const djangoApiUrl = process.env.DJANGO_API_ENDPOINT;

    const djangoResponse = await axios.post(djangoApiUrl, formData, {
      headers: formData.getHeaders()
    });

    if (djangoResponse.status !== 200) {
      return h.response({ error: 'Failed to recognize image' }).code(500);
    }

    const predictedIngredients = djangoResponse.data.prediction;
    console.log(`predicted Ingredients: ${predictedIngredients}`);

    const refrigeratorCollection = db_fs.collection('refrigerator').doc(userId);
    const userIngredientsRef = refrigeratorCollection.collection('Ingredient');
    const batch = db_fs.batch();

    for (const ingredientName of predictedIngredients) {
      let ingredientAmount = predictedIngredients.filter(name => name === ingredientName).length;
      console.log(`${ingredientName} add amount ${ingredientAmount}`);
      const ingredientQuery = await userIngredientsRef.where('name', '==', ingredientName).get();
      let amount = 0;

      if (!ingredientQuery.empty) {
        const ingredientDoc = ingredientQuery.docs[0];

        ingredientQuery.forEach(doc => {
          const ingredient = { id: doc.id, ...doc.data() };
          amount = ingredient.amount; // Access the amount property
          console.log(`${ingredient.name} existing amount ${amount}`);
        });

        ingredientAmount = ingredientAmount + amount;
        console.log(`${ingredientName} total amount ${ingredientAmount}`);
        batch.update(ingredientDoc.ref, { amount: ingredientAmount, last_update: new Date().toISOString() });
      } else {
        const ingredientId = ingredientsWithFixedIds[ingredientName.toLowerCase()] || nanoid(4);
        const data = {
          name: ingredientName,
          amount: ingredientAmount,
          last_update: new Date().toISOString()
        };

        const newIngredientDocRef = userIngredientsRef.doc(ingredientId);
        batch.set(newIngredientDocRef, data);
      }
    }

    await batch.commit();
    return h.response({ message: 'Ingredient prediction and update successful', predictions: predictedIngredients }).code(200);
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

    const refrigeratorDocRef = db_fs.collection('refrigerator').doc(userId);
    const userIngredientsSnapshot = await refrigeratorDocRef.collection('Ingredient').get();
    if (userIngredientsSnapshot.empty) {
      return h.response({ message: 'No ingredients found in the refrigerator' }).code(404);
    }

    const userIngredients = userIngredientsSnapshot.docs.map(doc => doc.data().name.toLowerCase());
    const recipeCollection = db_fs.collection('recipes');
    let recipes = [];

    const allRecipesSnapshot = await recipeCollection.get();
    allRecipesSnapshot.forEach(doc => {
      const recipe = doc.data();
      const recipeIngredients = recipe.ingredients.toLowerCase().split(';');

      const hasAllIngredients = userIngredients.every(ingredient => recipeIngredients.includes(ingredient));
      if (hasAllIngredients) {
        recipes.push({
          id: doc.id,
          title: recipe.title,
          directions: recipe.directions,
          genre: recipe.genre,
          image_url: recipe.image_url,
          ingredients: recipe.ingredients,
          label: recipe.label
        });
      }
    });

    if (recipes.length === 0) {
      return h.response({ message: 'No recipes found' }).code(404);
    }

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

  const ingredientId = ingredientsWithFixedIds[name.toLowerCase()] || nanoid(4);
  const data = {
    name,
    amount: parseInt(amount, 10),
    last_update: new Date().toISOString()
  };

  const userDocRef = db_fs.collection('refrigerator').doc(userId);
  const ingredientDocRef = userDocRef.collection('Ingredient').doc(ingredientId);

  try {
    // Ensure the user document exists in the refrigerator collection
    await userDocRef.set({ userId: userId }, { merge: true });

    // Add ingredient to the Ingredient subcollection
    await ingredientDocRef.set(data);

    return h.response({ ingredient_id: ingredientId, message: 'Ingredient added successfully' }).code(201);
  } catch (error) {
    console.error('Error adding ingredient:', error);
    return h.response({ error: error.message }).code(500);
  }
};

exports.addMultipleIngredients = (db) => async (req, h) => {
  const { ingredients } = req.payload;
  const userId = req.user ? req.user.user_id : null;

  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  const userDocRef = db_fs.collection('refrigerator').doc(userId);
  const batch = db_fs.batch();

  try {
    // Ensure the user document exists in the refrigerator collection
    await userDocRef.set({ userId: userId }, { merge: true });

    for (const ingredient of ingredients) {
      const ingredientId = ingredientsWithFixedIds[ingredient.name.toLowerCase()] || nanoid(4);
      const data = {
        name: ingredient.name,
        amount: parseInt(ingredient.amount, 10),
        last_update: new Date().toISOString()
      };

      const ingredientDocRef = userDocRef.collection('Ingredient').doc(ingredientId);
      batch.set(ingredientDocRef, data);
    }

    await batch.commit();
    return h.response({ message: 'Ingredients added successfully' }).code(201);
  } catch (error) {
    console.error('Error adding ingredients:', error);
    return h.response({ error: error.message }).code(500);
  }
}

exports.getIngredients = (db) => async (req, h) => {
  const userId = req.user ? req.user.user_id : null;
  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  const ingredientCollectionRef = db_fs.collection('refrigerator').doc(userId).collection('Ingredient');

  try {
    const snapshot = await ingredientCollectionRef.get();
    if (snapshot.empty) {
      return h.response({ message: 'No ingredients found' }).code(404);
    }

    const ingredients = [];
    snapshot.forEach(doc => {
      ingredients.push({ id: doc.id, ...doc.data() });
    });

    return h.response({ ingredients: ingredients }).code(200);
  } catch (error) {
    console.error('Error getting ingredients:', error);
    return h.response({ error: error.message }).code(500);
  }
};

exports.getIngredientById = (db) => async (req, h) => {
  const { ingredient_id } = req.params;
  const userId = req.user ? req.user.user_id : null;

  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  console.log('Getting ingredient with ID:', ingredient_id, 'for user ID:', userId);

  const ingredientDocRef = db_fs.collection('refrigerator').doc(userId).collection('Ingredient').doc(ingredient_id);

  try {
    const doc = await ingredientDocRef.get();
    if (!doc.exists) {
      console.log('Ingredient not found:', ingredient_id);
      return h.response({ message: 'Ingredient not found' }).code(404);
    }

    console.log('Ingredient data:', doc.data());
    return h.response({ id: doc.id, ...doc.data() }).code(200);
  } catch (error) {
    console.error('Error getting ingredient:', error);
    return h.response({ error: error.message }).code(500);
  }
};

exports.updateIngredientAmount = (db) => async (req, h) => {
  const { ingredient_id } = req.params;
  const { amount } = req.payload;
  const userId = req.user ? req.user.user_id : null;

  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  console.log('Updating ingredient with ID:', ingredient_id, 'for user ID:', userId, 'with new amount:', amount);

  const ingredientDocRef = db_fs.collection('refrigerator').doc(userId).collection('Ingredient').doc(ingredient_id);

  try {
    const doc = await ingredientDocRef.get();
    if (!doc.exists) {
      console.log('Ingredient not found:', ingredient_id);
      return h.response({ message: 'Ingredient not found' }).code(404);
    }

    await ingredientDocRef.update({ amount: parseInt(amount, 10), last_update: new Date().toISOString() });

    console.log('Ingredient updated:', ingredient_id);
    return h.response({ message: 'Ingredient amount updated successfully' }).code(200);
  } catch (error) {
    console.error('Error updating ingredient amount:', error);
    return h.response({ error: error.message }).code(500);
  }
};

exports.deleteIngredientById = (db) => async (req, h) => {
  const { ingredient_id } = req.params;
  const userId = req.user ? req.user.user_id : null;

  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  console.log('Deleting ingredient with ID:', ingredient_id, 'for user ID:', userId);

  const ingredientDocRef = db_fs.collection('refrigerator').doc(userId).collection('Ingredient').doc(ingredient_id);

  try {
    const doc = await ingredientDocRef.get();
    if (!doc.exists) {
      console.log('Ingredient not found:', ingredient_id);
      return h.response({ message: 'Ingredient not found' }).code(404);
    }

    await ingredientDocRef.delete();
    console.log('Ingredient deleted:', ingredient_id);
    return h.response({ message: 'Ingredient deleted successfully' }).code(200);
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return h.response({ error: error.message }).code(500);
  }
};

exports.deleteAllIngredients = (db) => async (req, h) => {
  const userId = req.user ? req.user.user_id : null;

  if (!userId) {
    return h.response({ error: 'User not authenticated' }).code(401);
  }

  console.log('Deleting all ingredients for user ID:', userId);

  const ingredientCollectionRef = db_fs.collection('refrigerator').doc(userId).collection('Ingredient');

  try {
    const snapshot = await ingredientCollectionRef.get();
    if (snapshot.empty) {
      console.log('No ingredients found for user:', userId);
      return h.response({ message: 'No ingredients found' }).code(404);
    }

    const batch = db_fs.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    console.log('All ingredients deleted for user ID:', userId);
    return h.response({ message: 'All ingredients deleted successfully' }).code(200);
  } catch (error) {
    console.error('Error deleting all ingredients:', error);
    return h.response({ error: error.message }).code(500);
  }
};
