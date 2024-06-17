const ingredientController = require('../controllers/ingredientController');
const auth = require('../middleware/auth');

module.exports = (db, bucket) => {
  return {
    name: 'ingredientRoutes',
    version: '1.0.0',
    register: async (server, options) => {
      server.route([
        {
          method: 'POST',
          path: '/predict',
          options: { 
            pre: [{ method: auth }],
            payload: {
              maxBytes: 10485760, // 10MB
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data'
            }
          },
          handler: ingredientController.predictIngredients
        },
        {
          method: 'POST',
          path: '/ingredients/add',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.addIngredient(db)
        },
        {
          method: 'GET',
          path: '/ingredients',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.getIngredients(db)
        },
        {
          method: 'GET',
          path: '/ingredients/{ingredient_id}',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.getIngredientById(db)
        },
        {
          method: 'PUT',
          path: '/ingredients/amount/{ingredient_id}',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.updateIngredientAmount(db)
        },
        {
          method: 'DELETE',
          path: '/ingredients/{ingredient_id}',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.deleteIngredientById(db)
        },
        {
          method: 'DELETE',
          path: '/ingredients',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.deleteAllIngredients(db)
        }
      ]);
    }
  };
};
