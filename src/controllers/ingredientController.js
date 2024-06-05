const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

exports.addIngredient = (db) => async (req, h) => {
  const { name, amount } = req.payload;
  const userId = req.user.user_id;
  try {
    const ingredientDoc = db.collection('ingredients').doc();
    await ingredientDoc.set({ name, amount, userId });
    return h.response({ message: 'Ingredient added successfully' }).code(201);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.getIngredients = (db) => async (req, h) => {
  const userId = req.user.user_id;
  try {
    const ingredients = [];
    const snapshot = await db.collection('ingredients').where('userId', '==', userId).get();
    snapshot.forEach((doc) => {
      ingredients.push({ id: doc.id, ...doc.data() });
    });
    return h.response(ingredients);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.getIngredientById = (db) => async (req, h) => {
  const { id } = req.params;
  const userId = req.user.user_id;
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
  const userId = req.user.user_id;
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

exports.updateOrAddIngredient = (db) => async (req, h) => {
  const { name, amount } = req.payload;
  const userId = req.user.user_id;
  try {
    const snapshot = await db.collection('ingredients').where('userId', '==', userId).where('name', '==', name).get();
    if (snapshot.empty) {
      const ingredientDoc = db.collection('ingredients').doc();
      await ingredientDoc.set({ name, amount, userId });
      return h.response({ message: 'Ingredient added to fridge' }).code(201);
    } else {
      snapshot.forEach(async (doc) => {
        await doc.ref.update({ amount });
      });
      return h.response({ message: 'Ingredient amount updated successfully' });
    }
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.deleteIngredientById = (db) => async (req, h) => {
  const { id } = req.params;
  const userId = req.user.user_id;
  try {
    const ingredientDoc = db.collection('ingredients').doc(id);
    const ingredient = await ingredientDoc.get();
    if (!ingredient.exists || ingredient.data().userId !== userId) {
      return h.response({ message: 'Ingredient not found' }).code(404);
    }
    await ingredientDoc.delete();
    return h.response({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.deleteAllIngredients = (db) => async (req, h) => {
  const userId = req.user.user_id;
  try {
    const batch = db.batch();
    const snapshot = await db.collection('ingredients').where('userId', '==', userId).get();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return h.response({ message: 'All ingredients deleted successfully' });
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.deleteMultipleIngredients = (db) => async (req, h) => {
  const { ids } = req.payload;
  const userId = req.user.user_id;
  try {
    const batch = db.batch();
    for (let id of ids) {
      const ingredientDoc = db.collection('ingredients').doc(id);
      const ingredient = await ingredientDoc.get();
      if (ingredient.exists && ingredient.data().userId === userId) {
        batch.delete(ingredientDoc);
      }
    }
    await batch.commit();
    return h.response({ message: 'Selected ingredients deleted successfully' });
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

exports.predictIngredients = async (req, h) => {
  const { file } = req.payload;

  // Buat buffer dari file yang diunggah
  const buffer = [];

  return new Promise((resolve, reject) => {
    file.on('data', (data) => {
      buffer.push(data);
    });

    file.on('end', async () => {
      const imageBuffer = Buffer.concat(buffer);
      
      try {
        // Gunakan Google Cloud Vision API untuk memprediksi konten gambar
        const [result] = await client.objectLocalization({
          image: { content: imageBuffer.toString('base64') },
        });

        const objects = result.localizedObjectAnnotations.map(object => object.name);

        resolve(h.response({ ingredients: objects }).code(200));
      } catch (error) {
        reject(h.response({ error: error.message }).code(500));
      }
    });

    file.on('error', (err) => {
      reject(h.response({ error: err.message }).code(500));
    });
  });
};
