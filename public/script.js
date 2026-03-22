let currentToken = localStorage.getItem('token');
let currentApiKey = localStorage.getItem('apiKey');
let currentUsername = localStorage.getItem('username');

function showSection(sectionId) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('forgot-password-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';

    document.getElementById(sectionId + '-section').style.display = 'block';

    if (sectionId === 'dashboard') {
        fetchProfile();
    }
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        alert(data.message);
        if (data.status) showSection('login');
    } catch (err) {
        alert('Error en el registro');
    }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.status) {
            currentToken = data.token;
            currentApiKey = data.apiKey;
            currentUsername = data.username;
            localStorage.setItem('token', currentToken);
            localStorage.setItem('apiKey', currentApiKey);
            localStorage.setItem('username', currentUsername);
            updateNav();
            showSection('dashboard');
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Error al iniciar sesión');
    }
}

function logout() {
    localStorage.clear();
    currentToken = null;
    updateNav();
    showSection('login');
}

function updateNav() {
    if (currentToken) {
        document.getElementById('auth-nav').style.display = 'none';
        document.getElementById('user-nav').style.display = 'flex';
        document.getElementById('welcome-msg').innerText = `Hola, ${currentUsername}`;
    } else {
        document.getElementById('auth-nav').style.display = 'flex';
        document.getElementById('user-nav').style.display = 'none';
    }
}

async function fetchProfile() {
    try {
        const res = await fetch('/api/profile', {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        const data = await res.json();
        if (data.status) {
            document.getElementById('user-apikey').innerText = data.profile.apiKey;
            document.getElementById('user-usage').innerText = data.profile.usage;
        }
    } catch (err) {
        console.error('Error fetching profile');
    }
}

async function rotateApiKey() {
    if (!confirm('¿Estás seguro de que quieres cambiar tu API KEY?')) return;

    try {
        const res = await fetch('/api/rotate-key', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        const data = await res.json();
        if (data.status) {
            alert(data.message);
            fetchProfile();
        }
    } catch (err) {
        alert('Error al rotar API KEY');
    }
}

async function forgotPassword() {
    const email = document.getElementById('forgot-email').value;
    try {
        const res = await fetch('/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        alert(data.message);
    } catch (err) {
        alert('Error al procesar solicitud');
    }
}

// Initial state
if (currentToken) {
    updateNav();
    showSection('dashboard');
} else {
    updateNav();
}
