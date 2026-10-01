(function () {
    function addWatermark(image) {
        if (image.parentElement.classList.contains('dealer-watermark')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'dealer-watermark';
        image.parentNode.insertBefore(wrapper, image);
        wrapper.appendChild(image);

        const label = document.createElement('span');
        label.className = 'dealer-watermark__label';
        label.textContent = 'DELUXE CARS';
        wrapper.appendChild(label);
    }

    function scanImages(root) {
        if (root instanceof Element && root.matches('.card-img-top, #modalImg, #specImg')) {
            addWatermark(root);
        }
        if (root.querySelectorAll) {
            root.querySelectorAll('.card-img-top, #modalImg, #specImg').forEach(addWatermark);
        }
    }

    scanImages(document);
    new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(scanImages);
        });
    }).observe(document.body, { childList: true, subtree: true });
})();
