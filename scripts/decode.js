function decode(texte_code) {
    texte_code = texte_code.replace(/\s+/g, '');
    // Définition d'une chaîne HTML vide :
    let texte_html = ""

    let retour;

    // Définition des constantes utiles :
    const ponctuations_necessitant_espace_insecable = [':']
    const ponctuations_necessitant_espace_fine = ['!', '?', '‽', '⸮', '⋮', ';'];
    const ponctuations = ['!', '?', '‽', '⸮', '⋮', ';', ':', ',', '…', '(', ')', '[', ']'];
    const points = ['.', '…', ':', '!', '?', '‽', '⸮', '⋮'];

    // Parcours des sections :
    let texte_tableau = texte_code.split('*').filter(section => section.length > 0);
    for (const i in texte_tableau) {

        // Récupération de l'ID de section :
        retour = recuperation_clef('#SE', texte_tableau[i]);
        let clef_sect = retour[0]
        texte_tableau[i] = retour [1]

        // Ouverture de la section :
        void (i != 0 && (texte_html += `⁂`))
        texte_html += `<section ${clef_sect} class="section">`;

        // Parcours des paragraphes :
        texte_tableau[i] = texte_tableau[i].split('§').filter(paragraphe => paragraphe.length > 0);
        for (const j in texte_tableau[i]) {
            let special_para = [];
            let bonus_para = ""

            // Récupération de l'ID de paragraphe :
            retour = recuperation_clef('#PA', texte_tableau[i][j]);
            let clef_para = retour[0]
            texte_tableau[i][j] = retour [1]

            // Détection d'un dialogue :
            if (texte_tableau[i][j].slice(0, 1) == '-') {
                special_para.push(" dialogue");
                bonus_para += "–&ensp;"
                texte_tableau[i][j] = texte_tableau[i][j].slice(1);
            }

            // Ouverture du paragraphe :
            texte_html += `<p ${clef_para} class="paragraphe${special_para.join('')}">${bonus_para}`;

            // Parcours des phrases :
            texte_tableau[i][j] = texte_tableau[i][j].split('.').filter(phrase => phrase.length > 0);
            for (const k in texte_tableau[i][j]) {
                let special_phra = [];
                let bonus_phra = "";

                // Récupération de l'ID de phrase :
                retour = recuperation_clef('#PH', texte_tableau[i][j][k]);
                let clef_phra = retour[0]
                texte_tableau[i][j][k] = retour [1]

                // Détection des spécificités de la phrase :
                void ((texte_tableau[i][j][k].indexOf('…') >= 0 && ! special_phra.includes(" suspendue")) && special_phra.push(" suspendue"));
                void ((texte_tableau[i][j][k].indexOf('!') >= 0 && ! special_phra.includes(" exclamative")) && special_phra.push(" exclamative"));
                void ((texte_tableau[i][j][k].indexOf('?') >= 0 && ! special_phra.includes(" interrogative")) && special_phra.push(" interrogative"));
                void ((texte_tableau[i][j][k].indexOf('‽') >= 0 && ! special_phra.includes(" exclamative")) && special_phra.push(" exclamative"));
                void ((texte_tableau[i][j][k].indexOf('‽') >= 0 && ! special_phra.includes(" interrogative")) && special_phra.push(" interrogative"));
                void ((texte_tableau[i][j][k].indexOf('⸮') >= 0 && ! special_phra.includes(" ironique")) && special_phra.push(" ironique"));
                void ((texte_tableau[i][j][k].indexOf('⋮') >= 0 && ! special_phra.includes(" depitee")) && special_phra.push(" depitee"));

                // Détection de points de suspension ouvrant :
                if (texte_tableau[i][j][k].slice(0, 1) == '…') {
                    bonus_phra += "… "
                    texte_tableau[i][j][k] = texte_tableau[i][j][k].slice(1)
                }

                // Ouverture de la phrase :
                void (k != 0 && (texte_html += ` `));
                texte_html += `<span ${clef_phra} class="phrase${special_phra.join('')}">${bonus_phra}`;

                // Parcours des mots :
                texte_tableau[i][j][k] = texte_tableau[i][j][k].split('_').filter(mot => mot.length > 0);
                for (const l in texte_tableau[i][j][k]) {
                    let avant_mot = "";
                    let apres_mot = "";

                    // Récupération de l'ID de mot :
                    retour = recuperation_clef('#MO', texte_tableau[i][j][k][l]);
                    let clef_mot = retour[0]
                    texte_tableau[i][j][k][l] = retour [1]

                    // Détections des ponctuations avant le mot :
                    let continuer = true;
                    while (continuer) {
                        continuer = false;
                        if (ponctuations.includes(texte_tableau[i][j][k][l].slice(0, 1))) {
                            avant_mot += texte_tableau[i][j][k][l].slice(0, 1);
                            void (ponctuations_necessitant_espace_insecable.includes(texte_tableau[i][j][k][l].slice(0, 1)) && (avant_mot += '&#160;'));
                            void (ponctuations_necessitant_espace_fine.includes(texte_tableau[i][j][k][l].slice(0, 1)) && (avant_mot += '&#8239;'));
                            texte_tableau[i][j][k][l] = texte_tableau[i][j][k][l].slice(1);
                            continuer = true;
                        } else if (texte_tableau[i][j][k][l].slice(0, 1) == '-') {
                            avant_mot += "–&#160;"
                            texte_tableau[i][j][k][l] = texte_tableau[i][j][k][l].slice(1)
                            continuer = true;
                        } else if (texte_tableau[i][j][k][l].slice(0, 1) == '"') {
                            avant_mot += "«&#160;"
                            texte_tableau[i][j][k][l] = texte_tableau[i][j][k][l].slice(1)
                            continuer = true;
                        }
                    }
                    // Détection des ponctuations après le mot :
                    continuer = true;
                    while (continuer) {
                        continuer = false;
                        if (ponctuations.includes(texte_tableau[i][j][k][l].slice(-1))) {
                            apres_mot = texte_tableau[i][j][k][l].slice(-1) + apres_mot;
                            void (ponctuations_necessitant_espace_insecable.includes(texte_tableau[i][j][k][l].slice(-1)) && (apres_mot = '&#160;' + apres_mot));
                            void (ponctuations_necessitant_espace_fine.includes(texte_tableau[i][j][k][l].slice(-1)) && (apres_mot = '&#8239;' + apres_mot));
                            texte_tableau[i][j][k][l] = texte_tableau[i][j][k][l].slice(0, -1);
                            continuer = true;
                        } else if (texte_tableau[i][j][k][l].slice(-1) == '"') {
                            apres_mot = "&#160;»" + apres_mot;
                            texte_tableau[i][j][k][l] = texte_tableau[i][j][k][l].slice(0, -1);
                            continuer = true;
                        } else if (texte_tableau[i][j][k][l].slice(-1) == '-') {
                            apres_mot = "&#160;–" + apres_mot;
                            texte_tableau[i][j][k][l] = texte_tableau[i][j][k][l].slice(0, -1);
                            continuer = true;
                        }
                    }

                    // Affichage du mot :
                    void (l != 0 && (texte_html += ` `));
                    texte_html += `${avant_mot}<span ${clef_mot} class="mot">${texte_tableau[i][j][k][l]}</span>${apres_mot}`;
                }
                // Fermeture de la phrase :
                texte_html += `${!points.includes(texte_html.slice(-1)) ? '.' : ''}</span>`;
            }
            // Fermeture du paragraphe :
            texte_html += `</p>`;
        }
        // Fermeture de la section :
        texte_html += `</section>`;
    }
    // Retours de la chaîne HTML remplie :
    return texte_html;
}

function recuperation_clef(clef, chaine) {
    clef_part = "";
    if (chaine.lastIndexOf(clef) >= 0) {
        clef_part = `id="${clef.slice(1)}_${chaine.slice(chaine.lastIndexOf(clef) + 3)}"`;
        chaine = chaine.slice(0, chaine.lastIndexOf(clef));
    }
    return [clef_part, chaine];
}