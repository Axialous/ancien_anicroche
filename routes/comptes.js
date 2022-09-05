const express = require('express');
const routeur = express.Router();
const comptes_controleur = require('../controleurs/comptes');


routeur.get('/inscription', comptes_controleur.inscription);
routeur.post('/inscription', comptes_controleur.inscription_utilisateur);

routeur.get('/connexion', comptes_controleur.connexion);
routeur.post('/connexion', comptes_controleur.connexion_utilisateur);

routeur.get('/', comptes_controleur.visualisation_utilisateur);

routeur.get('/preferences', comptes_controleur.preferences);
routeur.post('/preferences', comptes_controleur.preferences_utilisateur);

routeur.get('/deconnexion', comptes_controleur.deconnexion_utilisateur)


module.exports = routeur;