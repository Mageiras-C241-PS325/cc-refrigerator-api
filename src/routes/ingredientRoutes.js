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
          path: '/ingredients/{id}',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.getIngredientById(db)
        },
        {
          method: 'PUT',
          path: '/ingredients/{id}/amount',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.updateIngredientAmount(db)
        },
        {
          method: 'PUT',
          path: '/ingredients/updateOrAdd',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.updateOrAddIngredient(db)
        },
        {
          method: 'DELETE',
          path: '/ingredients/{id}',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.deleteIngredientById(db)
        },
        {
          method: 'DELETE',
          path: '/ingredients',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.deleteAllIngredients(db)
        },
        {
          method: 'DELETE',
          path: '/ingredients/multiple',
          options: { pre: [{ method: auth }] },
          handler: ingredientController.deleteMultipleIngredients(db)
        },
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
        }
      ]);
    }
  };
};
