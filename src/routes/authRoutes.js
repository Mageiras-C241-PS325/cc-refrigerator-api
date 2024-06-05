const authController = require('../controllers/authController');

module.exports = (db) => {
  return {
    name: 'authRoutes',
    version: '1.0.0',
    register: async (server, options) => {
      server.route([
        {
          method: 'POST',
          path: '/register',
          handler: authController.register(db)
        },
        {
          method: 'POST',
          path: '/login',
          handler: authController.login(db)
        },
        {
          method: 'POST',
          path: '/logout',
          handler: authController.logout
        }
      ]);
    }
  };
};
