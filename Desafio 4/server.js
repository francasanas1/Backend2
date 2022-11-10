// requerimos la clase contenedor
const Contenedor = require("./index.js");
const fs = require("fs");
const { reset } = require("nodemon");
// requerimos express
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const productos = new Contenedor("productos.txt");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/productos", async (req, res) => {
  res.send(await productos.getAll());
});

app.get("/productosRandom", async (req, res) => {
  let long = (await productos.getAll()).length;
  let id = parseInt(Math.random() * long + 1);
  res.send(await contenedorProductos.getById(id));
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
