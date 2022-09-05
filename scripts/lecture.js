noeuds.chapitre = document.querySelector('.chapitre');
const texte_chapitre = noeuds.chapitre.innerHTML;
noeuds.chapitre.innerHTML = decode(noeuds.chapitre.innerHTML);

noeuds.bouton_fermeture = document.getElementById('bouton_fermeture');
noeuds.mots = document.querySelectorAll('.mot');

const fautes = JSON.parse(document.getElementById('temporaire_fautes').innerHTML);
document.getElementById('temporaire_fautes').remove();
const utilisateur = JSON.parse(document.getElementById('temporaire_utilisateur').innerHTML);
document.getElementById('temporaire_utilisateur').remove();

afficher_fautes()

for (let mot of noeuds.mots) {
    mot.addEventListener('click', function(){
        if ((! (mot.innerHTML.indexOf('<del>') >= 0 && mot.innerHTML.indexOf('</del>') >= 0))
            && document.querySelectorAll(`#${mot.id} .bulle`).length == 0) {
            ouvrir_interface_proposition(mot);
        }
    });
}
noeuds.bouton_fermeture.addEventListener('click', function(){fermer_interfaces()})
window.addEventListener('keyup', function(evenement){void (evenement.key == 'Escape' && (fermer_interfaces()))});

function ouvrir_interface_proposition(noeud) {
    fermer_interfaces();
    noeuds.bouton_fermeture.style.display = 'block';

    let interface = document.createElement('form');
    interface.classList.toggle('bulle', true);
    interface.action = `/lecture/${noeuds.chapitre.id}/erreurs/indication`;
    interface.method = 'post';
    interface.innerHTML += `<div class="fleche"></div>
                            <div class="ligne ecartee">
                                <del>${noeud.innerHTML.indexOf('<del>') >= 0 && noeud.innerHTML.indexOf('</del>') >= 0 ? noeud.innerHTML.slice(noeud.innerHTML.indexOf('<del>') + 5, noeud.innerHTML.indexOf('</del>')) : noeud.innerHTML}</del>
                                <ins></ins>
                            </div>
                            <input id="clef_faute_formulaire_faute" name="clef_faute" type="hidden" value="${noeud.id}">
                            <input id="correction_formulaire_faute" name="correction" type="text" placeholder="Correction" oninput="ecrire_proposition()">
                            <button type="submit">Proposer la correction</button>`;

    noeud.appendChild(interface);

    let bulle = document.querySelector('.bulle');
    let fleche = document.querySelector('.bulle .fleche');
    let rem = document.querySelector('html').style.fontSize;
    if (bulle.getBoundingClientRect().left < 0.5 * rem) {
        let decalage = 0 - (bulle.getBoundingClientRect().left);
        bulle.style.left = `calc(calc(50% + ${decalage}px) + 0.5rem)`;
        fleche.style.left = `calc(calc(50% - ${decalage}px) - 0.5rem)`;
    }
    if (window.innerWidth - bulle.getBoundingClientRect().right < 0.5 * rem) {
        let decalage = 0 - (window.innerWidth - bulle.getBoundingClientRect().right);
        bulle.style.left = `calc(calc(50% - ${decalage}px) - 0.5rem)`;
        fleche.style.left = `calc(calc(50% + ${decalage}px) + 0.5rem)`;
    }
}

function fermer_interfaces() {
    noeuds.bouton_fermeture.style.display = 'none';
    document.querySelectorAll(`.bulle`).forEach(noeud => noeud.remove());
}

function ecrire_proposition() {
    document.querySelector('.bulle ins').innerHTML = document.getElementById('correction_formulaire_faute').value;
}

function afficher_fautes() {
    for (faute of fautes) {
        let mot = document.getElementById(faute.clef_faute);
        mot.classList.toggle('faux');
        if (mot.innerHTML.indexOf('<del>') >= 0 && mot.innerHTML.indexOf('</del>') >= 0) {
            mot.innerHTML += `/<ins id="CO_${faute._id}">${faute.correction}</ins>`;
        } else {
            mot.innerHTML = `<del>${mot.innerHTML}</del>→<ins id="CO_${faute._id}">${faute.correction != "" ? faute.correction : '∅'}</ins>`;
            
        }
    }
    if (Object.keys(utilisateur).length > 0) {
        for (let faute of fautes) {
            let mot = document.getElementById(faute.clef_faute);
            document.getElementById(`CO_${faute._id}`).addEventListener('click', function(){
                if (document.querySelectorAll(`#${mot.id} .bulle`).length == 0) {
                    ouvrir_interface_avis(mot, faute);
                }
            })
        }
    }
    let mots_faux = document.querySelectorAll('.faux');
    for (let mot_faux of mots_faux) {
        let erreur_mot = document.querySelector(`#${mot_faux.id} del`)
        erreur_mot.addEventListener('click', function(){
            if (document.querySelectorAll(`#${mot_faux.id} .bulle`).length == 0) {
                ouvrir_interface_proposition(mot_faux);
            }
        })
    }
}

function ouvrir_interface_avis(noeud, proposition) {
    
    fermer_interfaces();
    noeuds.bouton_fermeture.style.display = 'block';

    let interface = document.createElement('form');
    interface.classList.toggle('bulle', true);
    interface.method = 'post';
    let chaine = "";
    chaine += `<div class="fleche"></div>
                            <div class="ligne ecartee">
                                <del>${noeud.innerHTML.indexOf('<del>') >= 0 && noeud.innerHTML.indexOf('</del>') >= 0 ? noeud.innerHTML.slice(noeud.innerHTML.indexOf('<del>') + 5, noeud.innerHTML.indexOf('</del>')) : noeud.innerHTML}</del>
                                <ins>${proposition.correction}</ins>
                            </div>
                            <div class="ligne ecartee">`
    if (proposition.confirmations.includes(utilisateur.clef)) {
        chaine += `<button type="submit" formaction="/lecture/${noeuds.chapitre.id}/erreurs/${proposition._id}/annulation_confirmation">Ne plus confirmer (${proposition.confirmations.length})</button>`
    } else {
        chaine += `<button type="submit" formaction="/lecture/${noeuds.chapitre.id}/erreurs/${proposition._id}/confirmation">Confirmer (${proposition.confirmations.length})</button>`
    }
    if (proposition.infirmations.includes(utilisateur.clef)) {
        chaine += `<button type="submit" formaction="/lecture/${noeuds.chapitre.id}/erreurs/${proposition._id}/annulation_infirmation">Ne plus infirmer (${proposition.infirmations.length})</button>`
    } else {
        chaine += `<button type="submit" formaction="/lecture/${noeuds.chapitre.id}/erreurs/${proposition._id}/infirmation">Infirmer (${proposition.infirmations.length})</button>`
    }               
    chaine += `</div>`;
    interface.innerHTML += chaine;

    noeud.appendChild(interface);

    let bulle = document.querySelector('.bulle');
    let fleche = document.querySelector('.bulle .fleche');
    let rem = document.querySelector('html').style.fontSize;
    if (bulle.getBoundingClientRect().left < 0.5 * rem) {
        let decalage = 0 - (bulle.getBoundingClientRect().left);
        bulle.style.left = `calc(calc(50% + ${decalage}px) + 0.5rem)`;
        fleche.style.left = `calc(calc(50% - ${decalage}px) - 0.5rem)`;
    }
    if (window.innerWidth - bulle.getBoundingClientRect().right < 0.5 * rem) {
        let decalage = 0 - (window.innerWidth - bulle.getBoundingClientRect().right);
        bulle.style.left = `calc(calc(50% - ${decalage}px) - 0.5rem)`;
        fleche.style.left = `calc(calc(50% + ${decalage}px) + 0.5rem)`;
    }
}