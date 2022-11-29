const express = require("express");
const Contenedor = require("./contenedor.js");
const Carrito = require("./carrito.js");

const contenedorProductos = new Contenedor("./src/files/productos.txt");
const contenedorCart = new Carrito("./src/files/cart.txt");

const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});

const routerProductos = express.Router();
const routerCarrito = express.Router();

app.use("/api/carrito", routerCarrito);
app.use("/api/productos", routerProductos);
//app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let IsAdmin = true;
//let IsAdmin = false;

const VerifyAdmin = (req, res, next) => {
  if (!IsAdmin) {
    res.status(400).send({
      message: "No eres Admin",
    });
  } else {
    next();
  }
};

//PRODUCTOS

routerProductos.get("/", async (req, res, next) => {
  const productos = await contenedorProductos.getAll();
  res.json(productos);
});

routerProductos.get("/:id", async (req, res) => {
  // parseInt (4afsd)=4
  //req.params.id de la direccion URL extrae el id pedido por el cliente
  let id = parseInt(req.params.id);
  const producto = await contenedorProductos.getById(id);
  res.json(producto);
});

routerProductos.post("/", VerifyAdmin, async (req, res) => {
  const producto = req.body;
  const newProducto = await contenedorProductos.save(producto);
  res.json(newProducto);
});

routerProductos.put("/:id", VerifyAdmin, async (req, res) => {
  let producto = req.body;
  let id = parseInt(req.params.id);
  const changeProduct = await contenedorProductos.change(id, producto);
  res.json(changeProduct);
});

routerProductos.delete("/:id", VerifyAdmin, async (req, res) => {
  let id = parseInt(req.params.id);
  const deletProduct = await contenedorProductos.deleteById(id);
  res.json(deletProduct);
});

//CARRITO

routerCarrito.get("/:id/productos", async (req, res) => {
  const idCart = parseInt(req.params.id);
  const cartProducts = await contenedorCart.getCartProducts(idCart);
  res.json(cartProducts);
});

//buscamos eliminar un carrito
routerCarrito.delete("/:id", async (req, res) => {
  const idCart = parseInt(req.params.id);
  const carts = await contenedorCart.deleteCart(idCart);
  res.json(carts);
});

//buscamos eliminar un producto de un carro especifico
routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
  const idCart = parseInt(req.params.id);
  const idProd = parseInt(req.params.id_prod);
  newCart = await contenedorCart.deleteCartProduct(idCart, idProd);
  res.json(newCart);
});

routerCarrito.post("/:id/productos", async (req, res) => {
  const idCart = parseInt(req.params.id);
  const idProd = parseInt(req.body.id_prod);
  newCart = await contenedorCart.addToCart(idCart, idProd);
  res.json(newCart);
});

routerCarrito.post("/", async (req, res) => {
  const newCart = await contenedorCart.createCart();
  res.json(newCart);
});
