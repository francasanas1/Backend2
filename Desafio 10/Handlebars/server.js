const express = require("express");
const Contenedor = require("./contenedor.js");
const handlebars = require("express-handlebars");
const viewRouter = require("./router/views.router.js");
const routerProductos = require("./router/views.router.js");

const contenedorProductos = new Contenedor("productos.txt");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", viewRouter);

//LINEAS DE LOS MOTORES

app.use(express.static(__dirname + `/public`));
// La linea de abajo sirve para que express reconozca que necesita trabajar con un motor
app.engine("handlebars", handlebars.engine());
// Indicamos donde estan las vistar para renderizar
app.set("views", __dirname + "/views");
// Esta linea sirve para conectar las views con el motor
app.set("view engine", "handlebars");

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});

app.use("/productos", routerProductos);
