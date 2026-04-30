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
// const res = await fetch(`https://jsonbin.io/app/bins`)