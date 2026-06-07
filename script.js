const BIN_ID = '69f31f96aaba88219755804f';
const API_KEY = '$2a$10$hEVISQNvdU7ELl6YsLTVfekgTlospG0OV6ztwuVr/R/Wp.Nw5nZzW';
const ME = { lat: 48.8566, lng: 2.3522 };

let users = [];

async function loadUsers() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });
    const data = await res.json();
    return Array.isArray(data.record) ? data.record : [];
}

function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function initials(prenom) {
    return (prenom?.[0] || '').toUpperCase();
}

const map = L.map('map', { zoomControl: false }).setView([ME.lat, ME.lng], 6);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
}).addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);

const youIcon = L.divIcon({
    className: '',
    html: '<div class="you-pin"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});
L.marker([ME.lat, ME.lng], { icon: youIcon, zIndexOffset: 1000 })
    .addTo(map)
    .bindTooltip('Vous', { permanent: false, offset: [10, 0] });

const markerLayer = L.layerGroup().addTo(map);

async function renderMarkers() {
    users = await loadUsers();
    markerLayer.clearLayers();

    users.forEach(u => {
        const icon = L.divIcon({
            className: '',
           html: `<div class="user-pin">
        ${initials(u.nom)}
      </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });

        const dist = haversine(ME.lat, ME.lng, u.lat, u.lng).toFixed(0);
       L.marker([u.lat, u.lng], { icon })
.addTo(markerLayer)
.bindPopup(`
    <div class="user-card">
        <h3>${u.nom}</h3>
        <p>${u.prof}</p>
        <small>${dist} km</small>
    </div>
`);
    });
}

renderMarkers();