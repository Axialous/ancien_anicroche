const path = require('path');
const fs = require('fs');

// Fonctions :

function effectuer_rendu(requete, reponse, page, variables) {
    if (!requete.session.langue) {
        requete.session.langue = process.env.LANG.slice(0, 2);
    }
    variables.erreur = requete.session.erreur;
    requete.session.erreur = undefined;

    let chemin;
    if (fs.existsSync(path.join('pages', requete.session.langue, `${page}.pug`))) {
        chemin = path.join(requete.session.langue, page);
    } else if (fs.existsSync(path.join('pages', 'en', `${page}.pug`))) {
        chemin = path.join('en', page);
    } else {
        chemin = path.join('fr', page);
    }
    variables.session = requete.session;
    reponse.render(chemin, variables);
}

function toNoAccent(a) {
    var b="áàâäãåçéèêëíïîìñóòôöõúùûüýÁÀÂÄÃÅÇÉÈÊËÍÏÎÌÑÓÒÔÖÕÚÙÛÜÝ",
        c="aaaaaaceeeeiiiinooooouuuuyAAAAAACEEEEIIIINOOOOOUUUUY",
        d="";
    for(var i = 0, j = a.length; i < j; i++) {
      var e = a.substring(i, i + 1);
      d += (b.indexOf(e) !== -1) ? c.substring(b.indexOf(e), b.indexOf(e) + 1) : e;
    }
    return d;
}

function ajout_clefs(texte_code) {
    let clef_se = 0;
    let clef_pa = 0;
    let clef_ph = 0;
    let clef_mo = 0;

    // Parcours des sections :
    let texte_tableau = texte_code.split('*').filter(section => section.length > 0);
    for (const se in texte_tableau) {

        // Parcours des paragraphes :
        texte_tableau[se] = texte_tableau[se].split('§').filter(paragraphe => paragraphe.length > 0);
        for (const pa in texte_tableau[se]) {

            // Parcours des phrases :
            texte_tableau[se][pa] = texte_tableau[se][pa].split('.').filter(phrase => phrase.length > 0);
            for (const ph in texte_tableau[se][pa]) {

                // Parcours des mots :
                texte_tableau[se][pa][ph] = texte_tableau[se][pa][ph].split('_').filter(mot => mot.length > 0);
                for (const mo in texte_tableau[se][pa][ph]) {
                    
                    void (texte_tableau[se][pa][ph][mo].replace(/\s+/g, '') != "" && (texte_tableau[se][pa][ph][mo] += `#MO${clef_mo++}`));
                }
                texte_tableau[se][pa][ph] = texte_tableau[se][pa][ph].join('_');

                void (texte_tableau[se][pa][ph].replace(/\s+/g, '') != "" && (texte_tableau[se][pa][ph] += `#PH${clef_ph++}`));
            }
            texte_tableau[se][pa] = texte_tableau[se][pa].join('.');

            void (texte_tableau[se][pa].replace(/\s+/g, '') != "" && (texte_tableau[se][pa] += `#PA${clef_pa++}`));
        }
        texte_tableau[se] = texte_tableau[se].join('§');

        void (texte_tableau[se].replace(/\s+/g, '') != "" && (texte_tableau[se] += `#SE${clef_se++}`));
    }
    texte_code = texte_tableau.join('*');

    return texte_code;
}

module.exports = {
    effectuer_rendu,
    toNoAccent,
    ajout_clefs
}