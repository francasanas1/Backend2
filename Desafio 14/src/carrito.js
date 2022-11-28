const fs = require("fs");
const Contenedor = require("./contenedor.js");
const contenedorProductos = new Contenedor("./src/files/productos.txt");

class Carrito {
  constructor(filename) {
    this.filePath = filename;
  }

  async getCarts() {
    try {
      const contenido = await fs.promises.readFile(this.filePath, "utf-8");
      if (contenido.length > 0) {
        const carts = JSON.parse(contenido);
        return carts;
      } else {
        return [];
      }
    } catch (error) {
      return "Error:" + error;
    }
  }
  // En esta funcion introducimos los productos al carrito
  async getCartProducts(idCart) {
    try {
      // El método some() comprueba si al menos un elemento del array cumple con la condición implementada por la función proporcionada.
      const carts = await this.getCarts();
      if (carts.some((a) => a.id === idCart)) {
        let index = carts.findIndex((a) => a.id === idCart);
        let productsCart = [];
        const productsId = carts[index].products;
        await Promise.all(
          productsId.map(async (idProducto) => {
            productsCart.push(await contenedorProductos.getById(idProducto));
          })
        );
        return productsCart;
      } else {
        return "No existe el carrito";
      }
    } catch (error) {
      return "Error:" + error;
    }
  }
  // creamos un carro
  async createCart() {
    try {
      const carts = await this.getCarts();
      let idAnterior;
      let idNuevo;
      let cartId;
      if (carts.length > 0) {
        idAnterior = carts[carts.length - 1].id;
        //sumo +1 al nuevo carrito
        idNuevo = idAnterior + 1;
        cartId = { id: idNuevo, products: [], time: Date.now() };
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify([cartId], null, 2)
        );
        //null es el valor que devuelve en caso de no haber podido funcionar el stringify. Y 2 es el valor de sangrias que debe dejar hacia abajo (es para que en el .txt no ponga el objeto en una sola linea).
        //JSON.stringify convierte un valor de JavaScript en JSON
      } else {
        idNuevo = 1;
        cartId = { id: idNuevo, products: [], time: Date.now() };
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify([cartId], null, 2)
        );
      }
      return carts;
    } catch (error) {
      return "Error:" + error;
    }
  }
  // ag
  async addToCart(idCart, idProducto) {
    try {
      const carts = await this.getCarts();
      const products = await contenedorProductos.getAll();
      if (carts.some((a) => a.id === idCart)) {
        if (products.some((a) => a.id === idProducto)) {
          let index = carts.findIndex((a) => a.id === idProducto);
          const nuevosProductos = [...carts(carts[index].products), idProducto];
          carts[index].products = nuevoProductos;
          const contenidoNuevo = JSON.stringify(carts, null, 2);
          await fs.promises.writeFile(this.filePath, contenidoNuevo);
          return carts;
        } else {
          return "No existe este producto";
        }
      } else {
        return "No existe este carrito";
      }
    } catch (error) {
      return "Error:" + error;
    }
  }

  async deleteCart(idCart) {
    try {
      const carts = await this.getCarts();
      if (carts.some((a) => a.id === idCart)) {
        const cartsNew = carts.filter((cart) => cart.id !== idCart);
        const contenidoNuevo = JSON.stringify(cartsNew, null, 2);
        await fs.promises.writeFile(this.filePath, contenidoNuevo);
        return cartsNew;
      } else {
        return "Este carrito no existe";
      }
    } catch (error) {
      return "Error:" + error;
    }
  }

  async deleteCartProduct(idCart, idProducto) {
    try {
      const carts = await this.getCarts();
      if (carts.some((a) => a.id === idCart)) {
        let index = carts.findIndex((a) => a.id === idCart);
        if (carts.some((a) => a.id === idProducto)) {
          //tomo los productos que ya hay en el carrito
          let products = carts[index].products;
          const contenidoNuevo = products.filter(
            (product) => product !== idProducto
          );
          carts[index].products = contenidoNuevo;
          await fs.promises.writeFile(
            this.filePath,
            JSON.stringify(carts, null, 2)
          );
          //devuelve el carrito con el cual trabajamos ya sin el producto
          return carts[index];
        } else {
          return "El producto que quieres eliminar no se encuentra en el carrito";
        }
      } else {
        return "El carrito en el cual quieres trabajar no existe ";
      }
    } catch (error) {
      return "Error:" + error;
    }
  }
}

module.exports = Carrito;
