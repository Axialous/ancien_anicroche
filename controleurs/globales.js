const Chapitre = require('../modeles/chapitres');
const f = require('../fonctions');


exports.accueil = (requete, reponse) => {
    utilisateur = (requete.session.utilisateur ? requete.session.utilisateur.clef : undefined);

    recherches = [];
    if (requete.query.recherche) {
        recherches = requete.query.recherche.split(' ')
        for(i in recherches) {
            recherches[i] = f.toNoAccent(recherches[i]).toUpperCase().replace(/[^0-9a-z]/gi, '');
        }
    }

    recherche = {
        $or: [
            {
                publie: true,
                visibilite: 'tous'
            },
            {
                visibilite: 'auteurs',
                auteurs: {$in: utilisateur}
            }
        ]
    }
    void (recherches.length > 0 && (recherche.etiquettes = {$all: recherches}))
    Chapitre.find(recherche)
        .then(chapitres => {
            const page = 'globales/accueil';
            var variables = {
                chapitres: chapitres
            };

            f.effectuer_rendu(requete, reponse, page, variables);
        })
        .catch(() => {
            reponse.redirect('/compte')
        })
    
}

exports.erreur_404 = (requete, reponse) => {
    const page = 'globales/404';
    var variables = {};

    f.effectuer_rendu(requete, reponse, page, variables);
}