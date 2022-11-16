const express = require("express");
const app = express();
const PORT = 8080;
const Contenedor = require("./contenedor.js");
const contenedorProductos = new Contenedor("productos.txt");

const server = app.listen(PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto http://localhost:${
      server.address().port
    }`
  );
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Lineas para instalar PUG
app.set("view engine", "pug");
// aclaro que todas mis views estan dentro de la carpeta /views para cuando tenga que renderizar no haga falta aclarar la ubicacion de mi carpeta
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("form.pug");
});

app.get("/productos", (req, res) => {
  res.render("products.pug");
});

app.post("/", async (req, res, next) => {
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
