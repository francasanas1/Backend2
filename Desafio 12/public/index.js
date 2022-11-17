const socket = io();

socket.on("connect", () => {
  console.log("quede conectado!");
  //socket.emit("msg", "hola server!");
});

// cuando el servidor me manda un mensaje a mi socket puntualmente
// socket.on("msg", (data) => {
//   console.log(data);
// });

socket.on("msg-list", (data) => {
  console.log("msg-list", data);
  let html = "";
  //transformo el mensaje, email y id en HTML
  data.forEach((obj) => {
    html += `
    <div>
      (${obj.socketid}) ${obj.email} dijo: ${obj.mensaje}
    </div>
    `;
  });
  document.getElementById("div-list-msgs").innerHTML = html;
});

socket.on("cargaProds", (data) => {
  console.log("cargaProds", data);
  let html2 = "";
  data.forEach((obj) => {
    html2 += `
    <div>
      ${obj.nombre}${obj.precio}
    </div>
    `;
  });
  document.getElementById("div-list-products").innerHTML = html2;
});

function cargarProducto() {
  const nombre = document.getElementById("input-nombre").value;
  const precio = document.getElementById("input-precio").value;
  socket.emit("cargaProd", { nombre: nombre, precio: precio });
}

function enviarMsg() {
  const msgParaEnvio = document.getElementById("input-msg").value;
  const email = document.getElementById("input-email").value;
  socket.emit("msg", { email: email, mensaje: msgParaEnvio });
}
