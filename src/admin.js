// Acceso y herramientas locales de administración.
const SESSION_KEY = 'deluxeCarsSession';
const ADMIN_EMAIL = 'admin@deluxecars.com';
const ADMIN_PASSWORD = 'admin';
const CARS_KEY = 'deluxeCarsInventory';
const HOME_CARS_KEY = 'deluxeCarsHomeFeatured';
const defaultHomeCarIds = ['seat-leon-fr', 'ford-mustang', 'audi-q5', 'audi-rs3', 'bmw-serie-3'];
const accessView = document.getElementById('accessView');
const accountView = document.getElementById('accountView');
const feedback = document.getElementById('feedback');
const adminForm = document.getElementById('adminForm');

// Carga los coches añadidos, eliminados o modificados en el panel de administración.
function getInventory() {
    const savedInventory = localStorage.getItem(CARS_KEY);
    const inventory = savedInventory ? JSON.parse(savedInventory) : { added: [], deleted: [], updated: {} };
    if (!inventory || !Array.isArray(inventory.added) || !Array.isArray(inventory.deleted)) {
        throw new Error('No se pudo leer el catálogo guardado en este navegador.');
    }
    if (!inventory.updated || typeof inventory.updated !== 'object' || Array.isArray(inventory.updated)) {
        inventory.updated = {};
    }
    return inventory;
}

// Muestra un mensaje después de añadir, editar o eliminar un coche.
function showCarFeedback(message, type) {
    const carFeedback = document.getElementById('carFeedback');
    carFeedback.textContent = message;
    carFeedback.className = 'alert alert-' + type;
}

// Rellena el formulario con los datos del coche que se va a editar.
function beginCarEdit(car) {
    document.getElementById('editingCarId').value = car.id;
    document.getElementById('carName').value = car.name;
    document.getElementById('carYear').value = car.year;
    document.getElementById('carPrice').value = car.price;
    document.getElementById('carImage').value = car.image || '';
    document.getElementById('carDescription').value = car.description || '';
    document.getElementById('carSpecs').value = Array.isArray(car.specs) ? car.specs.join('\n') : '';
    document.getElementById('carTags').value = Array.isArray(car.tags) ? car.tags.join(', ') : '';
    document.getElementById('saveCarButton').textContent = 'Guardar cambios';
    document.getElementById('carFormTitle').textContent = 'Editar vehículo';
    document.getElementById('cancelCarEdit').classList.remove('d-none');
    bootstrap.Collapse.getOrCreateInstance(document.getElementById('carFormPanel'), {
        toggle: false
    }).show();
    document.getElementById('carName').focus();
}

// Deja el formulario listo para añadir un coche nuevo.
function resetCarForm() {
    document.getElementById('addCarForm').reset();
    document.getElementById('editingCarId').value = '';
    document.getElementById('saveCarButton').textContent = 'Añadir coche';
    document.getElementById('carFormTitle').textContent = 'Datos del vehículo';
    document.getElementById('cancelCarEdit').classList.add('d-none');
    bootstrap.Collapse.getOrCreateInstance(document.getElementById('carFormPanel'), {
        toggle: false
    }).hide();
}

// Actualiza la tabla de coches del panel de administración.
function renderCars() {
    const inventory = getInventory();
    const carList = document.getElementById('carList');
    carList.replaceChildren();
    const cars = catalogCars.filter(car => !inventory.deleted.includes(car.id))
        .concat(inventory.added)
        .map(car => ({ ...car, ...inventory.updated[car.id] }));

    cars.forEach(car => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const yearCell = document.createElement('td');
        const priceCell = document.createElement('td');
        const actionCell = document.createElement('td');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');
        nameCell.textContent = car.name;
        yearCell.textContent = car.year;
        priceCell.textContent = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(car.price);
        editButton.type = 'button';
        editButton.className = 'btn btn-outline-primary btn-sm me-1';
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => beginCarEdit(car));
        deleteButton.type = 'button';
        deleteButton.className = 'btn btn-outline-danger btn-sm';
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            try {
                const current = getInventory();
                if (car.id.startsWith('custom-')) {
                    current.added = current.added.filter(item => item.id !== car.id);
                } else if (!current.deleted.includes(car.id)) {
                    current.deleted.push(car.id);
                }
                delete current.updated[car.id];
                localStorage.setItem(CARS_KEY, JSON.stringify(current));
                renderCars();
                renderHomeCars();
                showCarFeedback('Coche eliminado del catálogo.', 'success');
            } catch (error) {
                showCarFeedback(error.message || 'No se pudo eliminar el coche.', 'danger');
            }
        });
        actionCell.className = 'text-end text-nowrap';
        actionCell.append(editButton, deleteButton);
        row.append(nameCell, yearCell, priceCell, actionCell);
        carList.appendChild(row);
    });
}

// Muestra las casillas para elegir qué coches aparecen en la portada.
function renderHomeCars() {
    const inventory = getInventory();
    const storedFeatured = localStorage.getItem(HOME_CARS_KEY);
    const featured = storedFeatured ? JSON.parse(storedFeatured) : defaultHomeCarIds;
    if (!Array.isArray(featured) || featured.some(id => typeof id !== 'string')) {
        throw new Error('No se pudo leer la selección de coches del inicio.');
    }
    const availableCars = catalogCars.filter(car => !inventory.deleted.includes(car.id))
        .concat(inventory.added)
        .map(car => ({ ...car, ...inventory.updated[car.id] }));
    const list = document.getElementById('homeCarList');
    list.replaceChildren();
    availableCars.forEach(car => {
        const column = document.createElement('div');
        column.className = 'col-md-6';
        const label = document.createElement('label');
        label.className = 'form-check admin-feature-option border rounded-3 p-3 d-flex align-items-center gap-2';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input mt-0';
        checkbox.value = car.id;
        checkbox.checked = featured.includes(car.id);
        label.classList.toggle('is-selected', checkbox.checked);
        checkbox.addEventListener('change', () => {
            label.classList.toggle('is-selected', checkbox.checked);
        });
        const name = document.createElement('span');
        name.textContent = car.name;
        label.append(checkbox, name);
        column.appendChild(label);
        list.appendChild(column);
    });
}

// Muestra el panel de administración de una sesión válida.
function renderSession(session) {
    if (!session || session.role !== 'admin') {
        return;
    }
    accessView.classList.add('d-none');
    accountView.classList.remove('d-none');
    document.getElementById('welcomeTitle').textContent = 'Panel de administración';
    document.getElementById('accountDescription').textContent =
        'Has accedido como administrador al panel.';
    document.getElementById('adminUsers').classList.remove('d-none');
    renderCars();
    renderHomeCars();
}

// Inicia la sesión de demostración del administrador.
adminForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value.trim().toLowerCase();
    const password = document.getElementById('adminPassword').value;
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        feedback.textContent = 'Las credenciales de administrador no son correctas.';
        feedback.className = 'alert alert-danger mt-4 mb-0';
        return;
    }
    const session = { role: 'admin', name: 'Administrador', email: ADMIN_EMAIL };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.removeItem(SESSION_KEY);
    renderSession(session);
});

// Añade un coche nuevo o guarda los cambios de uno existente.
document.getElementById('addCarForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('carName').value.trim();
    const year = Number(document.getElementById('carYear').value);
    const price = Number(document.getElementById('carPrice').value);
    const image = document.getElementById('carImage').value.trim();
    const description = document.getElementById('carDescription').value.trim();
    const specs = document.getElementById('carSpecs').value.split('\n')
        .map(spec => spec.trim()).filter(Boolean);
    const tags = [...new Set(document.getElementById('carTags').value.split(',')
        .map(tag => tag.trim()).filter(Boolean))];
    const editingCarId = document.getElementById('editingCarId').value;
    if (!name || !Number.isInteger(year) || year < 1900 || year > 2100 || !Number.isFinite(price) || price <= 0) {
        showCarFeedback('Introduce un modelo, un año válido y un precio mayor que cero.', 'danger');
        return;
    }
    try {
        const inventory = getInventory();
        const carData = { name, year, price, image, description, specs, tags };
        if (editingCarId) {
            if (editingCarId.startsWith('custom-')) {
                const car = inventory.added.find(item => item.id === editingCarId);
                if (!car) {
                    throw new Error('No se encontró el coche que quieres modificar.');
                }
                Object.assign(car, carData);
            } else {
                inventory.updated[editingCarId] = carData;
            }
        } else {
            const id = 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
            inventory.added.push({ id, ...carData });
        }
        localStorage.setItem(CARS_KEY, JSON.stringify(inventory));
        resetCarForm();
        renderCars();
        renderHomeCars();
        showCarFeedback(editingCarId
            ? 'Cambios guardados en el catálogo.'
            : 'Coche añadido. Ya aparece en el catálogo.', 'success');
    } catch (error) {
        showCarFeedback(error.message || 'No se pudo guardar el coche.', 'danger');
    }
});

document.getElementById('cancelCarEdit').addEventListener('click', resetCarForm);

// Guarda la selección de coches destacados de la portada.
document.getElementById('saveHomeCars').addEventListener('click', () => {
    const selected = Array.from(document.querySelectorAll('#homeCarList input:checked'))
        .map(checkbox => checkbox.value);
    try {
        localStorage.setItem(HOME_CARS_KEY, JSON.stringify(selected));
        const homeFeedback = document.getElementById('homeFeedback');
        homeFeedback.textContent = 'Selección del inicio guardada.';
        homeFeedback.className = 'alert alert-success mt-3 mb-0';
    } catch (error) {
        const homeFeedback = document.getElementById('homeFeedback');
        homeFeedback.textContent = error.message || 'No se pudo guardar la selección del inicio.';
        homeFeedback.className = 'alert alert-danger mt-3 mb-0';
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    accountView.classList.add('d-none');
    accessView.classList.remove('d-none');
    adminForm.reset();
    feedback.classList.add('d-none');
});

const existingSession = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
if (existingSession) {
    renderSession(JSON.parse(existingSession));
}
