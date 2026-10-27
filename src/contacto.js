// Validación del formulario de contacto de demostración.
const contactForm = document.getElementById('contactForm');
const contactFeedback = document.getElementById('contactFeedback');
const telefono = document.getElementById('telefono');

// Mantiene solo los números en el campo de teléfono.
telefono.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
});

// Muestra la confirmación; este formulario de demostración no envía datos.
contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    contactFeedback.textContent = 'Formulario validado. Esta demostración no envía datos a un servidor.';
    contactFeedback.classList.remove('d-none');
    contactForm.reset();
});
