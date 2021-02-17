const http = require("http");
const fs = require("fs");
const enviar = require("./nodemailer");
const { getServidor } = require("./server");



const servidor = http
  .createServer(async (req, res) => {
    const { usuarios } = JSON.parse(fs.readFileSync("usuarios.json", "utf8"));

    if (req.url == "/" && req.method == "GET") {
      res.writeHeader(200, "content-type", "text/html");
      const data = fs.readFileSync("index.html", "utf8");
      res.end(data);
    }

    if (req.url.startsWith("/usuario") && req.method == "POST") {
      let guardarUsuario = await getServidor();
      usuarios.push(guardarUsuario);
      fs.writeFileSync("usuarios.json", JSON.stringify({ usuarios }));
      res.end(JSON.stringify({ usuarios }));
    }

    if (req.url == "/usuarios" && req.method == "GET") {
      res.end(JSON.stringify({ usuarios }));
    }

    if (req.url == "/premio" && req.method == "GET") {
      const premio = fs.readFileSync("premio.json", "utf8");
      res.end(premio);
    }

    if (req.url == "/premio" && req.method == "PUT") {
      let premio;
      req.on("data", (payload) => {
        premio = JSON.parse(payload);
      });

      req.on("end", () => {
        fs.writeFileSync("premio.json", JSON.stringify(premio));
        res.end("Premio");
      });
    }

    if (req.url == "/ganador" && req.method == "GET") {
      const ganador = Math.floor(Math.random() * usuarios.length);
      const posicionGanador = usuarios[ganador];
      const texto = `El ganador del concurso fue ${posicionGanador.nombre}, gracias por participar`;
      const mail = usuarios.forEach((e) => {
        return e.correo;
      });
      const titulo = "tenemos el gran ganador";
      await enviar(mail, titulo, texto);
      res.end(JSON.stringify(posicionGanador));
    }
  })
  .listen(3000);
