# Deluxe Cars

Sitio web de un concesionario creado con HTML, CSS, JavaScript y Bootstrap.

## Ejecutar el proyecto

Desde la carpeta del proyecto, ejecuta `python -m http.server 8000` y abre `http://localhost:8000/src/index.html` en un navegador actual. También puedes abrir los HTML de `src` directamente, pero el registro de cuentas requiere un contexto seguro (`localhost` o HTTPS).

Bootstrap está incluido en `css` y `js`; no hace falta cargarlo desde Internet. Algunas fotos del catálogo sí usan direcciones externas y necesitan conexión.

## Estructura

- `src/index.html`: portada y coches destacados.
- `src/modelos.html`: catálogo, filtros, fichas, favoritos y simulador rápido.
- `src/acceso.html`: registro e inicio de sesión para usuarios.
- `src/admin.html`: acceso independiente y herramientas de administración del catálogo y los coches destacados.
- `src/financiacion.html`: calculadora de cuotas.
- `src/contacto.html`, `src/favoritos.html` y `src/politica-privacidad.html`: contacto, favoritos y política.
- Cada página tiene su propio archivo CSS (`src/index.css`, `src/modelos.css`, `src/admin.css`, etc.) para mantener separados sus estilos.
- `src/site.css` y `src/site.js`: estilos y navegación comunes, incluido el pie de página.
- `src/catalog-data.js`: datos iniciales del catálogo compartidos por la portada, el catálogo y el panel de administración.
- Cada página con comportamiento tiene su JavaScript externo (`src/index.js`, `src/modelos.js`, `src/acceso.js`, etc.); así el HTML contiene la estructura y carga los recursos en orden.
- `src/watermark.js`: añade la marca de agua a las imágenes de la portada, el catálogo y favoritos.
- Las plantillas `<template>` de la portada, el catálogo y favoritos dejan el HTML de las tarjetas en HTML; JavaScript solo rellena los datos.
- `src/img`: logotipo y fotografías locales; `css` y `js` contienen Bootstrap.

La interfaz usa HTML, CSS, JavaScript nativo y Bootstrap local. No necesita jQuery: las interacciones y componentes se implementan con las API del navegador y Bootstrap.

## JavaScript por pestaña

Todas las páginas cargan Bootstrap para los componentes interactivos del menú y `site.js` para crear la navegación y el pie comunes. Los estilos están en CSS externos; cada página carga únicamente el JavaScript que necesita:

| Página | Lógica |
| --- | --- |
| `index.html` | `catalog-data.js` aporta los coches; `watermark.js` marca sus imágenes; `index.js` actualiza los coches destacados y sus precios y rellena las ventanas de detalles y ficha técnica. |
| `modelos.html` | `watermark.js` marca las imágenes; `modelos.js` filtra y dibuja el catálogo, aplica los cambios guardados por administración, gestiona favoritos y calcula financiación. |
| `acceso.html` | `acceso.js` gestiona registro e inicio/cierre de sesión de los usuarios. |
| `admin.html` | `catalog-data.js` aporta el catálogo inicial; `admin.js` gestiona el acceso de administrador y sus herramientas. |
| `favoritos.html` | `watermark.js` marca las imágenes; `favoritos.js` muestra, elimina y actualiza los favoritos de la cuenta activa. |
| `financiacion.html` | `financiacion.js` valida los datos y calcula la cuota, los intereses y el total. |
| `contacto.html` | `contacto.js` limita el teléfono a números y valida el formulario de demostración; no envía datos a un servidor. |
| `politica-privacidad.html` | No necesita lógica propia; usa únicamente Bootstrap y los elementos comunes del sitio. |

Cada función de JavaScript está acompañada de un comentario breve que explica su responsabilidad. El código de página vive en archivos externos, y los estilos compartidos se centralizan en `site.css` para evitar repetir las mismas reglas en cada pestaña.

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
