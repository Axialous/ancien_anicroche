const express = require('express');
const routeur = express.Router();
const ecriture_controleur = require('../controleurs/ecriture');


routeur.get('/', ecriture_controleur.creation);
routeur.post('/', ecriture_controleur.creation_chapitre);

routeur.get('/:clef', ecriture_controleur.redaction);
routeur.post('/:clef', ecriture_controleur.redaction_chapitre);


module.exports = routeur;