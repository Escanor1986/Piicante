const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);

// const https = require("https");

// ***********************************

// Création d'un server http de transit aller simple vers le serveur https

// http.createServer((req, res) => {
//   console.log("http server");
//   console.log({
//     host: req.headers.host,
//     url: req.url,
//   });
//   // "301" est une redirection permanente vers le https
//   res.writeHead("301", { Location: `https://${req.headers.host}${req.url}` });
//   res.end();
// }).listen(80);


// // Encryptage ssl avec passage vers https avec clé et certificat de sécurité
// const server = https.createServer(
//   {
//     // on récupère la clé générée avec openssl
//     key: fs.readFileSync(path.join(__dirname, "./ssl/local.key")),
//     // on récupère le certificat généré avec openssl
//     cert: fs.readFileSync(path.join(__dirname, "./ssl/local.crt")),
//   },
//   app
// );

// ATTENTION au fait que chrome ou firefox ne vont pas accepter de certificat signé
// signé par nous même. Dans la logique, il doit être signé par une autorité de
// certification validée. Il faut donc l'ajouter manuellement dans les certificats d'autorité
// et les validés nous mêmes. Dans ce cadre précis, ce serveur ne fonctionnera qu'en local
// et donc en développement, NON en production !
