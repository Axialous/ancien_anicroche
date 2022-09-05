const Chapitre = require('../modeles/chapitres');
const f = require('../fonctions');

exports.creation = (requete, reponse) => {
    if (requete.session.utilisateur) {
        const page = 'ecriture/creation';
        var variables = {};

        f.effectuer_rendu(requete, reponse, page, variables);
    } else {
        reponse.redirect('/compte/connexion');
    }
}
exports.creation_chapitre = (requete, reponse) => {
    if (requete.session.utilisateur) {
        const chapitre = new Chapitre({
            titre: requete.body.titre,
            resume: requete.body.resume,
            texte: "§ ",
            visibilite: 'auteurs',
            publie: false,
            auteurs: [requete.session.utilisateur.clef],
            etiquettes: [],
            date_ajout: new Date()
        });
        chapitre.save()
            .then(() => {
                reponse.redirect(`/gestion/${chapitre._id}`)
            })
            .catch(erreur => {
                console.log(erreur);
                reponse.redirect('/ecriture');
            })
    } else {
        reponse.redirect('/compte/connexion');
    }
}

exports.redaction = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.findOne({_id: requete.params.clef})
            .then(chapitre => {
                if (! chapitre.publie) {
                    if (chapitre.auteurs.includes(requete.session.utilisateur.clef)) {
                        const page = 'ecriture/redaction';
                        var variables = {
                            chapitre: chapitre
                        };

                        f.effectuer_rendu(requete, reponse, page, variables);
                    } else {
                        // Pas auteur /!\
                        reponse.redirect('/');
                    }
                } else {
                    // Chapitre déjà publié /!\
                    reponse.redirect(`/lecture/:${clef}`);
                }
            })
            .catch(erreur => {
                // Chapitre inexistant /!\
                requete.session.erreur = "Ce chapitre n'existe pas !";
                reponse.redirect('/ecriture');
            })
        
    } else {
        // Non connecté /!\
        reponse.redirect('/compte/connexion');
    }
}
exports.redaction_chapitre = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.updateOne(
            {
                _id: requete.params.clef,
                auteurs: {$in: requete.session.utilisateur.clef},
                publie: false
            },
            {
                titre: requete.body.titre,
                resume: requete.body.resume,
                texte: requete.body.texte
            }
        )
            .then(reponse => {
                reponse.redirect(`/ecriture/${requete.params.clef}`);
            })
            .catch(erreur => {
                reponse.redirect(`/ecriture/${requete.params.clef}`);
            })
    } else {
        // Non connecté /!\
        reponse.redirect('/compte/connexion');
    }
}