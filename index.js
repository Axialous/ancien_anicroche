// Import des éléments requis :
const body_parser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const fs = require('fs');

const f = require('./fonctions');



// Déclaration des constantes :
const port = 8007;



// Initialisation de l'application :
const app = express();



// Connexion à la base de données :
mongoose.connect(, // ← Indiquer une base de données avant la virgule
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée ! Vous devez remplir les informations de la base de données.'));



// Chargement du moteur de rendu :
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'pug');



// Configuration de Body Parser
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: false}));



// Liaison des dossiers de ressources
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/polices', express.static(path.join(__dirname, 'polices')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));



// Initialisation de la session :
app.use(session({
    secret: 'thisisasecret',
    saveUninitialized: false,
    resave: false
}));



// Imports des routeurs :
const routes_lecture = require('./routes/lecture');
const routes_gestion = require('./routes/gestion');
const routes_ecriture = require('./routes/ecriture');
const routes_comptes = require('./routes/comptes');
const routes_globales = require('./routes/globales');

// Utilisation des routeurs :
app.use('/lecture', routes_lecture);
app.use('/gestion', routes_gestion);
app.use('/ecriture', routes_ecriture);
app.use('/compte', routes_comptes);
app.use('/', routes_globales)



// Démarrage du serveur :
app.listen(port, () => {
    console.log(`seveur démarré sur le port ${port}`);
})