const Utilisateur = require('../modeles/utilisateurs');
const Chapitre = require('../modeles/chapitres');
const bcrypt = require('bcrypt');
const f = require('../fonctions');


exports.inscription = (requete, reponse) => {
    const page = 'compte/inscription';
    var variables = {};

    f.effectuer_rendu(requete, reponse, page, variables);
}
exports.inscription_utilisateur = (requete, reponse) => {
    if (requete.body.mot_de_passe == requete.body.confirmation_mot_de_passe) {
        bcrypt.hash(requete.body.mot_de_passe, 10)
            .then(hash => {
                const utilisateur = new Utilisateur({
                    pseudonyme: requete.body.pseudonyme,
                    adresse_mail: requete.body.adresse_mail,
                    mot_de_passe: hash,
                    preferences: {},
                    date_ajout: new Date()
                });
                utilisateur.save()
                    .then(() => {
                        requete.session.utilisateur = {
                            clef: utilisateur._id,
                            pseudonyme: utilisateur.pseudonyme,
                            adresse_mail: utilisateur.adresse_mail,
                            date_ajout: utilisateur.date_ajout
                        }
                        reponse.redirect('/compte')
                    })
                    .catch(erreur => {
                        console.log(erreur);
                        reponse.redirect('/compte/inscription');
                    })
            })
            .catch(erreur => {
                console.log(erreur);
                reponse.redirect('/compte/inscription');
            })
    } else {
        requete.session.erreur = "Vous devez renseigner deux fois le même mot de passe !";
        reponse.redirect('/compte/inscription');
    }
}

exports.connexion = (requete, reponse) => {
    const page = 'compte/connexion';
    var variables = {};

    f.effectuer_rendu(requete, reponse, page, variables);
}
exports.connexion_utilisateur = (requete, reponse) => {
    Utilisateur.findOne({adresse_mail: requete.body.adresse_mail})
        .then(utilisateur => {
            if(utilisateur === null) {
                requete.session.erreur = "Identifiants invalides !";
                reponse.redirect('/compte/connexion');
            } else {
                bcrypt.compare(requete.body.mot_de_passe, utilisateur.mot_de_passe)
                    .then(valide => {
                        if (!valide) {
                            requete.session.erreur = "Identifiants invalides !";
                            reponse.redirect('/compte/connexion');
                        } else {
                            requete.session.utilisateur = {
                                clef: utilisateur._id,
                                pseudonyme: utilisateur.pseudonyme,
                                adresse_mail: utilisateur.adresse_mail,
                                date_ajout: utilisateur.date_ajout
                            };
                            reponse.redirect('/compte');
                        }
                    })
                    .catch(erreur => {
                        reponse.redirect('/compte/connexion');
                    })
            }
        })
        .catch(erreur => {
            reponse.redirect('/compte/connexion');
        })
}

exports.visualisation_utilisateur = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.find({auteurs: {$in: requete.session.utilisateur.clef}})
            .then(chapitres => {
                const page = 'compte/compte';
                var variables = {
                    chapitres: chapitres
                };
                
                f.effectuer_rendu(requete, reponse, page, variables);
            })
            .catch(erreur => {
                reponse.redirect('/');
            })
    } else {
        reponse.redirect('/compte/connexion');
    }
}

exports.preferences = (requete, reponse) => {
    if (requete.session.utilisateur) {
        const page = 'compte/preferences';
        var variables = {};
        f.effectuer_rendu(requete, reponse, page, variables);
    } else {
        reponse.redirect('/compte/connexion');
    }
}
exports.preferences_utilisateur = (requete, reponse) => {
    if (requete.session.utilisateur) {
        requete.session.langue = requete.body.langue;
        reponse.redirect('/compte/');
    } else {
        reponse.redirect('/compte/connexion');
    }
}

exports.deconnexion_utilisateur = (requete, reponse) => {
    delete requete.session.utilisateur;
    reponse.redirect('/');
}