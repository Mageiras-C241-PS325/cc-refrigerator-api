const Hapi = require('@hapi/hapi');
const { db, bucket } = require('./src/config/db');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 7000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'], // Mengizinkan semua origin
        additionalHeaders: ['authorization', 'content-type'], // Tambahkan header yang diperlukan
      },
    },
  });

  // Register routes
  await server.register(require('./src/routes/authRoutes')(db));
  console.log('Auth routes registered');

  await server.register(require('./src/routes/ingredientRoutes')(db, bucket));
  console.log('Ingredient routes registered');

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
