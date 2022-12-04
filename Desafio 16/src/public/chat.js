const socketChat = io();

const chatContainer = document.getElementById("chatContainer");

//const Swal = require("sweetalert2");
//const Handlebars = require("handlebars");

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

let mail = "";
Swal.fire({
  title: "Bienvenido",
  text: "Ingresa el mail del usaurio",
  input: "text",
  allowOutsideClick: false,
}).then((response) => {
  console.log(response);
  mail = response.value;
  document.getElementById("mail").innerHTML = ` Usuario: ${mail}`;
});

//recibimos los mensajes y los mostramos
socketChat.on("messagesChat", async (data) => {
  console.log(data);
  const templateChat = await fetch("./template/chat.handlebars");

  //cpnvertimos al formato del template
  const templateFormat = await templateChat.text(); //me pasa a formato texto. es un proceso asincrono
  console.log(templateFormat);
  const template = Handlebars.compile(templateFormat);
  console.log(template);
  //generamos el html con el template y con los datos de los productos
  const html = template({ messages: data });
  chatContainer.innerHTML = html;
});

const chatForm = document.getElementById("chatForm");
chatForm.addEventListener("submit", (event) => {
  //prevenir que se recargue cuando se envie el formulario
  event.preventDefault();
  console.log("formulario enviado");
  const f = new Date();
  const message = {
    mail: mail,
    time:
      f.getDate() +
      "/" +
      (f.getMonth() + 1) +
      "/" +
      f.getFullYear() +
      " " +
      f.getHours() +
      ":" +
      f.getMinutes() +
      ":" +
      f.getSeconds(),
    text: document.getElementById("messageChat").value,
  };
  socketChat.emit("newMsg", message);
});
