const socketClient = io();
//const Handlebars = require("handlebars");

//enviar productos a traves de sockets
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    url: document.getElementById("url").value,
  };
  console.log(document.getElementById("title").value);
  console.log(document.getElementById("price").value);
  console.log(document.getElementById("url").value);
  //enviar el producto por medio de socket
  socketClient.emit("newProduct", product);
});

const productsContainer = document.getElementById("productsContainer");

//recibimos los prodcutos y los motramos en una tabla
socketClient.on("productsArray", async (data) => {
  const templateTable = await fetch("./template/table.handlebars");
  //cpnvertimos al formato del template
  const templateFormat = await templateTable.text(); //me pasa a formato texto. es un proceso asincrono
  const template = Handlebars.compile(templateFormat);
  //generamos el html con el template y con los datos de los productos
  const html = template({ products: data });
  productsContainer.innerHTML = html;
});
