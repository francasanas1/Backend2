const express = require("express");
const app = express();
const PORT = process.env.PORT || 7000;

const Contenedor = require("./contenedor.js");
const contenedor = new Contenedor("./productos.txt");
const ContenedorMsj = require("./contenedor.js");
const contenedorMsj = new ContenedorMsj("./mensajes.txt");

//IMPLEMENTACION
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(PORT, () =>
  console.log("SERVER ON http://localhost:" + PORT)
);
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let msgs = [];
let products = [];
//leer el archivo y cargar los msgs

// io.on es una funcion que corre cada vez que el cliente se conecta a nuestro servidor
io.on("connection", (socket) => {
  //socket.emit("msg", "hola front!");
  const fecha = new Date().toUTCString();
  // cada vez que un socket me mande un msg desde el front, pasa lo siguiente..
  socket.on("msg", (data) => {
    console.log("data", data);
    msgs.push({
      socketid: socket.id,
      email: data.email,
      mensaje: data.mensaje,
      fecha: fecha,
    });
    contenedorMsj.save(msgs);
    // Despues de pushear el mensaje, se lo mando a todos los sockets
    io.sockets.emit("msg-list", msgs);
  });
});

io.on("connection", (socket) => {
  socket.on("cargaProd", (data) => {
    console.log("data", data);
    products.push({
      nombre: data.nombre,
      precio: data.precio,
    });
    contenedor.save(products);

    io.sockets.emit("cargaProds", products);
  });
});
