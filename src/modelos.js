// Filtros, precios, favoritos y simulador del catálogo de vehículos.
const search = document.getElementById('search');
const filter = document.getElementById('filter');
const clearBtn = document.getElementById('clearBtn');
const brandFilterOptions = document.getElementById('brandFilterOptions');
const brandFilterButton = document.getElementById('brandFilterButton');
const clearBrandsBtn = document.getElementById('clearBrandsBtn');
const selectedBrands = new Set();

// Obtiene la marca a partir del nombre que aparece en la tarjeta.
function getCarBrand(card) {
    const title = card.querySelector('.card-title').textContent.trim();
    const knownBrands = ['Volkswagen', 'Mercedes', 'Audi', 'BMW', 'Ford', 'Seat'];
    const brand = knownBrands.find(name => title.toLowerCase().startsWith(name.toLowerCase()));
    return brand || title.split(/\s+/)[0];
}

// Crea las casillas de filtro a partir de las marcas presentes en el catálogo.
function renderBrandFilters() {
    const cards = Array.from(document.querySelectorAll('.car-card'));
    const brands = [...new Set(cards.map(getCarBrand))]
        .filter(Boolean)
        .sort((first, second) => first.localeCompare(second, 'es'));

    brandFilterOptions.replaceChildren();
    brands.forEach(function (brand) {
        const label = document.createElement('label');
        label.className = 'dropdown-item brand-filter-option';
        const checkbox = document.createElement('input');
        checkbox.className = 'form-check-input me-2';
        checkbox.type = 'checkbox';
        checkbox.value = brand;
        checkbox.checked = selectedBrands.has(brand);
        // Actualiza la selección de marcas y vuelve a filtrar los coches.
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                selectedBrands.add(brand);
            } else {
                selectedBrands.delete(brand);
            }
            renderSelectedBrands();
            applyFilters();
        });
        label.append(checkbox, document.createTextNode(brand));
        brandFilterOptions.appendChild(label);
    });
    if (selectedBrands.size > 0) {
        const clearOption = document.createElement('div');
        clearOption.className = 'dropdown-divider my-1';
        brandFilterOptions.appendChild(clearOption);
    }
    clearBrandsBtn.className = 'dropdown-item small';
    brandFilterOptions.appendChild(clearBrandsBtn);
    renderSelectedBrands();
}

// Actualiza el texto del botón y muestra u oculta la opción de quitar marcas.
function renderSelectedBrands() {
    const selectedCount = selectedBrands.size;
    brandFilterButton.textContent = selectedCount
        ? 'Marcas seleccionadas (' + selectedCount + ')'
        : 'Filtrar por marca';
    clearBrandsBtn.hidden = selectedCount === 0;
}

// Muestra solo los coches que coinciden con la búsqueda, el año y las marcas.
function applyFilters() {
    const q = search.value.trim().toLowerCase();
    const year = filter.value;
    const cards = document.querySelectorAll('.car-card');

    // Oculta las tarjetas que no coinciden con los filtros.
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const meta = card.querySelector('.text-muted').textContent.toLowerCase();
        const yearTag = card.querySelector('.badge-soft') ? card.querySelector('.badge-soft').textContent.trim() : '';
        const matchesQ = !q || title.includes(q) || meta.includes(q);
        const matchesYear = !year || yearTag === year;
        const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(getCarBrand(card));
        card.style.display = (matchesQ && matchesYear && matchesBrand) ? '' : 'none';
    });
}

search.addEventListener('input', applyFilters);
filter.addEventListener('change', applyFilters);
// Restablece todos los filtros; lo usan los botones Limpiar y Mostrar todo.
function clearFilters() {
    search.value = '';
    filter.value = '';
    selectedBrands.clear();
    renderBrandFilters();
    applyFilters();
}

clearBtn.addEventListener('click', clearFilters);
document.getElementById('showAllBtn').addEventListener('click', clearFilters);
// Quita las marcas seleccionadas y vuelve a mostrar los resultados.
clearBrandsBtn.addEventListener('click', function () {
    selectedBrands.clear();
    renderBrandFilters();
    applyFilters();
});

const inventoryKey = 'deluxeCarsInventory';
const savedInventoryText = localStorage.getItem(inventoryKey);
const savedInventory = savedInventoryText
    ? JSON.parse(savedInventoryText)
    : { added: [], deleted: [] };
const homeFeaturedText = localStorage.getItem('deluxeCarsHomeFeatured');
const homeFeaturedIds = homeFeaturedText
    ? JSON.parse(homeFeaturedText)
    : ['seat-leon-fr', 'ford-mustang', 'audi-q5', 'audi-rs3', 'bmw-serie-3'];
const offerCarIds = ['ford-mustang', 'audi-q5'];
const offerDiscount = 15000;
const featuredDiscountRate = 0.15;
const generalDiscountRate = 0.05;

if (!savedInventory || !Array.isArray(savedInventory.added) || !Array.isArray(savedInventory.deleted)
    || !Array.isArray(homeFeaturedIds) || homeFeaturedIds.some(id => typeof id !== 'string')) {
    throw new Error('No se pudo leer el catálogo administrado en este navegador.');
}

// Dibuja las etiquetas de un coche en el contenedor indicado.
function renderCarTags(container, tags) {
    container.replaceChildren();
    // Crea una etiqueta visible por cada texto válido.
    (Array.isArray(tags) ? tags : []).forEach(function (tag, index) {
        if (typeof tag !== 'string' || !tag.trim()) {
            return;
        }
        const badge = document.createElement('span');
        badge.className = 'badge text-bg-light' + (index < tags.length - 1 ? ' me-1' : '');
        badge.textContent = tag.trim();
        container.appendChild(badge);
    });
    if (container.lastElementChild) container.lastElementChild.classList.remove('me-1');
}

// Quita del catálogo los coches que se eliminaron desde administración.
savedInventory.deleted.forEach(function (carId) {
    const card = document.querySelector('[data-car-id="' + carId + '"]');
    if (card) {
        card.remove();
    }
});

// Aplica al HTML los cambios guardados para los coches existentes.
Object.entries(savedInventory.updated || {}).forEach(function ([carId, updates]) {
    const card = document.querySelector('[data-car-id="' + carId + '"]');
    if (!card || !updates) {
        return;
    }
    const title = card.querySelector('.card-title');
    const year = card.querySelector('.badge-soft');
    const price = card.querySelector('.price');
    const image = card.querySelector('.card-img-top');
    const specButton = card.querySelector('[data-bs-target="#specModal"]');
    const tagContainer = card.querySelector('.card-body > .mb-3');
    if (typeof updates.name === 'string' && updates.name.trim()) {
        title.textContent = updates.name;
        image.alt = updates.name;
        if (specButton) {
            specButton.dataset.title = updates.name;
        }
    }
    if (Number.isInteger(Number(updates.year)) && updates.year) {
        year.textContent = String(updates.year);
        if (![...filter.options].some(option => option.value === String(updates.year))) {
            const yearOption = document.createElement('option');
            yearOption.value = String(updates.year);
            yearOption.textContent = String(updates.year);
            filter.appendChild(yearOption);
        }
        if (specButton) {
            specButton.dataset.year = String(updates.year);
        }
    }
    if (Number.isFinite(Number(updates.price)) && Number(updates.price) > 0) {
        price.dataset.basePrice = String(Number(updates.price));
    }
    if (typeof updates.description === 'string' && specButton) {
        specButton.dataset.desc = updates.description;
    }
    if (Array.isArray(updates.specs) && specButton) {
        specButton.dataset.specs = updates.specs.join('|');
    }
    if (Array.isArray(updates.tags) && tagContainer) {
        renderCarTags(tagContainer, updates.tags);
    }
    if (typeof updates.image === 'string' && /^(https?:\/\/|img\/)[^\s]+$/i.test(updates.image.trim())) {
        image.src = updates.image.trim();
        if (specButton) {
            specButton.dataset.img = image.src;
        }
    }
});

// Crea una tarjeta para cada coche añadido desde administración.
savedInventory.added.forEach(function (car) {
    if (!car || typeof car.id !== 'string' || typeof car.name !== 'string'
        || !Number.isFinite(Number(car.price)) || !Number.isInteger(Number(car.year))) {
        return;
    }

    if (![...filter.options].some(option => option.value === String(car.year))) {
        const yearOption = document.createElement('option');
        yearOption.value = String(car.year);
        yearOption.textContent = String(car.year);
        filter.appendChild(yearOption);
    }

    const card = document.getElementById('catalogCarTemplate').content.firstElementChild.cloneNode(true);
    card.dataset.carId = car.id;
    const image = card.querySelector('.card-img-top');
    image.alt = car.name;
    const imagePath = typeof car.image === 'string' ? car.image.trim() : '';
    if (/^(https?:\/\/|img\/)[^\s]+$/i.test(imagePath)) {
        image.src = imagePath;
    } else {
        image.src = 'img/LogoDC.png';
        image.alt = 'Imagen no disponible';
    }
    card.querySelector('.card-title').textContent = car.name;
    card.querySelector('.badge-soft').textContent = String(car.year);
    card.querySelector('.text-muted').textContent = car.description || 'Vehículo seleccionado';
    renderCarTags(card.querySelector('.card-body > .mb-3'), car.tags);
    const price = card.querySelector('.price');
    price.dataset.basePrice = String(Number(car.price));
    price.textContent = 'Desde ' + new Intl.NumberFormat('es-ES').format(Number(car.price)) + ' €';
    const specButton = card.querySelector('[data-bs-target="#specModal"]');
    specButton.dataset.bsToggle = 'modal';
    specButton.dataset.title = car.name;
    specButton.dataset.year = String(car.year);
    specButton.dataset.desc = car.description || 'Vehículo disponible en el catálogo de Deluxe Cars.';
    specButton.dataset.price = price.textContent;
    specButton.dataset.img = image.src;
    specButton.dataset.specs = Array.isArray(car.specs) ? car.specs.join('|') : '';
    addWatermarks(card);
    document.getElementById('carsGrid').appendChild(card);
});

renderBrandFilters();
applyFilters();

// Calcula y muestra el precio final y los descuentos del coche.
function applyCatalogPrice(card) {
    const price = card.querySelector('.price');
    let basePrice = Number(price.dataset.basePrice);
    if (!Number.isFinite(basePrice) || basePrice <= 0) {
        basePrice = Number(price.textContent.replace(/[^\d]/g, ''));
        price.dataset.basePrice = String(basePrice);
    }
    const discountRate = homeFeaturedIds.includes(card.dataset.carId)
        ? featuredDiscountRate
        : generalDiscountRate;
    const discountedPrice = Math.round(basePrice * (1 - discountRate));
    const finalPrice = offerCarIds.includes(card.dataset.carId)
        ? Math.max(1, discountedPrice - offerDiscount)
        : discountedPrice;
    const formatter = new Intl.NumberFormat('es-ES');
    price.dataset.currentPrice = String(finalPrice);
    price.replaceChildren();

    const previousPrice = document.createElement('del');
    previousPrice.className = 'price-previous d-block';
    previousPrice.textContent = 'Desde ' + formatter.format(basePrice) + ' €';
    const offerPrice = document.createElement('span');
    offerPrice.className = 'price-offer d-block';
    offerPrice.textContent = 'Desde ' + formatter.format(finalPrice) + ' €';
    price.append(previousPrice, offerPrice);
    const discountBadge = document.createElement('span');
    discountBadge.className = 'badge text-bg-success ms-2';
    discountBadge.textContent = '-' + Math.round(discountRate * 100) + ' %';
    price.appendChild(discountBadge);

    const specButton = card.querySelector('[data-bs-target="#specModal"]');
    // Actualiza el precio que mostrará la ficha del coche.
    if (specButton) {
        specButton.dataset.price = formatter.format(finalPrice) + ' €';
    }
}

// Calcula los precios de todas las tarjetas al cargar el catálogo.
document.querySelectorAll('#carsGrid .car-card').forEach(applyCatalogPrice);

const financeModal = new bootstrap.Modal(document.getElementById('financeModal'));
const financePrice = document.getElementById('financePrice');
const financeDownPayment = document.getElementById('financeDownPayment');
const financeMonths = document.getElementById('financeMonths');
const financeError = document.getElementById('financeError');
const euroFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
});
let selectedCarPrice = 0;

// Añade a cada tarjeta los botones de financiación y favoritos.
document.querySelectorAll('.car-card').forEach(function (card) {
    const buttonContainer = card.querySelector('.mt-auto');
    const title = card.querySelector('.card-title').textContent.trim();
    const price = Number(card.querySelector('.price').dataset.currentPrice);
    const financeButton = document.createElement('button');

    financeButton.type = 'button';
    financeButton.className = 'btn btn-primary btn-sm ms-md-auto';
    financeButton.textContent = 'Calcular presupuesto';
    // Abre el simulador de financiación con el precio de este coche.
    financeButton.addEventListener('click', function () {
        selectedCarPrice = price;
        document.getElementById('financeCarName').textContent = title;
        financePrice.value = euroFormatter.format(price);
        financeDownPayment.max = String(price - 1);
        financeDownPayment.value = '0';
        financeError.classList.add('d-none');
        calculateCarFinancing();
        financeModal.show();
    });
    const favoriteButton = document.createElement('button');
    favoriteButton.type = 'button';
    favoriteButton.className = 'btn btn-outline-danger btn-sm favorite-button';
    favoriteButton.setAttribute('aria-label', 'Añadir a favoritos');
    favoriteButton.setAttribute('title', 'Añadir a favoritos');
    favoriteButton.innerHTML = '&#9825;';
    // Guarda o quita el coche de los favoritos de la cuenta activa.
    favoriteButton.addEventListener('click', function () {
        const sessionText = sessionStorage.getItem('deluxeCarsSession')
            || localStorage.getItem('deluxeCarsSession');
        const session = sessionText ? JSON.parse(sessionText) : null;
        if (!session || typeof session.email !== 'string') {
            window.location.href = 'acceso.html';
            return;
        }

        const favoritesKey = 'deluxeCarsFavorites:' + session.email.toLowerCase();
        const storedFavorites = localStorage.getItem(favoritesKey);
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        if (!Array.isArray(favorites)) {
            throw new Error('No se pudo leer tu lista de favoritos.');
        }

        const carId = card.dataset.carId;
        const favoriteIndex = favorites.findIndex(car => car.id === carId);
        if (favoriteIndex >= 0) {
            favorites.splice(favoriteIndex, 1);
        } else {
            const specButton = card.querySelector('[data-bs-target="#specModal"]');
            const image = card.querySelector('.card-img-top');
            const tags = Array.from(card.querySelector('.card-body > .mb-3').querySelectorAll('.badge'))
                .map(tag => tag.textContent.trim());
            favorites.push({
                id: carId,
                name: card.querySelector('.card-title').textContent.trim(),
                year: Number(card.querySelector('.badge-soft').textContent.trim()),
                price: Number(card.querySelector('.price').dataset.currentPrice),
                image: image.getAttribute('src'),
                description: specButton.dataset.desc || '',
                specs: (specButton.dataset.specs || '').split('|').filter(Boolean),
                tags
            });
        }
        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
        updateFavoriteButton(favoriteButton, favorites.some(car => car.id === carId));
    });
    buttonContainer.append(financeButton, favoriteButton);
    updateFavoriteButton(favoriteButton, isFavoriteForCurrentUser(card.dataset.carId));
});

// Indica si el coche ya está guardado por la cuenta activa.
function isFavoriteForCurrentUser(carId) {
    const sessionText = sessionStorage.getItem('deluxeCarsSession')
        || localStorage.getItem('deluxeCarsSession');
    if (!sessionText) {
        return false;
    }
    const session = JSON.parse(sessionText);
    if (!session || typeof session.email !== 'string') {
        return false;
    }
    const saved = localStorage.getItem('deluxeCarsFavorites:' + session.email.toLowerCase());
    const favorites = saved ? JSON.parse(saved) : [];
    return Array.isArray(favorites) && favorites.some(car => car.id === carId);
}

// Cambia el corazón y el texto accesible según el estado del favorito.
function updateFavoriteButton(button, isFavorite) {
    button.innerHTML = isFavorite ? '&#9829;' : '&#9825;';
    button.setAttribute('aria-label', isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos');
    button.setAttribute('title', isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos');
    button.setAttribute('aria-pressed', String(isFavorite));
}

// Calcula la cuota mensual y el total del coche seleccionado en el catálogo.
function calculateCarFinancing() {
    const downPayment = Number(financeDownPayment.value);
    const months = Number(financeMonths.value);
    const financedAmount = selectedCarPrice - downPayment;

    if (downPayment < 0 || downPayment >= selectedCarPrice) {
        financeError.textContent = 'ERROR';
        financeError.classList.remove('d-none');
        document.getElementById('financeMonthlyPayment').textContent = '0,00 €';
        document.getElementById('financeTotalPayment').textContent = '0,00 €';
        return;
    }

    financeError.classList.add('d-none');
    const monthlyRate = 0.095 / 12;
    const monthlyPayment = financedAmount * monthlyRate /
        (1 - Math.pow(1 + monthlyRate, -months));
    const totalPayment = monthlyPayment * months;

    document.getElementById('financeMonthlyPayment').textContent = euroFormatter.format(monthlyPayment);
    document.getElementById('financeTotalPayment').textContent = euroFormatter.format(totalPayment);
}

financeDownPayment.addEventListener('input', calculateCarFinancing);
financeMonths.addEventListener('change', calculateCarFinancing);

const specModal = document.getElementById('specModal');
// Muestra en la ventana la ficha del coche seleccionado.
specModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const title = button.dataset.title || '';
    const year = button.dataset.year || '';
    const desc = button.dataset.desc || '';
    const price = button.dataset.price || '';
    const img = button.dataset.img || 'https://source.unsplash.com/900x500/?car';
    const specs = (button.dataset.specs || '').split('|').filter(Boolean);
    const card = button.closest('.car-card');

    document.getElementById('specTitle').textContent = title;
    document.getElementById('specYear').textContent = year ? ('Año: ' + year) : '';
    document.getElementById('specPrice').textContent = price;
    document.getElementById('specDesc').textContent = desc;
    const specImage = document.getElementById('specImg');
    specImage.src = img;
    specImage.classList.toggle('seat-leon-fr-modal-image',
        card && card.dataset.carId === 'seat-leon-fr');

    const specList = document.getElementById('specList');
    specList.innerHTML = '';
    // Añade una línea a la lista por cada característica del coche.
    specs.forEach(function (item) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = item;
        specList.appendChild(li);
    });
});
