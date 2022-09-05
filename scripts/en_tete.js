noeuds.en_tete = document.getElementById('en-tete');

window.addEventListener('scroll', function(){modifier_affichage_en_tete()});

function modifier_affichage_en_tete() {
    if (window.scrollY > 0) {
        noeuds.en_tete.classList.toggle('reduit', true);
    } else {
        noeuds.en_tete.classList.toggle('reduit', false);
    }
}