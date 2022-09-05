const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema_fautes = mongoose.Schema({
    chapitre: {
        type: ObjectId,
        ref:"Chapitre",
        required: true
    },
    clef_faute: {
        type: String,
        required: true
    },
    correction: {
        type: String,
        required: false
    },
    confirmations: {
        type: [{
            type: ObjectId,
            ref: 'Utilisateur'
        }],
        required: true
    },
    infirmations: {
        type: [{
            type: ObjectId,
            ref: 'Utilisateur'
        }],
        required: true
    },
    date_ajout: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Faute', Schema_fautes);