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
          options: { 
            payload: {
              maxBytes: 10485760, // 10MB
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              multipart: true
            }
          },
          handler: authController.register(db)
        },
        {
          method: 'POST',
          path: '/login',
          options: { 
            payload: {
              maxBytes: 10485760, // 10MB
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              multipart: true
            }
          },
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
