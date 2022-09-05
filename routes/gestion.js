const express = require('express');
const routeur = express.Router();
const gestion_controleur = require('../controleurs/gestion');


routeur.get('/:clef', gestion_controleur.gestion);
routeur.post('/:clef', gestion_controleur.modification_informations);

routeur.get('/:clef/publication', gestion_controleur.publication_chapitre);

routeur.get('/:clef/visibilite', gestion_controleur.visibilite);
routeur.post('/:clef/visibilite', gestion_controleur.visibilite_chapitre);

routeur.get('/:clef/etiquettes', gestion_controleur.etiquettes);
routeur.post('/:clef/etiquettes/ajout', gestion_controleur.ajout_etiquette);
routeur.post('/:clef/etiquettes/suppression', gestion_controleur.suppression_etiquette);

routeur.get('/:clef/suppression', gestion_controleur.suppression_chapitre);


module.exports = routeur;