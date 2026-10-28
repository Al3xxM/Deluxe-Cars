// Páginas que aparecen en el menú común del sitio.
const pages = [
['index.html', 'Inicio'],
['modelos.html', 'Catálogo'],
['favoritos.html', 'Favoritos'],
['financiacion.html', 'Financiación'],
['contacto.html', 'Contacto'],
['acceso.html', 'Acceso'],
['admin.html', 'Administración']
];
const currentPage = location.pathname.split('/').pop() || 'index.html';
// Crea los enlaces y marca como activa la página que se está visitando.
const navigation = pages.map(([href, label]) =>
`<li class="nav-item"><a class="nav-link${currentPage === href ? ' active' : ''}" href="${href}"${currentPage === href ? ' aria-current="page"' : ''}>${label}</a></li>`
).join('');

document.body.insertAdjacentHTML('afterbegin', `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand fw-bold d-inline-flex align-items-center gap-2" href="index.html">
            <img src="img/LogoDC.png" alt="" width="32" height="32">
            <span>Deluxe Cars</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain"
                aria-controls="navMain" aria-expanded="false" aria-label="Abrir navegación">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMain">
            <ul class="navbar-nav ms-auto gap-2">${navigation}</ul>
        </div>
    </div>
</nav>`);

// Genera el pie común con navegación, información de contacto y enlaces legales.
document.body.insertAdjacentHTML('beforeend', `
<footer class="site-footer mt-5">
    <div class="container py-4">
        <div class="row gy-3 align-items-start">
            <div class="col-lg-4">
                <a class="footer-brand d-inline-flex align-items-center gap-2 text-decoration-none mb-2"
                   href="index.html">
                    <img src="img/LogoDC.png" alt="" width="36" height="36">
                    <span class="fs-6 fw-bold">Deluxe Cars</span>
                </a>
                <p class="footer-muted mb-0">Tu próximo coche empieza aquí. Descubre, compara y encuentra el modelo que va contigo.</p>
            </div>
            <div class="col-6 col-lg-3">
                <h2 class="footer-heading">Explora</h2>
                <ul class="footer-links list-unstyled mb-0">
                    <li><a href="modelos.html">Catálogo de coches</a></li>
                    <li><a href="financiacion.html">Financiación</a></li>
                    <li><a href="favoritos.html">Mis favoritos</a></li>
                </ul>
            </div>
            <div class="col-6 col-lg-2">
                <h2 class="footer-heading">Ayuda</h2>
                <ul class="footer-links list-unstyled mb-0">
                    <li><a href="contacto.html">Contacto</a></li>
                    <li><a href="acceso.html">Acceso</a></li>
                    <li><a href="politica-privacidad.html">Privacidad</a></li>
                </ul>
            </div>
            <div class="col-lg-3">
                <h2 class="footer-heading">Visítanos</h2>
                <address class="footer-muted mb-0">
                    Avenida San Crispin<br>
                    45510 Toledo<br>
                    <a href="tel:+340000000000">+34 000 000 000</a><br>
                    <a href="mailto:prueba@concesionario.com">prueba@concesionario.com</a>
                </address>
            </div>
        </div>
        <div class="footer-bottom mt-3 pt-2 d-flex flex-column flex-sm-row justify-content-between gap-2 small">
            <span>© 2026 Deluxe Cars. Todos los derechos reservados.</span>
            <span>Una experiencia pensada para encontrar tu próximo coche.</span>
        </div>
    </div>
</footer>`);
