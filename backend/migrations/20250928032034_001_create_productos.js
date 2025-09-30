exports.up = (knex) =>
  knex.schema.createTable('productos', (t) => {
    t.increments('id').primary();
    t.string('nombre').notNullable();
    t.decimal('precio', 10, 2).notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTableIfExists('productos');
