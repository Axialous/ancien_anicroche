const { Router } = require('express');
const express = require('express');
const routeur = express.Router();
const globales_controleur = require('../controleurs/globales');


routeur.get('/', globales_controleur.accueil);

routeur.get('/*', globales_controleur.erreur_404)


module.exports = routeur;