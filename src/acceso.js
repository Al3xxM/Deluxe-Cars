// Inicio de sesión y registro de cuentas de usuario.
const USERS_KEY = 'deluxeCarsUsers';
const SESSION_KEY = 'deluxeCarsSession';
const ADMIN_EMAIL = 'admin@deluxecars.com';
const accessView = document.getElementById('accessView');
const accountView = document.getElementById('accountView');
const feedback = document.getElementById('feedback');
const loginForm = document.getElementById('loginForm');

// Lee las cuentas guardadas en el navegador y comprueba que tengan el formato esperado.
function getUsers() {
    const savedUsers = localStorage.getItem(USERS_KEY);
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    if (!Array.isArray(users)) {
        throw new Error('No se pudieron leer las cuentas guardadas. Borra los datos locales del sitio e inténtalo de nuevo.');
    }
    return users;
}

// Crea una huella digital de la contraseña para no guardarla como texto normal.
async function hashPassword(password, salt) {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Este navegador no permite crear cuentas en este contexto. Abre la web desde localhost o HTTPS.');
    }
    const data = new TextEncoder().encode(salt + password);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

// Muestra un mensaje de resultado en los formularios de acceso.
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = 'alert alert-' + type + ' mt-4 mb-0';
}

// Cambia entre los formularios de inicio de sesión y registro.
function showForm(view) {
    document.querySelectorAll('#accessView form').forEach(form => form.classList.add('d-none'));
    document.getElementById(view + 'Form').classList.remove('d-none');
    document.querySelectorAll('[data-view]').forEach(button => {
        const isActive = button.dataset.view === view;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
    feedback.classList.add('d-none');
}

// Muestra la cuenta de usuario iniciada.
function renderSession(session) {
    if (session.role === 'admin') {
        location.replace('admin.html');
        return;
    }
    accessView.classList.add('d-none');
    accountView.classList.remove('d-none');
    document.getElementById('welcomeTitle').textContent = '¡Hola, ' + session.name + '!';
    document.getElementById('accountDescription').textContent =
        'Has iniciado sesión como ' + session.email + '.';
}

document.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => showForm(button.dataset.view));
});

document.getElementById('registerForm').addEventListener('submit', async event => {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    if (name.length === 0) {
        showFeedback('Escribe tu nombre para crear la cuenta.', 'danger');
        return;
    }
    try {
        const users = getUsers();
        if (users.some(user => user.email === email) || email === ADMIN_EMAIL) {
            showFeedback('Ya existe una cuenta con ese correo electrónico.', 'danger');
            return;
        }
        const salt = Array.from(window.crypto.getRandomValues(new Uint8Array(16)),
            byte => byte.toString(16).padStart(2, '0')).join('');
        const passwordHash = await hashPassword(password, salt);
        users.push({ name, email, salt, passwordHash });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        event.target.reset();
        showForm('login');
        showFeedback('Cuenta creada. Ya puedes iniciar sesión.', 'success');
        document.getElementById('loginEmail').value = email;
    } catch (error) {
        showFeedback(error.message || 'No se pudo guardar la cuenta en este navegador.', 'danger');
    }
});

loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    try {
        const user = getUsers().find(account => account.email === email);
        if (!user || await hashPassword(password, user.salt) !== user.passwordHash) {
            showFeedback('El correo o la contraseña no son correctos.', 'danger');
            return;
        }
        const session = { role: 'user', name: user.name, email: user.email };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        if (document.getElementById('rememberMe').checked) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
        renderSession(session);
    } catch (error) {
        showFeedback(error.message || 'No se pudo iniciar sesión.', 'danger');
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    accountView.classList.add('d-none');
    accessView.classList.remove('d-none');
    showForm('login');
});

const existingSession = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
if (existingSession) {
    const session = JSON.parse(existingSession);
    if (session && (session.role === 'user' || session.role === 'admin')) {
        renderSession(session);
    }
}
