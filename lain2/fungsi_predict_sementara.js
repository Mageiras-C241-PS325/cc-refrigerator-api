exports.predictIngredients = async (req, h) => {
  try {
    const file = req.payload.file; // either the file itself or base64 string
    let imageBuffer;
    let fileName;

    // Check if the file is in base64 format
    if (typeof file === 'string') {
      // Decode base64 string to image
      const base64Data = file.split(';base64,').pop();
      imageBuffer = Buffer.from(base64Data, 'base64');

      // Determine the file type
      const { ext } = await fileType.fromBuffer(imageBuffer);
      if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        return h.response({ error: 'Invalid image format. Only jpg, jpeg, and png are allowed.' }).code(400);
      }

      fileName = `image_${Date.now()}.${ext}`;
      fs.writeFileSync(fileName, imageBuffer);
    } else {
      // Handle file upload
      const { mimetype, filename, path: tempFilePath } = file.hapi;
      const { ext } = await fileType.fromFile(tempFilePath);
      if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        return h.response({ error: 'Invalid image format. Only jpg, jpeg, and png are allowed.' }).code(400);
      }

      imageBuffer = fs.readFileSync(tempFilePath);
      fileName = filename;
    }

    // Send image to Django API
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: fileName,
      contentType: 'image/jpeg'
    });

    const ingredients = await axios.post(process.env.DJANGO_API_ENDPOINT, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    const recipeCollection = db.collection('recipes');
    const matchedRecipes = new Set();

    for (let ingredient of ingredients) {
      const querySnapshot = await recipeCollection.where('ingredients', 'array-contains', ingredient).get();
      querySnapshot.forEach(doc => {
        matchedRecipes.add(doc.data());
      });
    }

    // Filter recipes to include only those that match all ingredients
    const filteredRecipes = Array.from(matchedRecipes).filter(recipe =>
      ingredients.every(ingredient => recipe.ingredients.includes(ingredient))
    );

    console.log(filteredRecipes);

    // Clean up locally saved file if base64 decoded
    if (typeof recipe_file === 'string' && fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
    }

    return h.response({ message: 'File uploaded successfully', url: publicUrl }).code(200);
  } catch (error) {
    console.error('Error uploading file:', error);
    return h.response({ error: error.message }).code(500);
  }
};