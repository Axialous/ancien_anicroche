const express = require('express');
const routeur = express.Router();
const lecture_controleur = require('../controleurs/lecture');


routeur.get('/:clef', lecture_controleur.afficher_un_chapitre);

routeur.post('/:clef/erreurs/indication', lecture_controleur.indiquer_erreur);

routeur.post('/:chapitre/erreurs/:faute/confirmation', lecture_controleur.confirmer_erreur);
routeur.post('/:chapitre/erreurs/:faute/annulation_confirmation', lecture_controleur.annuler_confirmer_erreur);
routeur.post('/:chapitre/erreurs/:faute/infirmation', lecture_controleur.infirmer_erreur);
routeur.post('/:chapitre/erreurs/:faute/annulation_infirmation', lecture_controleur.annuler_infirmer_erreur);


module.exports = routeur;