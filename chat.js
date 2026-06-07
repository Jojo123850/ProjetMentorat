const BIN_ID_CHAT = '6a258b80f5f4af5e29c6b818';
const API_KEY_CHAT = '$2a$10$hEVISQNvdU7ELl6YsLTVfekgTlospG0OV6ztwuVr/R/Wp.Nw5nZzW';

const profilChat = JSON.parse(localStorage.getItem('profil'));
const pseudo = profilChat?.pseudo || profilChat?.nom || 'Anonyme';
const ville  = profilChat?.address || '';

let lastCount = 0;

async function loadMessages() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID_CHAT}/latest`, {
        headers: { 'X-Master-Key': API_KEY_CHAT }
    });
    const data = await res.json();
    const msgs = Array.isArray(data.record) ? data.record : [];
    return msgs.filter(m => m.pseudo);
}

async function saveMessages(msgs) {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID_CHAT}`, {
        method: 'PUT',
        headers: {
            'X-Master-Key': API_KEY_CHAT,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(msgs)
    });
}

function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function renderMessages(msgs) {
    const box = document.getElementById('chat-messages');
    if (msgs.length === lastCount) return;
    lastCount = msgs.length;

    box.innerHTML = '';
    msgs.forEach(m => {
        const isMe = m.pseudo === pseudo;
        const div = document.createElement('div');
        div.className = 'chat-msg ' + (isMe ? 'me' : 'other');
        div.innerHTML = `
            ${!isMe ? `<span class="chat-author">${m.pseudo}${m.ville ? ' · ' + m.ville : ''}</span>` : ''}
            <div class="chat-bubble">${m.text}</div>
            <span class="chat-time">${formatTime(m.ts)}</span>
        `;
        box.appendChild(div);
    });

    box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.disabled = true;

    const msgs = await loadMessages();
    msgs.push({ pseudo, ville, text, ts: Date.now() });

    const last50 = msgs.slice(-50);
    await saveMessages(last50);
    renderMessages(last50);

    input.disabled = false;
    input.focus();
}

async function refresh() {
    const msgs = await loadMessages();
    renderMessages(msgs);
}

document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
});

document.getElementById('chat-send').addEventListener('click', sendMessage);

document.getElementById('chat-toggle').addEventListener('click', () => {
    const box = document.getElementById('chat-box');
    const isOpen = box.classList.toggle('open');
    document.getElementById('chat-toggle').textContent = isOpen ? '✕' : '💬';
    if (isOpen) refresh();
});

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        const box = document.getElementById('chat-box');
        const gap = window.innerHeight - window.visualViewport.height;
        box.style.bottom = (gap + 92) + 'px';
        document.getElementById('chat-messages').scrollTop = 99999;
    });
}

refresh();
setInterval(refresh, 4000);