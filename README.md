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
│   ├── components/          # Loader, Nav, Hero, Marquee, Manifesto, Services, Cases, Process, Cta, Footer
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

