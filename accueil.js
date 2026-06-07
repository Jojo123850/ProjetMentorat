const profil = JSON.parse(localStorage.getItem('profil'));

if(profil){

    document.getElementById('affich-nom').textContent = profil.nom;
    document.getElementById('affich-ville').textContent = profil.address;
    document.getElementById('affich-prof').textContent = profil.prof;

    document.getElementById('avatar-letter').textContent =
        profil.nom.charAt(0).toUpperCase();

}

const modification = document.getElementById('updat');

modification.addEventListener('click', () => {
    window.location.href = 'update.html';
})