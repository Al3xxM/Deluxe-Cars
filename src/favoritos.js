// Consulta y actualización local de la lista de vehículos favoritos.
const sessionText = sessionStorage.getItem('deluxeCarsSession')
    || localStorage.getItem('deluxeCarsSession');
const favoritesGrid = document.getElementById('favoritesGrid');
const loginNotice = document.getElementById('loginNotice');
const emptyNotice = document.getElementById('emptyNotice');

// Muestra los coches guardados o el aviso correspondiente si no hay sesión o favoritos.
function renderFavorites() {
    favoritesGrid.replaceChildren();
    if (!sessionText) {
        loginNotice.classList.remove('d-none');
        emptyNotice.classList.add('d-none');
        return;
    }

    const session = JSON.parse(sessionText);
    if (!session || typeof session.email !== 'string') {
        loginNotice.classList.remove('d-none');
        emptyNotice.classList.add('d-none');
        return;
    }
    loginNotice.classList.add('d-none');
    const favoritesKey = 'deluxeCarsFavorites:' + session.email.toLowerCase();
    const savedFavorites = localStorage.getItem(favoritesKey);
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    if (!Array.isArray(favorites)) {
        throw new Error('No se pudo leer tu lista de favoritos.');
    }
    emptyNotice.classList.toggle('d-none', favorites.length > 0);

    // Crea una tarjeta por cada coche guardado como favorito.
    favorites.forEach(function (car) {
        if (!car || typeof car.id !== 'string' || typeof car.name !== 'string') {
            return;
        }
        const column = document.getElementById('favoriteCardTemplate').content.firstElementChild.cloneNode(true);
        const image = column.querySelector('.card-img-top');
        image.alt = car.name;
        image.src = typeof car.image === 'string' && /^(https?:\/\/|img\/)[^\s]+$/i.test(car.image)
            ? car.image
            : 'img/LogoDC.png';
        column.querySelector('h2').textContent = car.name;
        column.querySelector('.badge').textContent = String(car.year || '');
        column.querySelector('.text-muted').textContent = car.description || '';
        const tags = column.querySelector('.card-body > .mb-3');
        // Muestra las etiquetas guardadas para el coche.
        (Array.isArray(car.tags) ? car.tags : []).forEach(function (tag) {
            const badge = document.createElement('span');
            badge.className = 'badge text-bg-light me-1';
            badge.textContent = tag;
            tags.appendChild(badge);
        });
        if (tags.lastElementChild) tags.lastElementChild.classList.remove('me-1');
        column.querySelector('.text-primary').textContent =
            'Desde ' + new Intl.NumberFormat('es-ES').format(Number(car.price) || 0) + ' €';
        const removeButton = column.querySelector('button');
        removeButton.setAttribute('aria-label', 'Quitar ' + car.name + ' de favoritos');
        // Quita este coche de la lista guardada y vuelve a dibujar las tarjetas.
        removeButton.addEventListener('click', function () {
            const updatedFavorites = favorites.filter(item => item.id !== car.id);
            localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
            renderFavorites();
        });
        addWatermarks(column);
        favoritesGrid.appendChild(column);
    });
}

renderFavorites();
