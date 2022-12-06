const knex = require("knex");

// const database = knex(options)

class ContenedorSQL {
  constructor(options, tableName) {
    this.database = knex(options);
    this.table = tableName;
  }

  async getAll() {
    try {
      //obtenemos los registros de la tabla
      const response = await this.database.from(this.table).select("*");
      return response;
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async save(object) {
    try {
      const [id] = await this.database.from(this.table).insert(object);
      return `Se guardo exitosamente con el id ${id}`;
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async getById(id1) {
    try {
      const [producto] = await this.database
        .from(this.table)
        .select("*")
        .where("id", id1);
      if (producto) {
        const productoFinal = JSON.parse(JSON.stringify(producto));
        console.log(productoFinal);
        return productoFinal;
      } else {
        return "No hay producto con ese ID";
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async deleteById(id1) {
    try {
      await this.database.from(this.table).select("*").where("id", id1).del();
      return `El producto con id: ${id1} fue eliminado`;
    } catch (error) {
      return "No existe producto con ese ID";
    }
  }

  async deleteAll() {
    try {
      await this.database.from(this.table).del();
      return "Datos eliminados de la tabla";
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async updateById(idChange, productChange) {
    try {
      await this.database
        .from(this.table)
        .where("id", idChange)
        .update(productChange);
      return `Producto con id:${idChange} cambiado`;
    } catch (error) {
      return `Error: ${error}`;
    }
  }
}

module.exports = { ContenedorSQL };
