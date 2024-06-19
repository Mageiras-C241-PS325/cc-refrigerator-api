const ingredientController = require('../controllers/ingredientController');
const auth = require('../middleware/auth');

module.exports = (db) => {
  return {
    name: 'ingredientRoutes',
    version: '1.0.0',
    register: async (server, options) => {
      server.route([
        {
          method: 'POST',
          path: '/predict',
          options: {
            payload: {
              maxBytes: 10485760, // 10MB
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              multipart: true
            },
            pre: [auth]
          },
          handler: ingredientController.predictIngredients
        },
        {
          method: 'POST',
          path: '/recommend',
          options: {
            payload: {
              maxBytes: 10485760, // 10MB
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              multipart: true
            },
            pre: [auth]
          },
          handler: ingredientController.recommendMenu
        },
        {
          method: 'POST',
          path: '/ingredients/add',
          options: {
            payload: {
              maxBytes: 10485760,
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              multipart: true
            },
            pre: [auth]
          },
          handler: ingredientController.addIngredient(db)
        },
        {
          method: 'POST',
          path: '/ingredients/addmany',
          options: {
            payload: {
              maxBytes: 10485760,
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              multipart: true
            },
            pre: [auth]
          },
          handler: ingredientController.addMultipleIngredients(db)
        },
        {
          method: 'GET',
          path: '/ingredients',
          options: { pre: [auth] },
          handler: ingredientController.getIngredients(db)
        },
        {
          method: 'GET',
          path: '/ingredients/{ingredient_id}',
          options: { pre: [auth] },
          handler: ingredientController.getIngredientById(db)
        },
        {
          method: 'PUT',
          path: '/ingredients/amount/{ingredient_id}',
          options: {
            payload: {
              maxBytes: 10485760,
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              multipart: true
            },
            pre: [auth]
          },
          handler: ingredientController.updateIngredientAmount(db)
        },
        {
          method: 'PUT',
          path: 'ingredients/amountmany/',
          options: {
            payload: {
              maxBytes: 10485760,
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              multipart: true
            },
            pre: [auth]
          },
          handler: ingredientController.updateMultipleIngredientsAmount(db)
        },
        {
          method: 'DELETE',
          path: '/ingredients/{ingredient_id}',
          options: { pre: [auth] },
          handler: ingredientController.deleteIngredientById(db)
        },
        {
          method: 'DELETE',
          path: '/ingredients',
          options: { pre: [auth] },
          handler: ingredientController.deleteAllIngredients(db)
        }
      ]);
    }
  };
};
