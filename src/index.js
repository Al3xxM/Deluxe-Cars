// Renderizado de coches destacados y ventanas de detalle de la portada.
// Rellena la ventana de detalles con los datos del botón pulsado.
var carModal = document.getElementById('carModal');
carModal.addEventListener('show.bs.modal', function (event) {
    var button = event.relatedTarget;
    var title = button.dataset.title || '';
    var year = button.dataset.year || '';
    var desc = button.dataset.desc || '';
    var price = button.dataset.price || '';
    var img = button.dataset.img || 'https://source.unsplash.com/900x500/?car';
    var card = button.closest('.car-card');

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalYear').textContent = year ? ('Año: ' + year) : '';
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('modalPrice').textContent = price;
    var modalImage = document.getElementById('modalImg');
    modalImage.src = img;
    modalImage.classList.toggle('seat-leon-fr-modal-image',
        card && card.dataset.carId === 'seat-leon-fr');

});

var specModal = document.getElementById('specModal');
// Rellena la ficha técnica y su lista de especificaciones.
specModal.addEventListener('show.bs.modal', function (event) {
    var button = event.relatedTarget;
    var title = button.dataset.title || '';
    var year = button.dataset.year || '';
    var price = button.dataset.price || '';
    var img = button.dataset.img || 'https://source.unsplash.com/900x500/?car';
    var desc = button.dataset.desc || '';
    var specs = (button.dataset.specs || '').split('|').filter(Boolean);
    var card = button.closest('.car-card');

    document.getElementById('specTitle').textContent = title;
    document.getElementById('specYear').textContent = year ? ('Año: ' + year) : '';
    document.getElementById('specPrice').textContent = price;
    document.getElementById('specDesc').textContent = desc;
    var specImage = document.getElementById('specImg');
    specImage.src = img;
    specImage.classList.toggle('seat-leon-fr-modal-image',
        card && card.dataset.carId === 'seat-leon-fr');

    var specList = document.getElementById('specList');
    specList.innerHTML = '';
    // Convierte cada especificación en un elemento de la lista HTML.
    specs.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = item;
        specList.appendChild(li);
    });
});

var inventoryText = localStorage.getItem('deluxeCarsInventory');
var inventory = inventoryText ? JSON.parse(inventoryText) : { added: [], deleted: [], updated: {} };
var featuredText = localStorage.getItem('deluxeCarsHomeFeatured');
var featuredIds = featuredText
    ? JSON.parse(featuredText)
    : ['seat-leon-fr', 'ford-mustang', 'audi-q5', 'audi-rs3', 'bmw-serie-3'];
var offerCarIds = ['ford-mustang', 'audi-q5'];
var offerDiscount = 15000;
var featuredDiscountRate = 0.15;
var generalDiscountRate = 0.05;

if (!inventory || !Array.isArray(inventory.added) || !Array.isArray(inventory.deleted)
    || !Array.isArray(featuredIds) || featuredIds.some(id => typeof id !== 'string')) {
    throw new Error('No se pudo leer la configuración de coches del inicio.');
}
if (!inventory.updated || typeof inventory.updated !== 'object' || Array.isArray(inventory.updated)) {
    inventory.updated = {};
}

// Aplica a una tarjeta de la portada los cambios guardados desde administración.
function updateHomeCard(card, updates) {
    var title = card.querySelector('.card-title');
    var year = card.querySelector('.badge-soft');
    var price = card.querySelector('.price');
    var image = card.querySelector('.card-img-top');
    var tags = card.querySelector('.card-body > .mb-3');
    var detailsButton = card.querySelector('[data-bs-target="#carModal"]');
    var specButton = card.querySelector('[data-bs-target="#specModal"]');
    if (typeof updates.name === 'string' && updates.name.trim()) {
        title.textContent = updates.name;
        image.alt = updates.name;
    }
    if (updates.year && Number.isInteger(Number(updates.year))) {
        year.textContent = String(updates.year);
    }
    if (Number.isFinite(Number(updates.price)) && Number(updates.price) > 0) {
        price.dataset.basePrice = String(Number(updates.price));
    }
    if (typeof updates.image === 'string' && /^(https?:\/\/|img\/)[^\s]+$/i.test(updates.image.trim())) {
        image.src = updates.image.trim();
    }
    if (Array.isArray(updates.tags) && tags) {
        tags.replaceChildren();
        // Sustituye las etiquetas antiguas por las guardadas.
        updates.tags.forEach(function (tag, index) {
            var badge = document.createElement('span');
            badge.className = 'badge text-bg-light' + (index < updates.tags.length - 1 ? ' me-1' : '');
            badge.textContent = tag;
            tags.appendChild(badge);
        });
    }
    // Mantiene actualizados los datos que usan los botones de las ventanas.
    [detailsButton, specButton].filter(Boolean).forEach(function (button) {
        if (updates.name) button.dataset.title = updates.name;
        if (updates.year) button.dataset.year = String(updates.year);
        if (updates.description) button.dataset.desc = updates.description;
        if (updates.image) button.dataset.img = image.getAttribute('src');
        if (Array.isArray(updates.specs)) button.dataset.specs = updates.specs.join('|');
    });
    var description = card.querySelector('.card-text');
    if (description && updates.description) {
        description.textContent = updates.description;
    }
    setHomePrice(card);
}

// Calcula y muestra el precio final de una tarjeta de la portada.
function setHomePrice(card) {
    var price = card.querySelector('.price');
    var basePrice = Number(price.dataset.basePrice);
    if (!Number.isFinite(basePrice) || basePrice <= 0) {
        basePrice = Number(price.textContent.replace(/[^\d]/g, ''));
        price.dataset.basePrice = String(basePrice);
    }
    var discounted = offerCarIds.includes(card.dataset.carId);
    var discountRate = featuredIds.includes(card.dataset.carId)
        ? featuredDiscountRate
        : generalDiscountRate;
    var reducedPrice = Math.round(basePrice * (1 - discountRate));
    var shownPrice = discounted ? Math.max(1, reducedPrice - offerDiscount) : reducedPrice;
    var formatter = new Intl.NumberFormat('es-ES');
    price.dataset.currentPrice = String(shownPrice);
    price.replaceChildren();
    var previous = document.createElement('del');
    previous.className = 'price-previous d-block';
    previous.textContent = 'Desde ' + formatter.format(basePrice) + ' €';
    var offer = document.createElement('span');
    offer.className = 'price-offer d-block';
    offer.textContent = 'Desde ' + formatter.format(shownPrice) + ' €';
    price.append(previous, offer);
    var discountBadge = document.createElement('span');
    discountBadge.className = 'badge text-bg-success ms-2';
    discountBadge.textContent = '-' + Math.round(discountRate * 100) + ' %';
    price.appendChild(discountBadge);
    // Actualiza el precio de cada botón de detalles o ficha.
    card.querySelectorAll('[data-bs-target="#carModal"], [data-bs-target="#specModal"]')
        .forEach(function (button) {
            button.dataset.price = formatter.format(shownPrice) + ' €';
        });
}

// Crea una tarjeta usando la plantilla HTML y los datos de un coche.
function createHomeCard(car) {
    var column = document.getElementById('homeCarTemplate').content.firstElementChild.cloneNode(true);
    var image = column.querySelector('.card-img-top');
    image.alt = car.name;
    image.src = typeof car.image === 'string' && /^(https?:\/\/|img\/)[^\s]+$/i.test(car.image)
        ? car.image : 'img/LogoDC.png';
    column.dataset.carId = car.id;
    column.querySelector('.card-title').textContent = car.name;
    column.querySelector('.badge-soft').textContent = String(car.year);
    column.querySelector('.card-text').textContent = car.description || 'Vehículo seleccionado';
    var tags = column.querySelector('.card-body > .mb-3');
    (Array.isArray(car.tags) ? car.tags : []).forEach(function (tag) {
        var badge = document.createElement('span');
        badge.className = 'badge text-bg-light me-1';
        badge.textContent = tag;
        tags.appendChild(badge);
    });
    if (tags.lastElementChild) tags.lastElementChild.classList.remove('me-1');
    var price = column.querySelector('.price');
    price.dataset.basePrice = String(Number(car.price));
    var formattedPrice = new Intl.NumberFormat('es-ES').format(Number(car.price)) + ' €';
    var buttons = column.querySelectorAll('[data-bs-toggle="modal"]');
    // Copia los datos del coche a los dos botones de la tarjeta.
    buttons.forEach(function (button) {
        button.dataset.title = car.name;
        button.dataset.year = String(car.year);
        button.dataset.desc = car.description || '';
        button.dataset.price = formattedPrice;
        button.dataset.img = image.getAttribute('src');
    });
    column.querySelector('[data-bs-target="#specModal"]').dataset.specs =
        Array.isArray(car.specs) ? car.specs.join('|') : '';
    addWatermarks(column);
    setHomePrice(column);
    return column;
}

// Elimina de la portada los coches borrados desde administración.
inventory.deleted.forEach(function (carId) {
    var card = document.querySelector('#carsGrid [data-car-id="' + carId + '"]');
    if (card) card.remove();
});
// Actualiza las tarjetas existentes con los cambios guardados.
Object.entries(inventory.updated).forEach(function (entry) {
    var card = document.querySelector('#carsGrid [data-car-id="' + entry[0] + '"]');
    if (card && entry[1]) updateHomeCard(card, entry[1]);
});
// Quita los coches que ya no están seleccionados para la portada.
document.querySelectorAll('#carsGrid [data-car-id]').forEach(function (card) {
    if (!featuredIds.includes(card.dataset.carId)) card.remove();
});
// Añade a la portada los coches destacados que aún no tienen tarjeta.
catalogCars.concat(inventory.added).forEach(function (car) {
    if (!car || typeof car.id !== 'string' || !featuredIds.includes(car.id)
        || inventory.deleted.includes(car.id)
        || !car.name || !Number.isInteger(Number(car.year)) || !Number.isFinite(Number(car.price))) return;
    if (document.querySelector('#carsGrid [data-car-id="' + car.id + '"]')) return;
    document.getElementById('carsGrid').appendChild(createHomeCard({ ...car, ...inventory.updated[car.id] }));
});

// Aplica el precio correcto también a las tarjetas escritas directamente en HTML.
document.querySelectorAll('#carsGrid [data-car-id]').forEach(setHomePrice);
