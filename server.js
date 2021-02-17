const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

async function getServidor() {
  const { data } = await axios.get("https://randomuser.me/api/");

  let randomUser = data.results[0];

  let usuario = {
    id: uuidv4().slice(30),
    correo: randomUser.email,
    nombre: `${randomUser.name.first} ${randomUser.name.last}`,
    pais: randomUser.location.country,
    foto: randomUser.picture.medium,
  };

  console.log(usuario);
  return usuario;
}

module.exports = { getServidor };
