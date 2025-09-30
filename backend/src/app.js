// src/app.js
require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

// 1) Plugins base (CORS)
fastify.register(cors, { origin: '*', methods: ['GET','POST','DELETE','OPTIONS'] });

// 2) ✅ Ruta de salud (AQUÍ se expone /health)
fastify.get('/health', async () => ({ ok: true }));

// 3) Tus rutas de negocio
//    (asegúrate que el path es correcto: ./routes/productos.routes.js)
fastify.register(require('./routes/productos.routes')); // sin prefijo

// 4) ✅ Imprimir el árbol de rutas (AQUÍ, antes de listen)
fastify.ready((err) => {
  if (err) throw err;
  console.log(fastify.printRoutes());
});

// 5) Arranque
const PORT = Number(process.env.PORT || 3000);
fastify.listen({ port: PORT, host: '0.0.0.0' })
  .then(() => fastify.log.info(`API escuchando en puerto ${PORT}`))
  .catch((e) => { fastify.log.error(e); process.exit(1); });
