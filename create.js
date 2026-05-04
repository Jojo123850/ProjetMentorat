const BIN_ID = '69f31f96aaba88219755804f';
const API_KEY = '$2a$10$hEVISQNvdU7ELl6YsLTVfekgTlospG0OV6ztwuVr/R/Wp.Nw5nZzW';

async function loadUsers() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });
    const data = await res.json();
    return Array.isArray(data.record) ? data.record : [];
}

async function saveUsers(updatedUsers) {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
            'X-Master-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUsers)
    });
    const data = await res.json();
    console.log('Save result:', data);
}

async function geolocalisation(ville) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(ville)}&format=json&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

document.getElementById('btn-submit').addEventListener('click', async (e) => {
    e.preventDefault();
    const nom = document.getElementById('f-nom').value.trim();
    const address = document.getElementById('f-adress').value.trim();
    const prof = document.getElementById('f-prof').value;

    // ✅ Correction : "prenom" → "nom"
    if (!nom || !address || !prof) {
        alert("Tous les champs doivent être remplis");
        return;
    }

    const coords = await geolocalisation(address);
    if (!coords) {
        alert("Ville introuvable");
        return;
    }

    const newUser = { id: Date.now(), nom, address, prof, lat: coords.lat, lng: coords.lng };

    const latest = await loadUsers();
    latest.push(newUser);
    await saveUsers(latest);

    alert("Enregistrement fait avec succès !");


    const profil = { nom, address, prof };
    localStorage.setItem('profil', JSON.stringify(profil));

    // Redirection vers la page profil
    window.location.href = 'accueil.html';
});