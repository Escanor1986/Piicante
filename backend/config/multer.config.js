const multer = require("multer");

// Un objet qui contient les types MIME des images acceptées par l'application et leurs extensions associées
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/bmp": "bmp",
  "image/gif": "gif",
  "image/webp": "webp",
};

// Configuration du stockage des fichiers téléchargés avec Multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Définition du nom de fichier pour les fichiers téléchargés
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    // Récupération de l'extension de fichier appropriée à partir du type MIME du fichier téléchargé
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
