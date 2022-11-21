const express = require("express");
const Contenedor = require("./contenedor.js");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + `public`));

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const contenedorProductos = new Contenedor("productos.txt");

app.get("/", (req, res) => {
  res.render("form");
});

app.get("/productos", async (req, res) => {
  const productos = await contenedorProductos.getAll();
  res.render("productos", {
    productos: await contenedorProductos.getAll(),
  });
});

app.post("/productos", async (req, res, next) => {
  let producto = req.body;
  console.log(producto);

  if (!producto) {
    const error = new Error("Archivo vacio");
    error.httpStatusCode = 400;
    return next(error);
  }
  await contenedorProductos.save(producto);
  res.redirect("/productos");
});
