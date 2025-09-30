// backend/src/routes/productos.routes.js
const { Pool } = require('pg');

module.exports = async function (fastify) {
  // Permite usar PG_* o DB_* desde .env
  const PGHOST = process.env.PGHOST || process.env.DB_HOST;
  const PGPORT = process.env.PGPORT || process.env.DB_PORT;
  const PGDATABASE = process.env.PGDATABASE || process.env.DB_NAME;
  const PGUSER = process.env.PGUSER || process.env.DB_USER;
  const PGPASSWORD = process.env.PGPASSWORD || process.env.DB_PASSWORD;

  const required = { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD };
  for (const [k, v] of Object.entries(required)) {
    if (!v || String(v).trim() === '') {
      throw new Error(`Falta variable de entorno para ${k} (PG_* o DB_*)`);
    }
  }

  fastify.log.info(
    { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD_set: !!PGPASSWORD },
    'PG env (sin exponer password)'
  );

  const pool = new Pool({
    host: PGHOST,
    port: Number(PGPORT),
    database: PGDATABASE,
    user: PGUSER,
    password: String(PGPASSWORD),
  });

  // Diagnóstico: comprueba conexión y existencia de la tabla
  fastify.get('/dbcheck', async (req, reply) => {
    try {
      await pool.query('SELECT 1');
      try {
        const r = await pool.query('SELECT count(*)::int AS c FROM productos');
        return { ok: true, db: 'ok', productos_count: r.rows[0].c };
      } catch (e) {
        return reply.status(200).send({
          ok: true,
          db: 'ok',
          productos_table: 'missing',
          hint: 'Crea la tabla productos (ver SQL).',
          error: e.message
        });
      }
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ ok: false, error: err.message });
    }
  });

  // GET /productos
  fastify.get('/productos', async (req, reply) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, nombre, precio, creado_en FROM productos ORDER BY id DESC'
      );
      return rows;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'DB_ERROR: ' + err.message });
    }
  });

  // POST /productos
  fastify.post('/productos', async (req, reply) => {
    try {
      const { nombre, precio } = req.body || {};
      if (!nombre || typeof nombre !== 'string' || isNaN(Number(precio))) {
        return reply.status(400).send({ error: 'Datos inválidos' });
      }
      const { rows } = await pool.query(
        'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING id, nombre, precio, creado_en',
        [nombre.trim(), Number(precio)]
      );
      reply.code(201).send(rows[0]);
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'DB_ERROR: ' + err.message });
    }
  });

  // DELETE /productos/:id
  fastify.delete('/productos/:id', async (req, reply) => {
    try {
      const id = Number(req.params.id);
      if (!id) return reply.status(400).send({ error: 'ID inválido' });
      const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
      if (rowCount === 0) return reply.status(404).send({ error: 'No encontrado' });
      return { ok: true };
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'DB_ERROR: ' + err.message });
    }
  });
};
