---
title: 'Ask Advisor: el agente de IA de Google Ads y Analytics, qué hace y cómo usarlo'
slug: ask-advisor-google-ads-analytics
description: 'Ask Advisor es el agente de IA de Google para Ads y Analytics: qué puede hacer, qué cuentas lo tienen, cómo trata tus datos y cómo usarlo sin perder el control.'
date: 2026-11-05
category: ia-automatizacion
cover: /images/blog/categorias/ia-automatizacion.jpg
coverAlt: 'Portada del blog de GrowLab sobre inteligencia artificial y automatización'
author: GrowLab
tags: [Ask Advisor, Google Ads, Google Analytics, inteligencia artificial, Gemini]
---

Google quiere que dejes de saltar entre pestañas para entender tus campañas. Su respuesta es **Ask Advisor**, un agente de IA basado en Gemini que vive dentro de Google Ads y Google Analytics y al que le puedes preguntar, en lenguaje natural, qué pasó con tus ventas, por qué subió el costo o qué deberías cambiar.

Todavía está en beta y no todas las cuentas lo ven, pero conviene entender ya qué hace, qué no hace y cómo usarlo sin ceder el control de tus campañas. Te lo resumimos a partir de la documentación oficial de Google.

## Qué es Ask Advisor

Google lo presentó el **20 de mayo de 2026** como un agente «multiproducto» que une tus herramientas de marketing en una sola experiencia. Google Ads, Google Analytics y Google Marketing Platform ya tenían sus propios agentes, y Ask Advisor los coordina; Google anunció que un agente de **Merchant Center** se sumará más adelante.

La idea es que puedas pedir algo como «encuentra nuevos clientes para mis productos» y que el agente use la información de tus productos y de tus datos para proponerte una campaña, explicarte qué funcionó y sugerir los siguientes pasos.

El **10 de agosto de 2026**, Google añadió nuevas funciones:

- **Resúmenes con IA en la página principal de Analytics**, con lo que cambió desde tu último acceso (picos de ventas, cambios de tráfico) y la opción de recibir avisos por correo o en el teléfono.
- **Tarjetas de estadísticas con IA en la página principal de Google Ads**, con un cuadro para pedir un análisis a medida.
- **Paneles (dashboards) creados con texto** en Google Ads, con un resumen que explica el «porqué» de los datos; Google dice que llegarán pronto a Analytics.
- **Comparativas (benchmarking) en Analytics**: tus resultados frente a promedios anónimos de empresas similares.

## Qué puede hacer en cada herramienta

| | Google Ads | Google Analytics |
| --- | --- | --- |
| Informes | Genera informes y explica cambios en el rendimiento | Responde preguntas generales y detalladas sobre métricas, dimensiones y eventos |
| Diagnóstico | Ayuda con problemas de rendimiento, políticas, facturación y verificación de identidad | Explica el «porqué» de los cambios en el rendimiento |
| Recomendaciones | Sugiere optimizaciones, textos, imágenes, palabras clave e ideas de campañas | Sugiere optimizaciones y próximos pasos |
| Acciones | Puede modificar la configuración de campañas individuales **con tu aprobación** | Guía paso a paso para usar funciones y consulta datos de configuración (ID de medición, flujos de datos) |

Se abre desde el ícono de Ask Advisor en la esquina superior derecha de la cuenta o escribiendo tu pregunta en la barra de búsqueda. En Analytics también puedes lanzarlo desde las tarjetas de los gráficos, que proponen preguntas sugeridas.

## ¿Ya lo puedo usar en mi cuenta?

Depende, y aquí está el detalle importante para negocios en el Perú y Latinoamérica:

- Es una **beta** y solo aparece si tu cuenta es apta.
- Google indica que la beta está disponible para **cuentas en inglés**. En Analytics, la ayuda oficial precisa que funciona en las **propiedades que tienen el inglés como idioma seleccionado**, y que se prevé ampliar a otros idiomas.
- En Google Ads **no está disponible en cuentas de administrador (MCC)**: debes entrar a la cuenta del anunciante.

Si no ves el ícono, no es un error de configuración: simplemente aún no llegó a tu cuenta.

## Qué pasa con tus datos

Es la pregunta que más nos hacen. Según la ayuda de Google Analytics:

- Las preguntas y respuestas **no se usan para entrenar, ajustar ni evaluar modelos de IA**.
- El historial de chat se guarda **55 días** y luego se elimina.
- Las respuestas sobre tus datos salen **solo de la propiedad** que tienes abierta; no se mezclan datos entre propiedades.

Aun así, sigue aplicando la regla de siempre: GA4 **no permite recopilar datos personales identificables** (nombres, correos, teléfonos), así que no los envíes en tus eventos.

## Cómo usarlo sin perder el control

Google advierte que Ask Advisor **puede tener limitaciones y cometer errores**, y que eres tú quien mantiene el control sobre lo que genera. Estas prácticas te ayudan a sacarle provecho con seguridad:

1. **Primero arregla tu medición.** Un agente que analiza datos incompletos o duplicados te dará conclusiones equivocadas con mucha seguridad. Revisa que tus conversiones estén bien configuradas; si dudas, mira nuestra guía sobre [ventanas de atribución en GA4, Meta y Google Ads](/blog/ventanas-atribucion-ga4-meta-google-ads).
2. **Haz preguntas concretas.** «¿Por qué bajaron las conversiones de la campaña de búsqueda la semana pasada frente a la anterior?» funciona mejor que «¿cómo voy?».
3. **Verifica los números en el informe original.** Usa la respuesta como pista y confirma en el informe estándar antes de decidir presupuestos.
4. **Aprueba los cambios uno por uno.** Que el agente pueda modificar campañas con tu aprobación no significa que debas aceptar todo: revisa presupuestos, pujas y segmentación.
5. **Revisa los textos e imágenes sugeridos** con tu tono de marca y las normas publicitarias antes de publicarlos.
6. **Consulta lo crítico en la configuración.** Google indica que la facturación, la verificación de identidad y el resultado de apelaciones deben revisarse directamente en la configuración de la cuenta.

Si quieres ver otro ejemplo de IA conectada a tus herramientas, en el blog contamos [cómo conectar Shopify con Claude](/blog/claude-shopify-conector).

## En resumen

Ask Advisor convierte Google Ads y Analytics en algo a lo que se le puede «preguntar»: explica cambios, propone mejoras y, con tu aprobación, aplica ajustes. Por ahora es una beta para cuentas en inglés, así que no todos lo verán todavía. Cuando llegue a tu cuenta, úsalo como un analista rápido, no como el piloto automático: con datos bien medidos, preguntas claras y revisando cada cambio antes de aceptarlo.

**Fuentes:** [Google: presentación de Ask Advisor](https://blog.google/products/ads-commerce/ask-advisor/) · [Google: nuevas herramientas de IA en Google Ads y Analytics](https://blog.google/products/ads-commerce/google-ads-analytics-ai-updates/) · [Ayuda de Google Ads: Ask Advisor (beta)](https://support.google.com/google-ads/answer/16574983?hl=es-419) · [Ayuda de Analytics: Ask Advisor en Google Analytics (beta)](https://support.google.com/analytics/answer/16675569?hl=es-419) · [Ayuda de Analytics: cómo usa los datos Ask Advisor](https://support.google.com/analytics/answer/17233723?hl=en)
