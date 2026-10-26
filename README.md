# GrowLab · Agencia de marketing digital

Web de una sola página hecha con **Astro 7**, **Tailwind CSS 4** y **GSAP** (ScrollTrigger) + **Lenis** (scroll suave) + **Three.js** (objeto 3D de partículas).

## Requisitos

- Node.js 22 o superior
- npm

## Comandos

| Comando           | Acción                                          |
| ----------------- | ----------------------------------------------- |
| `npm install`     | Instala las dependencias                        |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321`      |
| `npm run build`   | Genera el sitio estático en `./dist`            |
| `npm run preview` | Sirve la carpeta `dist` para revisarla en local |

## Estructura

```
growlabweb/
├── public/                  # archivos estáticos (favicon y logo.png)
├── src/
│   ├── components/          # Loader, Nav, Hero, Marquee, Manifesto, Services, Cta, Footer
│   ├── data/brainData.js    # mapa de densidad del cerebro 3D (silueta + surcos)
│   ├── layouts/Layout.astro # <head>, fuentes, SEO básico
│   ├── pages/index.astro    # la página (ensambla los componentes)
│   ├── scripts/
│   │   ├── main.js          # Lenis + carga + animaciones GSAP de cada sección
│   │   ├── hero3d.js        # sistema de partículas: esfera → galaxia → cerebro
│   │   └── loaderRain.js    # pantalla de carga con lluvia de líneas
│   └── styles/global.css    # Tailwind + tokens del tema (@theme)
├── astro.config.mjs         # plugin de Tailwind para Vite
└── package.json
```

## Cómo funciona el inicio (hero)

El hero queda **fijo** mientras haces scroll (`ScrollTrigger` con `pin`) y recorre tres etapas con un único sistema de partículas:

1. casi-esfera de puntos con el titular
2. galaxia espiral con anillos (titular y cifras centrados)
3. cerebro (la silueta sale de `brainData.js`)

Entre etapas las partículas se dispersan y se reorganizan. Los degradados del fondo (`[data-aurora]`) derivan solos y cambian con cada etapa.
Si el visitante tiene activado «reducir movimiento», se omiten las animaciones de scroll.

## Personalizar

- **Textos, cifras, servicios y casos:** edita los arrays al inicio de cada componente en `src/components/`.
- **Colores y tipografías:** `@theme` en `src/styles/global.css`.
- **Secuencia del hero (duración, orden, fondo):** `start()` al final de `src/scripts/hero3d.js`.
- **Correo de contacto:** `src/components/Cta.astro`.

## Subir a GitHub y desplegar en Vercel

```bash
git init
git add .
git commit -m "Primera versión"
git branch -M main
git remote add origin https://github.com/growlab-web/growlabweb.git
git push -u origin main
```

En [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repositorio.
Vercel detecta Astro automáticamente (comando `npm run build`, carpeta de salida `dist`); no hace falta configurar nada más.

## Publicación en growlab.pe (cPanel)

1. `npm run build` y subir **todo el contenido** de `dist/` a `public_html` (incluido el archivo oculto `.htaccess`).
2. **Formulario** (`public/api/contacto.php`): envía los leads a `hola.grow.lab@gmail.com` y los guarda en `growlab-leads/leads.csv`, una carpeta que se crea sola junto a `public_html` (no es accesible desde el navegador). Para que el correo no caiga en spam, crear la cuenta `web@growlab.pe` en cPanel y comprobar en «Email Deliverability» que SPF y DKIM estén correctos.
3. **Tag Manager**: poner el ID del contenedor en `src/data/site.js` (`gtm: 'GTM-XXXXXXX'`) y volver a generar. Con eso se cargan GTM y el aviso de cookies. GA4 y los píxeles se configuran dentro de GTM; los eventos que deja el sitio están descritos en `src/scripts/track.js`.
4. **Buscadores**: dar de alta `growlab.pe` en Google Search Console y enviar `https://growlab.pe/sitemap-index.xml`.
5. **Política de privacidad**: completar razón social, RUC y domicilio en `src/data/site.js` (`legal`) y revisar el texto de `src/pages/privacidad.astro` con asesoría legal.

## Identificadores para Google Tag Manager

Cada botón, enlace y formulario importante lleva un `id` estable (en español, con guiones) para usar las variables integradas
de GTM **Click ID**, **Click Classes**, **Click Element**, **Form ID** y **Form Element**. Al hacer clic, el elemento que recibe
el clic es siempre el botón o enlace (nunca su icono o texto interior), así que **Click ID** devuelve estos valores:

| Zona | ids |
|---|---|
| Menú | `menu-logo`, `menu-inicio`, `menu-servicios`, `menu-portafolio`, `menu-nosotros`, `menu-agendar`, `menu-movil-abrir`, `menu-movil-…` (mismos nombres), `menu-movil-agendar` |
| Inicio | `hero-agendar`, `servicios-anterior`, `servicios-siguiente` |
| WhatsApp | `whatsapp-boton` |
| Formulario | `form-contacto` (página de contacto) y `form-contacto-inicio` (inicio) como **Form ID**; `form-servicios`, `form-prefijo`, `form-enviar`, `form-privacidad`, `form-otro-mensaje`, `form-contacto-agendar` (botón a Calendly tras enviar), `juego-pong` |
| Diagnóstico gratuito (/diagnostico) | `form-diagnostico` como **Form ID**; `diagnostico-empezar`, `diagnostico-seguir-instagram`, `diagnostico-area-1…5`, `diagnostico-inversion`, `diagnostico-enviar`, `diagnostico-calendly-externo`, `diagnostico-pregunta-1…4` |
| Página de contacto | `contacto-correo`, `contacto-telefono`, `contacto-instagram`, `contacto-linkedin` |
| Nosotros | `nosotros-hablemos` |
| Portafolio | `portafolio-anterior`, `portafolio-siguiente`, `portafolio-destacados`, `portafolio-todos`, `portafolio-agendar`, `portafolio-nombre-<proyecto>`, `portafolio-ver-<proyecto>`, `portafolio-lista-<proyecto>` |
| Ficha de proyecto | `proyecto-anterior`, `proyecto-siguiente`, `proyecto-cerrar`, `proyecto-quiero-uno-asi`, `proyecto-ver-sitio` |
| Pie | `pie-logo`, `pie-correo`, `pie-telefono`, `pie-inicio`, `pie-servicios`, `pie-portafolio`, `pie-nosotros`, `pie-contacto`, `pie-proyecto-<proyecto>`, `pie-proyectos-todos`, `pie-instagram`, `pie-linkedin`, `pie-cookies`, `pie-privacidad`, `pie-desplegar-navegacion`, `pie-desplegar-proyectos`, `pie-desplegar-redes` |
| Aviso de cookies | `cookies-aceptar`, `cookies-solo-necesarias`, `cookies-mas-info` |
| Página 404 | `error-logo`, `error-inicio`, `error-avisar` |

Además, el menú y los botones llevan **clases de grupo** para la variable **Click Classes** (condición «contiene»), útiles
para un solo activador que cubra varios elementos:

| Clase | Dónde |
|---|---|
| `gtm-menu` | todos los enlaces del menú (logo, secciones, «Agendar reunión» y el desplegable móvil) |
| `gtm-menu-movil` | sólo los del desplegable del menú en móvil (y su botón de abrir) |
| `gtm-boton` | todos los botones del sitio |
| `gtm-agendar` | todos los botones que llevan a agendar una reunión (menú, hero, portafolio, «Quiero un proyecto así», «Hablemos») |
| `gtm-whatsapp` | el botón de WhatsApp |
| `gtm-enviar` | el botón «Enviar» del formulario |

`<proyecto>` es el identificador del proyecto (`relengcorp`, `alpaca-111`, `pacomarca`, `kuna`…).

El formulario se envía por código (no recarga la página), así que el activador «Envío de formulario» de GTM puede no
dispararse. Para medir leads, usa el evento personalizado `generate_lead`, que el sitio envía sólo cuando el envío sale bien.

## Blog

Los artículos están en `src/content/blog/` (un archivo Markdown por artículo) y sus imágenes en `public/images/blog/`.
El menú y el pie muestran «Blog» en cuanto hay al menos un artículo publicado; las categorías sin artículos no se muestran.
`plantilla-de-articulo.md` es un borrador de ejemplo con todos los formatos admitidos (no se publica).

**Escribir y publicar (sin tocar código):**
1. Entrar a [app.pagescms.org](https://app.pagescms.org) con la cuenta de GitHub y abrir el repositorio `growlab-web/growlabweb`.
2. «Blog» → «Add an entry»: título, dirección (slug), resumen, categoría, portada y el artículo con el editor.
3. Guardar. Pages CMS lo sube a GitHub y la acción «Publicar en growlab.pe» lo publica en unos minutos.
   Para guardar sin publicar, marcar «Borrador».

## Publicación automática (GitHub → cPanel)

`.github/workflows/publicar.yml` compila la web y sube por FTP a `public_html` sólo los archivos que cambiaron, cada vez que
llega un cambio a `main` (artículos del blog o cualquier modificación). Necesita los secretos `FTP_SERVER`, `FTP_USERNAME` y
`FTP_PASSWORD` en GitHub (Settings → Secrets and variables → Actions). Se puede relanzar a mano desde la pestaña «Actions».
La primera publicación sube toda la web; las siguientes, sólo las diferencias.

