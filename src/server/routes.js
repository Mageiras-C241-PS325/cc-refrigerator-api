const { 
  recognizeIngredients,
  login,
  register,
  logout,
  addIngredient,
  deleteIngredient,
  deleteAllIngredients,
  showIngredients,
  showDetailIngredient,
  updateIngredient,
  addMenu,
  recommendMenu
 } = require('../server/handler');
 
const routes = [
  // ===== fitur utama =====
    {
      path: '/recognize',
      method: 'POST',
      handler: recognizeIngredients
    },
  
    // ===== fitur user =====
    {
      path: '/login',
      method: 'POST',
      handler: login
    },
    {
      path: '/register',
      method: 'POST',
      handler: register
    },
    {
      path: '/logout',
      method: 'POST',
      handler: logout
    },

    // ===== fitur bahan =====
    {
      path: '/add_ingredient',
      method: 'POST',
      handler: addIngredient
    },
    {
      path: '/delete',
      method: 'POST',
      handler: deleteIngredient
    },
    {
      path: '/deleteAll',
      method: 'POST',
      handler: deleteAllIngredients
    },
    {
      path: '/show',
      method: 'GET',
      handler: showIngredients
    },
    {
      path: '/showDetail',
      method: 'GET',
      handler: showDetailIngredient
    },
    {
      path: '/update',
      method: 'POST',
      handler: updateIngredient
    },

    // ===== fitur menu =====
    {
      path: '/add_menu',
      method: 'POST',
      handler: addMenu
    },
    {
      path: '/recommend',
      method: 'GET',
      handler: recommendMenu
    }
];
   
  module.exports = routes;