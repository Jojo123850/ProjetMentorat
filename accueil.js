const profil = JSON.parse(localStorage.getItem('profil'));

if (profil) {
            document.getElementById('affich-nom').textContent = profil.nom;
            document.getElementById('affich-ville').textContent = profil.address;
            document.getElementById('affich-prof').textContent = profil.prof;
        } else {
            window.location.href = 'create.html';
}