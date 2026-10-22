---
title: 'Ventanas de atribución: por qué GA4 no muestra las mismas conversiones que Meta y Google Ads'
slug: ventanas-atribucion-ga4-meta-google-ads
description: 'Meta, Google Ads y GA4 casi nunca coinciden en conversiones. Qué son las ventanas de atribución, cuáles usa cada plataforma y cómo leer bien tus números.'
date: 2026-10-20
category: tracking-analitica
cover: /images/blog/ventanas-atribucion-ga4-meta-google-ads.jpg
coverAlt: 'Portada del blog de GrowLab sobre tracking y analítica'
author: GrowLab
tags: [GA4, Meta Ads, Google Ads, atribución, analítica]
---

Es una de las preguntas que más nos hacen: *«Meta dice que vendí 40, Google Ads dice 35 y GA4 dice 28. ¿Cuál es el número real?»*. La respuesta corta: **ninguna plataforma está "mal"**. Cada una mide con reglas distintas, y la más importante es la **ventana de atribución**.

## Qué es una ventana de atribución

Es el **plazo durante el cual una plataforma se atribuye una conversión** después de que alguien interactuó con un anuncio. Si la ventana es de 7 días tras el clic y la persona compra al día 5, la plataforma cuenta esa venta como suya. Si compra al día 10, no.

Hay dos tipos de interacción:

- **Clic:** la persona hizo clic en el anuncio.
- **Visualización:** la persona vio el anuncio pero no hizo clic.

## Las ventanas de cada plataforma

| Plataforma | Ventanas disponibles | Configuración habitual |
| --- | --- | --- |
| **Meta Ads** | 1, 7 o 28 días tras el clic; 1 día tras la visualización; 1 día tras una reproducción de video con interacción | 7 días tras el clic y 1 día tras la visualización |
| **Google Ads** | Clic: de 1 a 90 días según la campaña; visualización con interacción: hasta 30 días; visualización: hasta 30 días | 30 días tras el clic, 3 días tras la visualización con interacción, 1 día tras la visualización |
| **GA4** | Eventos de adquisición: 7 o 30 días; resto de eventos clave: 30, 60 o 90 días | 30 días (adquisición) y 90 días (resto) |

**Novedad de 2026 en Meta:** desde el **12 de enero de 2026**, la API de estadísticas de anuncios de Meta **dejó de devolver datos de las ventanas de 7 y 28 días tras la visualización**. Si tus reportes externos (Looker Studio, hojas de cálculo, conectores) pedían esas ventanas, ahora reciben datos vacíos y conviene revisarlos.

## Por qué los números no coinciden

### 1. Cada plataforma se atribuye la venta

Si una persona hace clic en un anuncio de Meta, días después busca tu marca en Google, hace clic en un anuncio de Google Ads y compra, **Meta y Google Ads cuentan la misma venta**. GA4, en cambio, ve el recorrido completo en tu web y reparte el mérito entre canales: una venta, un solo registro.

### 2. Las visualizaciones

Meta y Google Ads pueden contar conversiones de personas que **solo vieron** un anuncio. GA4 se basa en las **visitas a tu web**: si alguien vio el anuncio y llegó después escribiendo tu dirección, GA4 lo registra como tráfico directo, no como Meta.

### 3. La fecha de la conversión

Google Ads asigna la conversión, por defecto, **al día del clic**; GA4 la registra **el día en que ocurrió**. Si alguien hizo clic el lunes y compró el viernes, Google Ads la muestra el lunes y GA4 el viernes. Por eso las comparaciones día a día casi nunca cuadran.

### 4. Los modelos de atribución de GA4

GA4 ofrece el modelo **basado en datos** y el de **último clic**. Los modelos de primer clic, lineal, deterioro temporal y basado en la posición **se retiraron en noviembre de 2023**. Si alguien compara con un reporte antiguo hecho con esos modelos, las cifras no serán comparables.

### 5. Datos que se pierden en el navegador

Bloqueadores de anuncios, cookies que el navegador borra antes de tiempo (Safari limita a 7 días las cookies creadas con JavaScript) y visitantes que rechazan las cookies hacen que GA4 y los píxeles vean menos conversiones de las que realmente ocurrieron. Las plataformas publicitarias compensan parte de esto con **conversiones modeladas**; GA4 lo hace solo en ciertos casos.

## Cómo leer bien tus números

1. **Define una fuente de verdad para cada pregunta.** Para saber cuánto vendiste: tu tienda o tu CRM. Para optimizar campañas: cada plataforma. Para comparar canales entre sí: GA4.
2. **Compara con las mismas reglas.** Si comparas Meta con GA4, usa ventanas similares y periodos completos (una semana o un mes), no días sueltos.
3. **Usa parámetros UTM en todos tus anuncios.** Sin ellos, GA4 no puede identificar bien de dónde viene cada visita.
4. **Envía las conversiones desde el servidor.** La [API de conversiones de Meta](/blog/pixel-meta-api-conversiones) y el etiquetado del lado del servidor recuperan parte de los datos que se pierden en el navegador.
5. **Revisa tus reportes automáticos** si usaban las ventanas de 7 o 28 días tras la visualización de Meta.

## En resumen

Que Meta, Google Ads y GA4 no coincidan es normal: miden con ventanas, modelos y fechas distintas, y cada plataforma se atribuye las ventas en las que participó. Lo importante no es que los números sean idénticos, sino entender qué mide cada uno y usar el adecuado para cada decisión.

**Fuente:** [Meta for Developers: cambios en la disponibilidad de métricas de la API de estadísticas (16/10/2025)](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/) · [Ayuda de Google Ads: ventanas de conversión](https://support.google.com/google-ads/answer/3123169) · [Ayuda de Google Analytics: configuración de atribución](https://support.google.com/analytics/answer/10597962) · [WebKit: Intelligent Tracking Prevention 2.1](https://webkit.org/blog/8613/intelligent-tracking-prevention-2-1/)
