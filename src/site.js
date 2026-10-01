const pages = [
    ['index.html', 'Inicio'],
    ['modelos.html', 'Catálogo'],
    ['favoritos.html', 'Favoritos'],
    ['financiacion.html', 'Financiación'],
    ['contacto.html', 'Contacto'],
    ['acceso.html', 'Acceso']
];
const currentPage = location.pathname.split('/').pop() || 'index.html';
const navigation = pages.map(([href, label]) =>
    `<li class="nav-item"><a class="nav-link${currentPage === href ? ' active' : ''}" href="${href}"${currentPage === href ? ' aria-current="page"' : ''}>${label}</a></li>`
).join('');

document.body.insertAdjacentHTML('afterbegin', `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.html">Deluxe Cars</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain"
                    aria-controls="navMain" aria-expanded="false" aria-label="Abrir navegación">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navMain">
                <ul class="navbar-nav ms-auto gap-2">${navigation}</ul>
            </div>
        </div>
    </nav>`);

document.body.insertAdjacentHTML('beforeend', `
    <footer class="bg-dark text-light mt-5 py-3">
        <div class="container">
            <div class="row gy-2 align-items-start small">
                <div class="col-md-4">
                    <h6 class="mb-1 fw-bold">Deluxe Cars</h6>
                    <div class="text-light-emphasis">Tu próximo coche empieza aquí.</div>
                </div>
                <div class="col-md-4">
                    <h6 class="mb-1 fw-bold">Información</h6>
                    <div class="text-light-emphasis">📍 Avenida San Crispin, 45510 Toledo</div>
                    <div class="text-light-emphasis">📞 +34 000 000 000</div>
                    <div class="text-light-emphasis">✉️ prueba@concesionario.com</div>
                </div>
                <div class="col-md-4 text-md-end">
                    <h6 class="mb-1 fw-bold">Legal</h6>
                    <div><a href="contacto.html" class="text-light text-decoration-none">Contacto</a></div>
                    <div><a href="politica-privacidad.html" class="text-light text-decoration-none">Política de privacidad</a></div>
                </div>
            </div>
            <div class="border-top border-secondary text-center text-light-emphasis mt-3 pt-2 small">
                © 2026 Deluxe Cars. Todos los derechos reservados.
            </div>
        </div>
    </footer>`);
