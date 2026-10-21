// Añade la marca de agua a las imágenes dentro del elemento indicado.
function addWatermarks(root) {
    var images = root.querySelectorAll('.card-img-top, #modalImg, #specImg');

    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        if (image.parentElement.classList.contains('dealer-watermark')) continue;

        var wrapper = document.createElement('div');
        wrapper.className = 'dealer-watermark';
        image.parentNode.insertBefore(wrapper, image);
        wrapper.appendChild(image);

        var label = document.createElement('span');
        label.className = 'dealer-watermark__label';
        label.textContent = 'DELUXE CARS';
        wrapper.appendChild(label);
    }
}

// Marca las imágenes que ya están en la página al cargarla.
addWatermarks(document);
