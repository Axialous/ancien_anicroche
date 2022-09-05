noeuds.input_titre = document.getElementById('titre_redaction');
noeuds.input_resume = document.getElementById('resume_redaction');
noeuds.input_texte = document.getElementById('texte_redaction');
noeuds.affichage_texte = document.getElementById('affichage_texte_redaction');

noeuds.input_resume.addEventListener('input', function(){actualiser_resume()});
noeuds.input_texte.addEventListener('input', function(evenement){actualiser_texte(evenement)});

actualiser_resume();
actualiser_texte();

function actualiser_resume() {
    noeuds.input_resume.style.height = 'auto';
    noeuds.input_resume.style.height = `${noeuds.input_resume.scrollHeight}px`;
}

function actualiser_texte(evenement) {
    void(evenement && aider_saisie(evenement));

    noeuds.input_texte.style.height = 'auto';
    noeuds.input_texte.style.height = `${noeuds.input_texte.scrollHeight}px`;

    noeuds.affichage_texte.innerHTML = decode(noeuds.input_texte.value);
}

function aider_saisie(evenement) {
    const separateurs = ['*', '§', '.', '_', '-'];

    let texte = noeuds.input_texte.value;
    let curseur = noeuds.input_texte.selectionStart;
    let decalage_curseur = 0;

    switch (evenement.inputType) {
        case 'insertLineBreak' :
            if (texte == "\n") {
                texte = "§ ";
                decalage_curseur += 1;
            } else if (texte.slice(curseur - 2, curseur - 1) == '§') {
                texte = texte.slice(0, curseur - 2) + (texte.slice(curseur, curseur + 2) == '\n§' ? '\n*\n' : '\n*\n\n§ ') + texte.slice(curseur);
                decalage_curseur += 4;
            } else if (texte.slice(curseur - 3, curseur - 1) == '§ ') {
                texte = texte.slice(0, curseur - 3) + (texte.slice(curseur, curseur + 2) == '\n§' ? '\n*\n' : '\n*\n\n§ ') + texte.slice(curseur);
                decalage_curseur += 3;
            } else if (texte.slice(curseur, curseur +1) == '§') {
                texte = texte.slice(0, curseur - 1) + '§ ' + texte.slice(curseur - 1);
                decalage_curseur += 1;
            } else {
                texte = texte.slice(0, curseur) + '§ ' + texte.slice(curseur);
                decalage_curseur += 2;
            }
            break;
        case 'insertText' :
            switch (evenement.data) {
                case ' ' :
                    if (texte == " ") {
                        texte = "§ ";
                        decalage_curseur += 1;
                    } else if (texte.slice(curseur - 2, curseur) == '- ' && texte.slice(curseur - 3, curseur - 2) != ' ') {
                        texte = texte.slice(0, curseur - 2) + ' -_' + texte.slice(curseur);
                        decalage_curseur += 1;
                    } else if (! separateurs.includes(texte.slice(curseur - 2, curseur - 1))) {
                        texte = texte.slice(0, curseur - 1) + '_' + texte.slice(curseur);
                    }
                    break;
                case '.' :
                    if (texte.slice(curseur - 3, curseur) == '...') {
                        texte = texte.slice(0, curseur - 3) + (! separateurs.includes(texte.slice(curseur - 5, curseur - 4)) ? '….' : '… ') + texte.slice(curseur);
                        decalage_curseur -= 1;
                    }
                    break;
                case ',' :
                    if (texte.slice(curseur - 2, curseur) == '_,') {
                        texte = texte.slice(0, curseur - 2) + ',_' + texte.slice(curseur);
                    }
                    break;
                case ':' :
                case ';' :
                    texte = texte.slice(0, curseur - 1) + ` ${evenement.data}` + texte.slice(curseur);
                    decalage_curseur += 1;
                    break;
                case '!' :
                case '?' :
                case '‽' :
                case '⸮' :
                case '⋮' :
                    texte = texte.slice(0, curseur - 1) + ` ${evenement.data}.` + texte.slice(curseur);
                    decalage_curseur += 2;
                    break;
                case '-' :
                    if (texte.slice(curseur - 2, curseur) == '§-') {
                        texte = texte.slice(0, curseur - 1) + ' -' + texte.slice(curseur);
                        decalage_curseur += 1;
                    } else if (texte.slice(curseur - 2, curseur) == '_-') {
                        texte = texte.slice(0, curseur) + ' ' + texte.slice(curseur);
                        decalage_curseur += 1;
                    }
                    break;
                default :
                    const points_dialogues = ['!', '?', '‽', '⸮', '⋮'];
                    if (points_dialogues.includes(texte.slice(curseur - 3, curseur - 2)) && texte.slice(curseur - 2, curseur - 1) == '.') {
                        texte = texte.slice(0, curseur - 2) + '_' + texte.slice(curseur - 1, curseur).toLowerCase() + texte.slice(curseur);
                    }
            }
            break;
    }
    noeuds.input_texte.value = texte;
    noeuds.input_texte.selectionStart = curseur + decalage_curseur;
    noeuds.input_texte.selectionEnd = curseur + decalage_curseur;
}