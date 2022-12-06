const { options } = require("./databaseConfig");

//conecta la libreria
const knex = require("knex");

//crear instancia de la base de datos de sqlite
const databaseSqlite = knex(options.SQLite);

await databaseSqlite.schema
  .createTable("mensajes", (table) => {
    table.string("mail"), table.integer("time"), table.string("text");
    //increments = auto incremental (solo va aumentando el id)
  })
  .then(() => {
    console.log("Conexion exitosa");
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  })
  .finally(() => {
    knex.destroy();
  });
//finally es algo que va a pasar salga bien o mal

databaseSqlite("mensajes")
  .insert()
  .then(() => {
    console.log("tabla cargada");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    knex.destroy();
  });
