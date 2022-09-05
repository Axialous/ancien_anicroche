const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const Schema_utilisateurs = mongoose.Schema({
    pseudonyme: {type: String, required: true},
    adresse_mail: {type: String, required: true, unique: true},
    mot_de_passe: {type: String, required: true},
    preferences: {type: Object, required:false},
    date_ajout: {type: Date, required: true}
});

Schema_utilisateurs.plugin(uniqueValidator);

module.exports = mongoose.model('Utilisateur', Schema_utilisateurs);