# Piicante - Hot Takes

Piicante est une application web fullstack permettant aux utilisateurs de découvrir, partager et interagir avec différentes recettes de sauces piquantes.

## Fonctionnalités

- **Inscription et Connexion :** Les utilisateurs peuvent créer un compte et se connecter pour accéder à l'ensemble des fonctionnalités de l'application.
- **Gestion des sauces :** Les utilisateurs peuvent ajouter, modifier, supprimer et afficher les détails des sauces piquantes.
- **Gestion des likes :** Les utilisateurs peuvent liker et disliker les sauces des autres utilisateurs.
- **Partage :** Les utilisateurs peuvent partager leurs propres recettes de sauces et découvrir celles des autres.
- **Gestion des images :** Les utilisateurs peuvent télécharger et afficher des images pour illustrer leurs recettes.

## Technologies utilisées

- **Frontend :** TypeScript, Angular, HTML, CSS
- **Backend :** Node.js, Express.js, MongoDB, Mongoose
- **Authentification :** JWT (JSON Web Tokens) pour la gestion des sessions utilisateur
- **Stockage d'images :** AWS S3 ou une autre solution de stockage cloud
- **Outils de développement :** Git, VSCode, Postman

## Installation

1. Cloner le dépôt depuis GitHub : `git clone https://github.com/Escanor1986/Piicante.git`
2. Installer les dépendances du frontend : `cd sauce-piquante-app/frontend && npm install`
3. Installer les dépendances du backend : `cd ../backend && npm install`

## Configuration

1. Créer un fichier `.env` à la racine du dossier backend et ajouter les variables d'environnement nécessaires (par exemple : `PORT`, `MONGODB_URI`, `JWT_SECRET`, etc.)
2. Configurer votre service de stockage cloud pour le téléchargement et le stockage des images de sauces.

## Utilisation

1. Démarrer le serveur backend : `cd backend && npm start`
2. Démarrer l'application frontend : `cd ../frontend && ng serve`
3. Accéder à l'application dans votre navigateur : `http://localhost:4200`

## Contributions

Les contributions sont les bienvenues ! Si vous souhaitez contribuer à l'amélioration de l'application, veuillez suivre ces étapes :

1. Forker le dépôt
2. Créer une nouvelle branche (`git checkout -b feature/Amelioration`)
3. Commiter vos modifications (`git commit -am 'Ajouter une amélioration'`)
4. Pousser votre branche (`git push origin feature/Amelioration`)
5. Créer une nouvelle Pull Request

## Auteurs

- Escanor1986

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
