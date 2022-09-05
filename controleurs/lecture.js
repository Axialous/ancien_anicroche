const Chapitre = require('../modeles/chapitres');
const Faute = require('../modeles/fautes');
const f = require('../fonctions');

exports.afficher_un_chapitre = (requete, reponse) => {
    Chapitre.findOne({
        _id: requete.params.clef
    })
        .then(chapitre => {
                if ((chapitre.publie && chapitre.visibilite == 'tous') 
                    || (requete.session.utilisateur
                        && (
                            (chapitre.visibilite == 'auteurs' && chapitre.auteurs.includes(requete.session.utilisateur.clef))
                        )
                    )
                ) {
                    Faute.find({
                        chapitre: requete.params.clef
                    })
                        .then(fautes => {
                            const page = 'lecture/lecture';
                            var variables = {
                                chapitre: chapitre,
                                fautes: fautes
                            };

                            f.effectuer_rendu(requete, reponse, page, variables);
                        })
                        .catch(() => {
                            requete.session.erreur = "Erreur !";
                            reponse.redirect('/');
                        })
                } else {
                    // Pas visible /!\
                    reponse.redirect('/');
                }
        })
        .catch(() => {
            // Chapitre inexistant /!\
            requete.session.erreur = "Ce chapitre n'existe pas !";
            reponse.redirect('/ecriture');
        })
    const page = 'lecture/lecture';
    var variables = {};
}

exports.indiquer_erreur = (requete, reponse) => {
    Chapitre.findOne({
        _id: requete.params.clef
    })
        .then(chapitre => {
            const faute = new Faute({
                chapitre: requete.params.clef,
                clef_faute: requete.body.clef_faute,
                correction: requete.body.correction ? requete.body.correction : "",
                confirmations: requete.session.utilisateur ? [requete.session.utilisateur.clef] : [],
                infirmations: [],
                date_ajout: new Date()
            });
            faute.save()
                .then(() => {
                    reponse.redirect(`/lecture/${requete.params.clef}`);
                })
                .catch(() => {
                    requete.session.erreur = "Erreur !";
                    reponse.redirect(`/lecture/${requete.params.clef}`);
                })
        })
        .catch(() => {
            requete.session.erreur = "Ce chapitre n'existe pas !";
            reponse.redirect('/');
        })
}

exports.confirmer_erreur = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Faute.findOne({
            _id: requete.params.faute,
            chapitre: requete.params.chapitre
        })
            .then(faute => {
                if (! faute.confirmations.includes(requete.session.utilisateur.clef)) {
                    Faute.updateOne({
                        _id: requete.params.faute,
                        chapitre: requete.params.chapitre
                    }, {
                        $push: {confirmations: requete.session.utilisateur.clef}
                    })
                        .then(() => {
                            reponse.redirect(307, `/lecture/${requete.params.chapitre}/erreurs/${faute._id}/annulation_infirmation`);
                        })
                        .catch(() => {
                            reponse.redirect(`/lecture/${requete.params.chapitre}`);
                        })
                } else {
                    requete.session.erreur = "Vous avez déjà confirmé cette faute !";
                    reponse.redirect(`/lecture/${requete.params.chapitre}`);
                }
            })
            .catch(() => {
                requete.session.erreur = "Cette faute ne correspond pas à cette histoire !";
                reponse.redirect(`/lecture/${requete.params.chapitre}`);
            })
    } else {
        requete.session.erreur = "Vous n'êtes pas connecté !";
        reponse.redirect('/compte/connexion');
    }
}
exports.annuler_confirmer_erreur = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Faute.findOne({
            _id: requete.params.faute,
            chapitre: requete.params.chapitre
        })
            .then(faute => {
                if (faute.confirmations.includes(requete.session.utilisateur.clef)) {
                    Faute.updateOne({
                        _id: requete.params.faute,
                        chapitre: requete.params.chapitre
                    }, {
                        $pull: {confirmations: requete.session.utilisateur.clef}
                    })
                        .then(() => {
                            reponse.redirect(`/lecture/${requete.params.chapitre}`);
                        })
                        .catch(() => {
                            reponse.redirect(`/lecture/${requete.params.chapitre}`);
                        })
                } else {
                    reponse.redirect(`/lecture/${requete.params.chapitre}`);
                }
            })
            .catch(() => {
                requete.session.erreur = "Cette faute ne correspond pas à cette histoire !";
                reponse.redirect(`/lecture/${requete.params.chapitre}`);
            })
    } else {
        requete.session.erreur = "Vous n'êtes pas connecté !";
        reponse.redirect('/compte/connexion');
    }
}
exports.infirmer_erreur = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Faute.findOne({
            _id: requete.params.faute,
            chapitre: requete.params.chapitre
        })
            .then(faute => {
                if (! faute.infirmations.includes(requete.session.utilisateur.clef)) {
                    Faute.updateOne({
                        _id: requete.params.faute,
                        chapitre: requete.params.chapitre
                    }, {
                        $push: {infirmations: requete.session.utilisateur.clef}
                    })
                        .then(() => {
                            reponse.redirect(307, `/lecture/${requete.params.chapitre}/erreurs/${faute._id}/annulation_confirmation`);
                        })
                        .catch(() => {
                            reponse.redirect(`/lecture/${requete.params.chapitre}`);
                        })
                } else {
                    requete.session.erreur = "Vous avez déjà infirmé cette faute !";
                    reponse.redirect(`/lecture/${requete.params.chapitre}`);
                }
            })
            .catch(() => {
                requete.session.erreur = "Cette faute ne correspond pas à cette histoire !";
                reponse.redirect(`/lecture/${requete.params.chapitre}`);
            })
    } else {
        requete.session.erreur = "Vous n'êtes pas connecté !";
        reponse.redirect('/compte/connexion');
    }
}
exports.annuler_infirmer_erreur = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Faute.findOne({
            _id: requete.params.faute,
            chapitre: requete.params.chapitre
        })
            .then(faute => {
                if (faute.infirmations.includes(requete.session.utilisateur.clef)) {
                    Faute.updateOne({
                        _id: requete.params.faute,
                        chapitre: requete.params.chapitre
                    }, {
                        $pull: {infirmations: requete.session.utilisateur.clef}
                    })
                        .then(() => {
                            reponse.redirect(`/lecture/${requete.params.chapitre}`);
                        })
                        .catch(() => {
                            reponse.redirect(`/lecture/${requete.params.chapitre}`);
                        })
                } else {
                    reponse.redirect(`/lecture/${requete.params.chapitre}`);
                }
            })
            .catch(() => {
                requete.session.erreur = "Cette faute ne correspond pas à cette histoire !";
                reponse.redirect(`/lecture/${requete.params.chapitre}`);
            })
    } else {
        requete.session.erreur = "Vous n'êtes pas connecté !";
        reponse.redirect('/compte/connexion');
    }
}