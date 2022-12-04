//archivo de configuracion de mysql
// creando una base de datos
const options = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "Desafio16",
  },
};
module.exports = { options };
