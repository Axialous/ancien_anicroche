const mongoose = require('mongoose');
const ObectId = mongoose.Schema.Types.ObjectId;

const Schema_chapitres = mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: false
    },
    texte: {
        type: String,
        required: false
    },
    visibilite:{
        type: String,
        required: true
    },
    publie: {
        type: Boolean,
        required: true
    },
    auteurs: {
        type: [{
            type: ObectId,
            ref:"Utilisateur"
        }],
        required: true
    },
    etiquettes: {
        type: [{
            type: String
        }],
        required: false
    },
    date_ajout: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Chapitre', Schema_chapitres);