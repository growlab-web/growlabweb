---
title: 'Search Console y la IA de Google: cómo ver tus impresiones en AI Overviews y si te conviene salir'
slug: search-console-ia-generativa-informe-control
description: 'Search Console ya muestra tus impresiones en AI Overviews y el Modo IA, y te deja excluir tu web. Qué mide el informe y cuándo tiene sentido salir.'
date: 2026-11-25
category: seo
cover: /images/blog/categorias/seo.jpg
coverAlt: 'Portada del blog de GrowLab sobre SEO'
author: GrowLab
tags: [Search Console, AI Overviews, Modo IA, SEO]
---

Hasta hace poco, saber si tu web aparecía en las respuestas de IA de Google era casi adivinar: buscabas tus palabras clave a mano y mirabas si salía tu enlace. Eso cambió. Google Search Console tiene ahora un **informe de rendimiento de IA generativa** y un **interruptor para excluir tu sitio** de los AI Overviews (resúmenes creados con IA), del Modo IA y de las funciones de IA de Discover.

Las dos herramientas se anunciaron el **3 de junio de 2026** y, según Google, desde el **31 de agosto de 2026** están disponibles para todos los sitios del mundo. En esta guía te explicamos qué mide el informe, cómo leerlo y por qué, para la mayoría de negocios, salir de la IA de Google no es buena idea.

## Qué anunció Google

Google presentó dos novedades a la vez:

- **Informes de rendimiento de IA generativa**: uno para la Búsqueda (AI Overviews y Modo IA) y otro para Discover. Muestran cuántas veces se mostró tu sitio en esas funciones.
- **Un control en la configuración** para decidir si tu sitio aparece en las funciones de IA generativa de la Búsqueda y si su contenido se usa para generar esas respuestas.

El contexto importa: Google indica que trabaja con reguladores como la **Autoridad de Competencia y Mercados del Reino Unido (CMA)**, que ese mismo día fijó una obligación para que los sitios puedan salir de estas funciones sin ser penalizados en los resultados normales. Google cifra los usuarios de AI Overviews en **más de 2500 millones al mes** y los del Modo IA en **más de 1000 millones**, así que no es una vitrina menor.

## Cómo encontrar el informe y qué te muestra

Entra en Search Console y busca en **Rendimiento** el informe de IA generativa de la Búsqueda. Si tu sitio todavía no tiene suficientes impresiones en estas funciones, Google advierte que **puede que el informe no aparezca**.

| Qué ofrece | Detalle |
| --- | --- |
| Métrica | Solo **impresiones**: cuántas veces se mostraron enlaces a tu sitio en una función de IA |
| Funciones incluidas | AI Overviews y Modo IA (no incluye experimentos de Search Labs) |
| Desgloses | Páginas, países, fechas y dispositivos |
| Tipo de búsqueda | Texto normal o multimodal (Google Lens, Rodea para buscar, búsqueda por imagen) |
| Lo que no trae | **Clics** ni consultas |

Dos detalles para leerlo bien:

- Si tu sitio sale varias veces en la misma respuesta de IA, **cuenta como una sola impresión**. Por eso los totales del gráfico y de la tabla por página pueden no coincidir.
- Estas impresiones **también están dentro del informe de rendimiento general**. El nuevo informe no suma tráfico extra: te permite aislar la parte que viene de la IA.

### Qué preguntas te ayuda a responder

1. **¿Qué páginas usa Google en sus respuestas de IA?** Suelen ser guías, preguntas frecuentes y páginas que explican algo con claridad.
2. **¿En qué países?** Útil si vendes fuera del Perú o si atiendes a varios mercados de Latinoamérica.
3. **¿Desde qué dispositivo?** Si casi todo es móvil, revisa cómo se ve y carga esa página en el celular.
4. **¿Cambió algo tras una actualización?** Compara semanas antes y después, por ejemplo tras el [core update de noviembre](/blog/core-update-noviembre-2026-contenido-ia).

Como el informe no da clics, crúzalo con Google Analytics 4: el tráfico que llega desde Google sigue apareciendo como búsqueda orgánica, y el que llega desde chatbots como ChatGPT lo puedes ver con el [canal AI Assistant de GA4](/blog/trafico-ia-chatgpt-ga4).

## El interruptor para salir de la IA de Google

Está en **Configuración > IA generativa de la Búsqueda**, y solo lo pueden cambiar los **propietarios** de la propiedad. Tiene tres opciones: **incluir** tu sitio (la opción por defecto), **excluirlo** o, en propiedades secundarias, **heredar** la configuración de la propiedad principal.

Lo que hace y lo que no hace, según la ayuda de Google:

| Si excluyes tu sitio… | Detalle |
| --- | --- |
| Sales de | AI Overviews, Modo IA y funciones de IA generativa de Discover |
| Pierdes | Todo el tráfico y las impresiones que vengan de esas funciones |
| No afecta | Tu posicionamiento en los resultados normales: Google dice que **no es una señal de ranking** |
| No afecta | Tus opciones en Merchant Center y Google Ads |
| No controla | El uso de tu contenido para **entrenar** modelos de IA (eso se gestiona con Google-Extended) |
| No sirve para | Quitar tu web de Google por completo (para eso está `noindex`) |
| Tiempo | Los cambios suelen tardar unos días; el contenido debería quedar fuera en 1 o 2 días desde que el cambio se activa |

Google también aclara que, aunque salgas, **el contenido de otros sitios puede seguir apareciendo** y parecerse al tuyo. Es decir, salir no impide que la IA responda sobre tu tema: solo te quita a ti de la respuesta.

## ¿Te conviene salir? Casi siempre, no

Para una pyme, una tienda online o un negocio de servicios, aparecer en una respuesta de IA es visibilidad gratuita justo cuando alguien está investigando qué comprar o a quién contratar. Salir significa renunciar a esas impresiones sin ganar puestos en los resultados normales.

Puede tener sentido pensarlo si:

- Tu negocio **vende el contenido** (un medio con suscripción, cursos, informes de pago) y te preocupa que la IA lo resuma.
- Tienes datos que muestran que esas impresiones **no te traen clientes** y prefieres que la gente llegue directo a tu web.

Incluso en esos casos, Google recomienda **mirar primero el informe** para medir cuánto te juegas. Y si tu duda es el entrenamiento de modelos de IA, recuerda que este interruptor no lo controla.

## Checklist para esta semana

1. Entra en Search Console y revisa si ya ves el informe de IA generativa.
2. Anota tus **10 páginas con más impresiones en IA** y los países de donde vienen.
3. Mejora esas páginas: información propia (precios, experiencia, casos), estructura clara con subtítulos y buenas imágenes, que es lo que Google pide en su guía para estas funciones.
4. Comprueba en **Configuración** que tu sitio sigue en «incluir» y quién tiene acceso como propietario.
5. Compara cada mes impresiones en IA con tráfico orgánico y conversiones en GA4.

## En resumen

Search Console ya te dice cuántas veces apareces en los AI Overviews y en el Modo IA, por página, país y dispositivo, aunque todavía sin clics. También te deja salir de esas funciones, pero eso no mejora tu posicionamiento normal y te quita visibilidad. Para la mayoría de negocios, lo útil es usar el informe para entender qué contenido valora la IA de Google y reforzarlo, como te contamos al hablar del [Modo IA en el Perú](/blog/modo-ia-google-peru-seo).

**Fuentes:** [Google: nuevas oportunidades, control y estadísticas para propietarios de sitios web](https://blog.google/products-and-platforms/products/search/new-opportunities-control-and-insights-for-website-owners/) · [Google Search Central: informes de rendimiento de IA generativa](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) · [Ayuda de Search Console: control de IA generativa de la Búsqueda](https://support.google.com/webmasters/answer/16908024) · [Ayuda de Search Console: informe de rendimiento de IA generativa](https://support.google.com/webmasters/answer/16984139) · [Search Engine Journal: los informes de IA de Search Console llegan a todo el mundo](https://www.searchenginejournal.com/google-search-console-ai-reports-rolled-out-worldwide/587836)
