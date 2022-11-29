const { json } = require("body-parser");
const fs = require("fs");

class Contenedor {
  constructor(filename) {
    this.filePath = filename;
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return "El archivo no puede ser leido";
    }
  }

  async save(producto) {
    try {
      const productos = await this.getAll();
      let idAnterior;
      let idNuevo;
      let productoId;

      if (productos.length > 0) {
        /* const productos = JSON.parse(contenido) */

        idAnterior = productos[productos.length - 1].id;
        idNuevo = idAnterior + 1;
        productoId = { ...producto, id: idNuevo };
        productos.push(productoId);

        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify(productos, null, 2)
        );
      } else {
        idNuevo = 1;
        productoId = { ...producto, id: idNuevo };

        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify([productoId], null, 2)
        );
      }

      return idNuevo;
    } catch (error) {
      console.log("error");
    }
  }

  async getById(id) {
    const productos = await this.getAll();
    console.log(productos);
    const producto = productos.find((producto) => producto.id == id);
    if (!producto) return console.log("el id no existe");
    return producto;
  }

  async deleteById(id) {
    const productos = await this.getAll();
    const producto = productos.find((producto) => producto.id == id);
    if (!producto) {
      console.log("No existe producto con ese id");
    } else {
      let productoFilt = productos.filter((producto) => producto.id != id);
      await fs.promises.writeFile(this.filePath, JSON.stringify(productoFilt));
    }
  }

  async deleteAll() {
    await fs.promises.writeFile(this.filePath, JSON.stringify([], null));
  }

  async modifyElement(id, body) {
    try {
      let all = this.getAll();
      let product = all.findIndex((el) => el.id == id);
      if (product >= 0) {
        id = parseInt(id);
        let newProduct = { ...body, id };
        all[product] = newProduct;
        let products = JSON.stringify(all);
        fs.writeFileSync("./productos.txt", products);
        return {
          res: true,
          id: id,
          msg: "producto correctamente modificado",
          producto: body,
        };
      }
      if (product == -1) {
        console.log("err");
        return { err: true, id: id, msg: "producto a modificar no existe" };
      }
    } catch {
      console.log(err);
    }
  }

  async change(idChange, productChange) {
    try {
      const productos = await this.getAll();
      if (productos.some((a) => a.id === idChange)) {
        //buscamos el index del producto que tenga el correspondiente id
        let index = productos.findIndex((a) => a.id === idChange);
        productos[index].title = productChange.title;
        productos[index].price = productChange.price;
        productos[index].url = productChange.url;
        productos[index].stock = productChange.stock;
        productos[index].timestamp = Date.now();
        //ojo que en productos.txt no estan estos valores
        const contenidoNuevo = JSON.stringify(productos, null, 2);
        await fs.promises.writeFile(this.filePath, contenidoNuevo);
        return productos[index];
      } else {
        return null;
      }
    } catch (error) {
      return "Error:" + error;
    }
  }
}

module.exports = Contenedor;
const cont = new Contenedor();

// cont.save({ nombre: "Pepsi", precio: "1100" });
// cont.getById(1).then((res) => console.log(res));
// cont.getAll().then((res) => console.log(res));
// cont.deleteById(1).then((res) => console.log(res));
// cont.deleteAll().then((res) => console.log(res));

// save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
// getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
// getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
// deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
// deleteAll(): void - Elimina todos los objetos presentes en el archivo.
