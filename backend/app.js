const path = require("path");
const express = require('express');
const app = express();
const morgan = require('morgan');
const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: false });
const api = express.Router(); // mini api express avec le système de routing uniquement
const index = express.Router();
// app.use(express.static(path.join(__dirname, 'selected-forlder')));
app.use(express.json());
// app.use(express.urlencoded({ extended: true}));
app.use(morgan('tiny'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Routes

app.route('/api/auth', (req, res, next) => { next()})
  .post('/signup', (req, res) => {
    res.send('api');
  })
  .post('/login', (req, res) => {
    res.send('api');
  });

app.route('/api/sauces', (req, res, next) => { next()})
  .get((req, res) => {
    res.send('api');
  })
  .get('/:id', (req, res) => {
    res.send('api');
  })
  .post(, (req, res) => {
    res.send('api');
  })
  .put('/:id', (req, res) => {
    res.send('api');
  })
  .delete('/:id', (req, res) => {
    res.send('api');
  })
  .post('/:id/like', (req, res) => {
    res.send('api');
  });


// Middleware

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});

module.exports = app;

