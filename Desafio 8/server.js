const express = require("express");
const { Router } = express;
const multer = require("multer");
const app = express();
const routerDeProductos = Router();
const port = process.env.PORT || 8080;

const Contenedor = require("./index.js");
const containerProducts = new Contenedor("productos.txt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", routerDeProductos);
app.use("/public", express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

routerDeProductos.get("/", (req, res) => {
  res.json(containerProducts.getAll());
});

routerDeProductos.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json(containerProducts.getById(id));
});

// save = Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.

routerDeProductos.post("/", async (req, res, next) => {
  let producto = req.body;
  console.log(producto);
  if (!producto) {
    const error = new Error("Archivo vacio");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.json(await containerProducts.save(producto));
});

routerDeProductos.put("/:id", async (req, res, next) => {
  let producto = req.body;
  let id = parseInt(req.params.id);
  res.json(await containerProducts.modifyElement(id, producto));
});

routerDeProductos.delete("/:id", async (req, res, next) => {
  let id = parseInt(req.params.id);
  console.log(id);
  res.json(await contenedorProductos.deleteById(id));
});
