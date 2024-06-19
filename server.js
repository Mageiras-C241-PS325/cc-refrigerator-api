const Hapi = require('@hapi/hapi');
const { db } = require('./src/config/db');

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
  await server.register(require('./src/routes/ingredientRoutes')(db));

  await server.start();
  console.log(`Server berjalan di ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
