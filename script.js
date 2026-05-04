// JSON
const BIN_ID='69f31f96aaba88219755804f';
const API_KEY='$2a$10$hEVISQNvdU7ELl6YsLTVfekgTlospG0OV6ztwuVr/R/Wp.Nw5nZzW';

const ME = { lat: 48.8566, lng: 2.3522 }; 

let users = []

async function loadUsers() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });
    const data = await res.json();
    return Array.isArray(data.record) ? data.record : [];
}
    
async function saveUsers(updateUsers) {
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/`, {
        method:'PUT',
        headers: {
            'X-Master-Key': API_KEY ,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(updateUsers)
  });   
}

// GEOLOCALISATION
async function geolocalisation(ville) {
    const url= `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(ville)}&format=json&limit=1`
    const res =await fetch(url)
    const data = await res.json();
    if (!data.length) return null;
        return{lat:parseFloat(data[0].lat), lng:(parseFloat(data[0].lon))}
}

// CARTE
const map = L.map('map', { zoomControl: false }).setView([ME.lat, ME.lng], 6);
 
 L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
  }).addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);
 
// Point "Vous"
const youIcon = L.divIcon({
  className: '',
  html: '<div class="you-pin"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});
L.marker([ME.lat, ME.lng], { icon: youIcon, zIndexOffset: 1000 })
  .addTo(map)
  .bindTooltip('Vous', { permanent: false, offset: [10, 0] });


// UTILITAIRE
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2
          + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
 
function initials(prenom, nom) {
  return ((prenom?.[0] || '') + (nom?.[0] || '')).toUpperCase();
}
 
function colorLight(hex) { return hex + '22'; }
// FILTRES
// RENDU


// FORMULAIRE
const bouton2 = document.getElementById('btn-cancel');

bouton2.addEventListener('click', () => {
    document.querySelector('.divForm').classList.remove('open');
});


const bouton = document.getElementById('btn-submit');

bouton.addEventListener('click',async(e)=> {
        e.preventDefault();
    const prenom = document.getElementById('f-nom').value.trim()
    const adress = document.getElementById('f-adress').value.trim()
    const prof = document.getElementById('f-prof').value;
    const btn = document.getElementById('btn-submit');
    
    if(!prenom || !adress || !prof){
        alert ("Tous les champs doivent etre remplis")
            return
    };
    
    const coords = await geolocalisation(adress)
    if(!coords){
            alert("Ville intouvable")
                return
    };

    const newUser = { id: Date.now(), prenom, adress, prof, lat: coords.lat, lng: coords.lng }
    const latest = await loadUsers()
    latest.push(newUser)
    await saveUsers(latest)
    
    
    alert("Enregistrement fait avec succès")
    
    })

// const annuler = document.getElementById('btn-cancel');

// annuler.addEventListener('click', () => {
//   window.location.href = "index.html";
// })


