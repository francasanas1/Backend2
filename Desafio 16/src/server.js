const express = require("express");
const Handlebars = require("express-handlebars");
const { options } = require("./options/dataBaseConfig.js");
const { ContenedorSQL } = require("./src/contenedorSQL");
const PORT = process.env.PORT || 8080;

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const productosApi = new ContenedorSQL(options.MySQL, "productos");
const chatApi = new ContenedorSQL(options.SQLite, "chat");

const app = express();
const router = express.Router();

const server = app.listen(8080, () =>
  console.log("server listening on port 8080")
);

app.engine("handlebars", Handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + `/public`));

app.get("/", (req, res) => {
  res.render("home");
});

router.get("/", async (req, res) => {
  res.render("products", { products: await productosApi.getAll() });
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  const product = await productosApi.getById(parseInt(productId));
  console.log(product);
  return res.json(product);
});

router.post("/", async (req, res) => {
  const newProduct = req.body;
  const result = await productosApi.save(newProduct);
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const cambioObj = req.body;
  const productId = req.params.id;
  const result = await productosApi.updateById(parseInt(productId), cambioObj);
  res.json(result);
});

router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  const result = await productosApi.deleteById(parseInt(productId));
  res.json(result);
});

router.delete("/", async (req, res) => {
  const result = await productosApi.deleteAll();
  res.json(result);
});

app.use("/api/productos", router);

//configuracion websocket
io.on("connection", async (socket) => {
  //PRODUCTOS
  //envio de los productos al socket que se conecta.
  io.sockets.emit("products", await productosApi.getAll());

  //recibimos el producto nuevo del cliente y lo guardamos con filesystem
  socket.on("newProduct", async (data) => {
    await productosApi.save(data);
    //despues de guardar un nuevo producto, enviamos el listado de productos actualizado a todos los sockets conectados
    io.sockets.emit("products", await productosApi.getAll());
  });

  //CHAT
  //Envio de todos los mensajes al socket que se conecta.
  io.sockets.emit("messages", await chatApi.getAll());

  //recibimos el mensaje del usuario y lo guardamos en el archivo chat.txt
  socket.on("newMessage", async (newMsg) => {
    await chatApi.save(newMsg);
    io.sockets.emit("messages", await chatApi.getAll());
  });
});
