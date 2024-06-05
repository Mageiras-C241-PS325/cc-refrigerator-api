const Hapi = require('@hapi/hapi');
const { db, bucket } = require('./config/db');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 7000,
    host: '0.0.0.0'
  });

  // Register routes
  await server.register(require('./routes/authRoutes')(db));
  await server.register(require('./routes/ingredientRoutes')(db, bucket));

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
