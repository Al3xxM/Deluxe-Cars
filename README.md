# Deluxe Cars

Sitio web de un concesionario creado con HTML, CSS, JavaScript y Bootstrap.

## Ejecutar el proyecto

Desde la carpeta del proyecto, ejecuta `python -m http.server 8000` y abre `http://localhost:8000/src/index.html` en un navegador actual. También puedes abrir los HTML de `src` directamente, pero el registro de cuentas requiere un contexto seguro (`localhost` o HTTPS).

Bootstrap está incluido en `css` y `js`; no hace falta cargarlo desde Internet. Algunas fotos del catálogo sí usan direcciones externas y necesitan conexión.

## Estructura

- `src/index.html`: portada y coches destacados.
- `src/modelos.html`: catálogo, filtros, fichas, favoritos y simulador rápido.
- `src/acceso.html`: registro, inicio de sesión y gestión de demostración del catálogo.
- `src/financiacion.html`: calculadora de cuotas.
- `src/contacto.html`, `src/favoritos.html` y `src/politica-privacidad.html`: contacto, favoritos y política.
- `src/site.css` y `src/site.js`: estilos compartidos, menú y pie de página.
- `src/catalog-data.js`: datos iniciales compartidos por la portada y el panel de administración.
- `src/watermark.js`: añade la marca de agua a las imágenes de la portada, el catálogo y favoritos.
- Las plantillas `<template>` de la portada, el catálogo y favoritos dejan el HTML de las tarjetas en HTML; JavaScript solo rellena los datos.
- `src/img`: logotipo y fotografías locales; `css` y `js` contienen Bootstrap.

## JavaScript por pestaña

Todas las páginas cargan Bootstrap para los componentes interactivos del menú y `site.js` para crear la navegación y el pie comunes. Cada página carga además solo la lógica que necesita:

| Página | Lógica |
| --- | --- |
| `index.html` | `catalog-data.js` aporta los coches; `watermark.js` marca sus imágenes; el código de la página actualiza los coches destacados y sus precios y rellena las ventanas de detalles y ficha técnica. |
| `modelos.html` | `watermark.js` marca las imágenes; el código de la página filtra y dibuja el catálogo, aplica los cambios guardados por administración, gestiona favoritos y calcula financiación. |
| `acceso.html` | `catalog-data.js` aporta el catálogo inicial; el código de la página gestiona registro, inicio/cierre de sesión y las herramientas de demostración del administrador. |
| `favoritos.html` | `watermark.js` marca las imágenes; el código de la página muestra, elimina y actualiza los favoritos de la cuenta activa. |
| `financiacion.html` | El código de la página valida los datos y calcula la cuota, los intereses y el total. |
| `contacto.html` | El código de la página limita el teléfono a números y valida el formulario de demostración; no envía datos a un servidor. |
| `politica-privacidad.html` | No necesita lógica propia; usa únicamente Bootstrap y los elementos comunes del sitio. |

Los scripts de cada página implementan esas funciones; no se ha quitado lógica necesaria para mantenerlas operativas.

## Funciones para comprobar

1. Filtra el catálogo por texto, año y marca; abre una ficha y calcula la financiación de un coche.
2. Registra una cuenta desde `localhost`, inicia sesión y guarda un coche como favorito.
3. Prueba el formulario de financiación con distintos plazos y entradas, y valida el formulario de contacto.

La web es una demostración de cliente: las cuentas, favoritos y cambios del catálogo se guardan en el navegador; el formulario de contacto solo valida los datos y no los envía a un servidor. El acceso de administrador es de demostración y no es seguro para producción.

## Trabajo con Git

La rama de trabajo es `develop`. Después de clonar el repositorio, puedes guardar y subir cambios con:

```bash
git switch develop
git add .
git commit -m "Describe el cambio"
git push origin develop
```

La carpeta `.idea` se excluye porque contiene preferencias locales del IDE.
