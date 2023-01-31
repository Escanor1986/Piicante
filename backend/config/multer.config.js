// ***********************************************************************************************************************************************

// La librairie multer a été développée par l'équipe d'Express, c'est une librairie robuste et bien maintenue.
// Elle sert spécifiquement à gérer le format multipart/form-data avec Express.
// Comme les autres midlleware servant à parser les body des requêtes (par exemple body-parser),
// multer va également parser les body des messages multipart et placer le résultat sur l'objet Request.
const multer = require("multer");
// SANS MULTER, le format par défaut du body de la requête post envoyé en cliquant sur le
// lien sera encodé en "application/x-www-form-urlencoded" (encodage sous forme de paire: clé/valeur, idéal pour les informations textuelles)
// cette encodage SANS MULTER NE PERMET PAS DE RéCUPéRER LES FICHIERS !!!
// (cfr "content-type"(type d'encodage) dans le "headers") - on va donc passé au format d'encodage "multipart/form-data" avec MULTER

// ***********************************************************************************************************************************************

// Confer https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/bmp": "bmp",
  "image/gif": "gif",
  "image/webp": "webp",
};

// L'option storage permet de paraméter le stockage soit sur le disque en utilisant la méthode diskStorage, soit en mémoire avec memoryStorage
const storage = multer.diskStorage({
  // diskStorage ne prend QUE "destination" et "filename" comme méthodes !!!
  destination: (req, file, callback) => {
    // destination peut prendre une chaîne de caractères ou une fonction qui va déterminer
    // dynamiquement dans quel dossier les fichiers vont être sauvegardés.
    callback(null, "images");
    // on set l'erreur à nul et on défini le dossier de destination pour l'upload
  },
  // filename est la fonction qui va déterminer dynamiquement le nom des fichiers téléchargés sur le serveur.
  // Si filename n'est pas définie, un nom aléatoire et unique sera attribué par multer
  // multer n'ajoutera pas l'extension automatiquement pour nous, nous devons la spécifier nous même dans la fonction.
  filename: (req, file, callback) => {
    // on transforme le nom d'origine du fichier en remplçant les espaces par underscore
    const name = file.originalname.split(" ").join("_");
    // Création d'une extension de fichiers correspond aux mimeType prédéfini
    const extension = MIME_TYPES[file.mimetype];
    // déterminantion de la structure finale du nom de fichier uploader  (nom + date + "." + extension)
    callback(null, name + Date.now() + "." + extension);
  },
});
//on invoque une nouvelle fonction avec multer pour paramètrer l'upload de fichiers images
const upload = multer({
  // on limite la taille des fichiers pour l'uppload à 1 MO !
  limits: { fileSize: 1 * 1000 * 1000 },
  // ici on exclus le téléchargement de fichier au format PDF avec la fonction "fileFilter"
  fileFilter: (req, file, callback) => {
    console.log(file);
    if (file.mimetype !== "application/pdf") {
      return callback(null, false);
    } else {
      callback(null, true);
    }
  },});
  
module.exports = multer({ storage, upload }).single("image");

// Attention ! Lorsque destination est une fonction et non une chaîne de caractères,
// il faut que les dossiers existent avant de pouvoir y stocker des fichiers.
// Si on utilise une chaîne de caractères, multer créera les dossiers pour nous.
