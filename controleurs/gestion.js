const Chapitre = require('../modeles/chapitres');
const f = require('../fonctions');
const fautes = require('../modeles/fautes');

exports.gestion = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.findOne({_id: requete.params.clef})
            .then(chapitre => {
                    if (chapitre.auteurs.includes(requete.session.utilisateur.clef)) {
                        const page = 'gestion/gestion';
                        var variables = {
                            chapitre: chapitre
                        };

                        f.effectuer_rendu(requete, reponse, page, variables);
                    } else {
                        // Pas auteur /!\
                        reponse.redirect('/');
                    }
            })
            .catch(() => {
                // Chapitre inexistant /!\
                requete.session.erreur = "Ce chapitre n'existe pas !";
                reponse.redirect('/ecriture');
            })
        
    } else {
        // Non connecté /!\
        reponse.redirect('/compte/connexion');
    }
}
exports.modification_informations = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.updateOne(
            {
                _id: requete.params.clef,
                auteurs: {$in: requete.session.utilisateur.clef}
            },
            {
                titre: requete.body.titre,
                resume: requete.body.resume,
            }
        )
            .then(() => {
                reponse.redirect(`/gestion/${requete.params.clef}`);
            })
            .catch(() => {
                reponse.redirect(`/gestion/${requete.params.clef}`);
            })
    } else {
        // Non connecté /!\
        reponse.redirect('/compte/connexion');
    }
}

exports.publication_chapitre = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.findOne({_id: requete.params.clef})
            .then(chapitre => {
                Chapitre.updateOne(
                    {
                        _id: requete.params.clef,
                        auteurs: {$in: requete.session.utilisateur.clef},
                        publie: false
                    },
                    {
                        texte : f.ajout_clefs(chapitre.texte),
                        publie: true
                    }
                )
                    .then(() => {
                        reponse.redirect(`/gestion/${requete.params.clef}/visibilite`);
                    })
                    .catch(() => {
                        reponse.redirect(`/gestion/${requete.params.clef}`);
                    })
                })
                .catch(() => {
                    reponse.redirect(`/gestion/${requete.params.clef}`)
                })
    } else {
        // Non connecté /!\
        reponse.redirect('/compte/connexion');
    }
}

exports.visibilite = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.findOne(
            {
                _id: requete.params.clef,
                auteurs: {$in: requete.session.utilisateur.clef}
            }
        )
            .then(chapitre => {
                const page = '/gestion/visibilite';
                var variables = {
                    chapitre: chapitre
                };

                f.effectuer_rendu(requete, reponse, page, variables);
            })
            .catch(() => {
                reponse.redirect(`/gestion/${requete.params.clef}`);
            })
    } else {
        // Non conecté /!\
        reponse.redirect('/compte/connexion');
    }
}
exports.visibilite_chapitre = (requete, reponse) => {
    const visibilites_possibles = ['tous', 'auteurs'];
    if (requete.session.utilisateur) {
        if (visibilites_possibles.includes(requete.body.visibilite)) {
            Chapitre.updateOne(
                {
                    _id: requete.params.clef,
                    auteurs: {$in: requete.session.utilisateur.clef}
                },
                {
                    visibilite: requete.body.visibilite
                }
            )
                .then(() => {
                    reponse.redirect(`/gestion/${requete.params.clef}`);
                })
                .catch(() => {
                    reponse.redirect(`/gestion/${requete.params.clef}`);
                })
            } else {
                // Réponse incorrecte /!\
                requete.session.erreur = "Cette valeur n'est pas valide !";
                reponse.redirect(`/gestion/${requete.params.clef}`);
            }
    } else {
        // Non connecté /!\
        reponse.redirect('/compte/connexion');
    }
}

exports.etiquettes = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.findOne(
            {
                _id: requete.params.clef,
                auteurs: {$in: requete.session.utilisateur.clef}
            }
        )
            .then(chapitre => {
                const page = '/gestion/etiquettes';
                var variables = {
                    chapitre: chapitre
                };

                f.effectuer_rendu(requete, reponse, page, variables);
            })
            .catch(() => {
                reponse.redirect(`/gestion/${requete.params.clef}`);
            })
    } else {
        // Non conecté /!\
        reponse.redirect('/compte/connexion');
    }
}
exports.ajout_etiquette = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.findOne(
            {
                _id: requete.params.clef,
                auteurs: {$in: requete.session.utilisateur.clef}
            }
        )
            .then(chapitre => {
                if (! chapitre.etiquettes.includes(f.toNoAccent(requete.body.etiquette).toUpperCase().replace(/[^0-9a-z]/gi, ''))) {
                    Chapitre.updateOne({
                        _id: requete.params.clef,
                        auteurs: {$in: requete.session.utilisateur.clef}
                    }, {
                        $push: {etiquettes: f.toNoAccent(requete.body.etiquette).toUpperCase().replace(/[^0-9a-z]/gi, '')}
                    })
                        .then(() => {
                            reponse.redirect(`/gestion/${requete.params.clef}/etiquettes`);
                        })
                        .catch(() => {
                            requete.session.erreur = "Erreur !";
                            reponse.redirect(`/gestion/${requete.params.clef}/etiquettes`);
                        })
                }
            })
            .catch(() => {
                reponse.redirect(`/gestion/${requete.params.clef}/etiquettes`);
            })
    } else {
        // Non conecté /!\
        reponse.redirect('/compte/connexion');
    }
}
exports.suppression_etiquette = (requete, reponse) => {
    if (requete.session.utilisateur) {
        Chapitre.findOne(
            {
                _id: requete.params.clef,
                auteurs: {$in: requete.session.utilisateur.clef}
            }
        )
            .then(chapitre => {
                if (chapitre.etiquettes.includes(f.toNoAccent(requete.body.etiquette).toUpperCase().replace(/[^0-9a-z]/gi, ''))) {
                    Chapitre.updateOne({
                        _id: requete.params.clef,
                        auteurs: {$in: requete.session.utilisateur.clef}
                    }, {
                        $pull: {etiquettes: f.toNoAccent(requete.body.etiquette).toUpperCase().replace(/[^0-9a-z]/gi, '')}
                    })
                        .then(() => {
                            reponse.redirect(`/gestion/${requete.params.clef}/etiquettes`);
                        })
                        .catch(() => {
                            requete.session.erreur = "Erreur !";
                            reponse.redirect(`/gestion/${requete.params.clef}/etiquettes`);
                        })
                }
            })
            .catch(() => {
                reponse.redirect(`/gestion/${requete.params.clef}/etiquettes`);
            })
    } else {
        // Non conecté /!\
        reponse.redirect('/compte/connexion');
    }
}

exports.suppression_chapitre =(requete, reponse) => {
    if(requete.session.utilisateur) {
        fautes.deleteMany({
            chapitre: requete.params.clef
        })
            .then(() => {
                Chapitre.deleteOne(
                    {
                        _id: requete.params.clef,
                        auteurs: {$in: requete.session.utilisateur.clef}
                    }
                ).then(() => {
                    reponse.redirect(`/compte`);
                })
                .catch(() => {
                    reponse.redirect(`/gestion/${requete.params.clef}`);
                })
            })
            .catch(() => {
                reponse.redirect(`/gestion/${requete.params.clef}`);
            })
    }
}