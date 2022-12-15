const mongoose = require('mongoose');
const express = require('express');
const app = express();

const sauceRoutes = require ('./routes/sauce');
const userRoutes = require ('./routes/user');
const path = require('path');

mongoose.connect('mongodb://cgandon:Openclassrooms,56@ac-nz3e38n-shard-00-00.kbisklk.mongodb.net:27017,ac-nz3e38n-shard-00-01.kbisklk.mongodb.net:27017,ac-nz3e38n-shard-00-02.kbisklk.mongodb.net:27017/?ssl=true&replicaSet=atlas-zpx6l9-shard-0&authSource=admin&retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

 

app.use(express.json());

app.use((req, res, next) => {//Ajout d'un middleware général pour permettre à l'application d'accéder à une API sans problème
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();// passer l'éxécution au middleware d'après
});

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));






module.exports = app;