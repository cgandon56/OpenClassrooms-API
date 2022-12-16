const fs = require('fs');
const Sauce = require('../models/Sauce')


//Logiques pour chaque fonction
//Recevoir et enregistrer les objets de front-end
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
    .then(() =>{res.status(201).json({message: 'Objet enregistré'})})
    .catch(error => {res.status(400).json({error})})
  };

  //Modifier une sauce
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})//Vérifier si c'est bien l'utlisateur qui cherche à le modifier
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non autorisé'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})//Mettre à jour 
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Non autorisé'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {res.status(500).json({ error });});
};




// Récupérer une liste de sauces
  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };

  //Récupérer une sauce
  exports.getOneSauce = (req, res, next) => {// cette partie de la route est dynamique
    Sauce.findOne({ _id:req.params.id})
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(404).json({error}));
  };




  // Ajouter un like ou dislike
//  Si like = 1, l'utilisateur aime (= like) la sauce. Si like = 0, l'utilisateur annule son like ou son dislike. Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce

exports.addlikedislike = (req, res, next) => {
  // Si like = 1, l'utilisateur aime (= like) la sauce
  if (req.body.like === 1) { 
    Sauce.updateOne({ _id: req.params.id }, {
       $inc: { likes: (req.body.like++) }, 
       $push: { usersLiked: req.body.userId } 
      })
      .then(() => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) { 
    // Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce
    Sauce.updateOne({ _id: req.params.id }, { 
      $inc: { dislikes: (req.body.like++) *  -1 }, 
      $push: { usersDisliked: req.body.userId } 
    }) 
      .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else { 
    // Si like === 0 l'utilisateur supprime son vote
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) { 
          Sauce.updateOne({ _id: req.params.id }, { 
            $pull: { usersLiked: req.body.userId }, 
            $inc: { likes: -1 } })
              .then(() => { res.status(200).json({ message: 'Like supprimé !' }) 
            })
              .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { 
              $pull: { usersDisliked: req.body.userId }, 
              $inc: { dislikes: -1 } 
            })
              .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
              .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
};


