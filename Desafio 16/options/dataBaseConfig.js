const path = require("path");

const options = {
  MySQL: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "Desafio16",
    },
  },
  SQLite: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "../DB/chatdb.sqlite"),
    },
    useNullAsDefault: true,
  },
};
module.exports = { options };
