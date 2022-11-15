const router = require("express").Router();

const Contenedor = require("../contenedor");

const contenedorProductos = new Contenedor("productos.txt");

router.get("/productos", async (req, res) => {
  const productos = await contenedorProductos.getAll();
  res.render("products", {
    productos: productos,
  });
  //res.send("Hello world");
});

router.get("/", (req, res) => {
  res.render("form");
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const producto = req.body;
  console.log(producto);
  await contenedorProductos.save(producto);
  res.redirect("/productos");
});

module.exports = router;
