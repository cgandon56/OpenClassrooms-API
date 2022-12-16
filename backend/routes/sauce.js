const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require ('../middleware/multer-config')


const sauceCtrl = require('../controllers/sauce');


//Route pour créer une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
  
  // Route pour Trouver un objet par son identifiant
router.get('/:id', auth, sauceCtrl.getOneSauce); 
  
  // Route pour récupérer une liste d'articles en vente
router.get('/', auth, sauceCtrl.getAllSauces);
  
  //Route pour modifier un objet existant
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
  
  //Route pour supprimer un objet
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//Route pour ajouter un like
router.post('/:id/like', auth, sauceCtrl.addlikedislike); 

module.exports = router;