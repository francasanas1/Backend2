const express = require("express");
const Contenedor = require("./contenedor.js");
const Messages = require("./messages.js");
const Handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const Swal = require("sweetalert2");

const contenedorProductos = new Contenedor("productos.txt");
const contenedorMessages = new Messages("messages.txt");
const app = express();
const puerto = 8080;

const server = app.listen(8080, () =>
  console.log("server listening on port 8080")
);
const io = new Server(server);

app.engine("handlebars", Handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + `/public`));

//IMPLEMENTACION
// const httpServer = require("http").createServer(app);
// const io = require("socket.io")(httpServer);

app.get("/", (req, res) => {
  res.render("form");
});

app.get("/productos", async (req, res) => {
  const productos = await contenedorProductos.getAll();
  res.render("products", {
    productos: productos,
  });
});

app.post("/productos", async (req, res) => {
  const producto = req.body;
  await contenedorProductos.save(producto);
  res.redirect("/");
});

io.on("connection", async (socket) => {
  io.sockets.emit("messagesChat", await contenedorMessages.allMessages());
  socket.on("newMsg", async (data) => {
    //enviamos los msg a todos los sockets conectados
    io.sockets.emit("messagesChat", await contenedorMessages.newMessage(data));
  });
});

io.on("connection", async (socket) => {
  io.sockets.emit("productsArray", await contenedorProductos.getAll());

  //recibir el producto
  socket.on("newProduct", async (data) => {
    //data es ek producto que recibo del formulario
    await contenedorProductos.save(data);
    //enviar todos los productos actualizados

    io.sockets.emit("productsArray", await contenedorProductos.getAll());
  });
});

// // io.on es una funcion que corre cada vez que el cliente se conecta a nuestro servidor
// io.on("connection", (socket) => {
//   //socket.emit("msg", "hola front!");
//   const fecha = new Date().toUTCString();
//   // cada vez que un socket me mande un msg desde el front, pasa lo siguiente..
//   socket.on("msg", (data) => {
//     console.log("data", data);
//     msgs.push({
//       socketid: socket.id,
//       email: data.email,
//       mensaje: data.mensaje,
//       fecha: fecha,
//     });
//     contenedorMsj.save(msgs);
//     // Despues de pushear el mensaje, se lo mando a todos los sockets
//     io.sockets.emit("msg-list", msgs);
//   });
// });
