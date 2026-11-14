---
title: 'Tráfico de ChatGPT y otras IA en GA4: cómo verlo con el canal AI Assistant'
slug: trafico-ia-chatgpt-ga4
description: 'GA4 ya separa las visitas que llegan desde ChatGPT, Gemini y otras IA en el canal AI Assistant. Te explicamos cómo verlas, qué no mide y cómo completarlo.'
date: 2026-11-14
category: tracking-analitica
cover: /images/blog/categorias/tracking-analitica.jpg
coverAlt: 'Portada del blog de GrowLab sobre tracking y analítica'
author: GrowLab
tags: [GA4, Google Analytics, ChatGPT, búsqueda con IA, canales]
---

Cada vez más personas preguntan a ChatGPT, Gemini o Copilot qué producto comprar o qué agencia contratar, y algunas terminan haciendo clic hacia tu web. Hasta hace poco, en Google Analytics 4 esas visitas quedaban mezcladas con el resto de **Referencias** (*Referral*), y había que crear un canal personalizado para separarlas.

Desde el **13 de mayo de 2026**, GA4 lo hace solo: añadió el canal **AI Assistant** a su agrupación de canales predeterminada. En esta guía te contamos dónde verlo, qué tráfico entra (y cuál no) y cómo completarlo para medir mejor el impacto de la IA en tu negocio.

## Qué es el canal AI Assistant

Según la página de novedades de Google Analytics, GA4 mide ahora el tráfico que llega desde asistentes de IA como **ChatGPT, Gemini o Claude** en un canal propio. No tienes que configurar nada: el cambio se aplica automáticamente a todas las propiedades.

Cuando el sitio de referencia de una visita coincide con un asistente de IA reconocido, GA4 cambia tres valores:

| Dimensión | Valor que asigna GA4 |
| --- | --- |
| Medio | `ai-assistant` |
| Campaña | `(ai-assistant)` |
| Agrupación de canales predeterminada | AI Assistant |

En la documentación de la agrupación de canales predeterminada, Google cita como ejemplos **ChatGPT, Gemini, DeepSeek, Copilot y Grok**, pero no publica la lista completa de asistentes reconocidos. Ofrece una hoja de cálculo con las fuentes y categorías que usa GA4 y permite pedir que se añadan nuevas.

## Dónde verlo en tus informes

1. Entra en **Informes › Adquisición › Adquisición de tráfico**.
2. Comprueba que la dimensión principal sea **Grupo de canales predeterminado de la sesión**.
3. Busca la fila **AI Assistant** (la interfaz puede mostrar el nombre traducido).
4. Para saber qué asistente te envía más visitas, cambia la dimensión a **Fuente / medio de la sesión** y filtra por el medio `ai-assistant`.
5. Añade tus eventos clave (formularios, compras, clics a WhatsApp) para ver si ese tráfico, además de llegar, **convierte**.

Un consejo: compara el canal AI Assistant con **Búsqueda orgánica** en el mismo periodo. Las visitas que llegan desde una IA suelen ser pocas, pero la persona ya viene con una recomendación concreta, así que vale la pena revisar su tasa de conversión y no solo el volumen.

## Lo que este canal no mide

El canal es útil, pero no cuenta todo el tráfico relacionado con la IA. Tenlo en cuenta antes de sacar conclusiones:

- **Visitas sin referencia:** según Search Engine Journal, el tráfico de asistentes de IA que llega sin cabecera de referencia sigue apareciendo como **Directo**. Pasa, por ejemplo, con navegadores dentro de apps, aplicaciones móviles o enlaces copiados y pegados.
- **Las funciones de IA de Google:** la documentación de Google aclara que las **Vistas generales creadas con IA** (*AI Overviews*) y el **Modo IA** no forman parte de este canal. Ese tráfico se sigue contando dentro de la búsqueda de Google. Si quieres saber cómo adaptar tu web a ese cambio, revisa nuestro artículo sobre [el Modo IA de Google en Perú](/blog/modo-ia-google-peru-seo).
- **Asistentes no reconocidos:** si una IA no está en la lista de Google, sus visitas seguirán en **Referencias** hasta que GA4 la incorpore.
- **Menciones sin clic:** que una IA recomiende tu marca sin que la persona haga clic no deja rastro en GA4.

## Cómo completarlo con un canal personalizado

Si quieres controlar exactamente qué fuentes cuentan como IA (por ejemplo, para incluir a un asistente que GA4 aún no reconoce), puedes crear una **agrupación de canales personalizada**:

1. Ve a **Administrar › Visualización de datos › Grupos de canales**.
2. Crea un grupo nuevo **copiando el grupo predeterminado**.
3. Añade un canal (por ejemplo, «IA») con la condición de que la fuente de la sesión coincida con los dominios de los asistentes que te interesan.
4. **Ordena los canales:** GA4 asigna cada visita al primer canal cuyas condiciones cumple, así que el canal de IA debe ir **antes de Referencias**.
5. Guarda el grupo y úsalo como dimensión en Adquisición de tráfico o en Exploraciones.

Ten en cuenta los límites: una propiedad estándar admite **2 grupos de canales personalizados** (5 en GA4 360), con hasta **50 canales** cada uno. Necesitas permiso de **Editor** o superior, y la ventaja es que estos grupos **se aplican también a los datos históricos**.

## Qué hacer con estos datos

- **Revisa las páginas de destino** del tráfico de IA: te dicen qué contenido citan los asistentes y qué preguntas resuelve tu web.
- **Mide conversiones, no solo visitas.** Marca como evento clave lo que de verdad importa (formularios, compras, clics a WhatsApp).
- **No compares cifras sin contexto:** las herramientas de anuncios y GA4 atribuyen de forma distinta. Si te pasa, lee nuestra guía sobre [ventanas de atribución en GA4, Meta y Google Ads](/blog/ventanas-atribucion-ga4-meta-google-ads).
- **Revisa la tendencia cada mes**, no día a día: con volúmenes bajos, un par de visitas cambia mucho los porcentajes.

## En resumen

El canal AI Assistant de GA4 te muestra, sin configurar nada, cuántas visitas llegan desde ChatGPT, Gemini y otros asistentes de IA, y si convierten. No mide todo: el tráfico sin referencia queda como Directo y las funciones de IA de Google siguen dentro de la búsqueda orgánica. Úsalo como punto de partida y, si necesitas más control, complétalo con un grupo de canales personalizado.

**Fuentes:** [Novedades de Google Analytics (13 de mayo de 2026)](https://support.google.com/analytics/answer/9164320?hl=es) · [Ayuda de Analytics: agrupación de canales predeterminada](https://support.google.com/analytics/answer/9756891?hl=es) · [Ayuda de Analytics: grupos de canales personalizados](https://support.google.com/analytics/answer/13051316?hl=es) · [Search Engine Journal: Google Analytics añade el canal AI Assistant](https://www.searchenginejournal.com/google-analytics-adds-ai-assistant-as-default-channel-group/574974/)
