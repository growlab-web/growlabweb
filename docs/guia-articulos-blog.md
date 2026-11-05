# Guía para escribir artículos del blog de GrowLab

La sigue el agente automático que propone artículos (miércoles y sábados) y sirve también para quien escriba a mano.

## Dónde va cada cosa

- Artículo en español: `src/content/blog/<slug>.md` → se publica en `growlab.pe/blog/<slug>`.
- Artículo en inglés: `src/content/blog-en/<slug-en>.md` → `growlab.pe/en/blog/<slug-en>`. Lleva `translationOf: <slug del artículo en español>`.
- Esquema de campos: `src/content.config.ts`. Categorías válidas (`category`): `paid-media`, `seo`, `tracking-analitica`, `ecommerce-web`, `ia-automatizacion`, `email-marketing` (en los dos idiomas se usa el mismo valor).
- Portadas por categoría (ya hechas, sin título): `/images/blog/categorias/<categoria>.jpg` (español) y `/images/blog/categorias/en/<categoria>.jpg` (inglés).
- Modelo de referencia de tono y estructura: `src/content/blog/bloqueos-whatsapp-business.md` y su traducción `src/content/blog-en/whatsapp-business-account-bans.md`.

## Encabezado (frontmatter)

```yaml
---
title: 'Título claro, con la búsqueda principal'
slug: direccion-sin-tildes-con-guiones
description: 'Resumen de 120 a 160 caracteres (máximo 170).'
date: AAAA-MM-DD            # el día de publicación
category: seo
cover: /images/blog/categorias/seo.jpg
coverAlt: 'Portada del blog de GrowLab sobre SEO'
author: GrowLab
tags: [etiqueta 1, etiqueta 2, etiqueta 3]
---
```

En inglés, lo mismo más `translationOf: <slug-es>`, con `cover: /images/blog/categorias/en/<categoria>.jpg`. Las comillas simples dentro de un texto entre comillas simples rompen el archivo: usa el apóstrofo tipográfico (’) en inglés (don’t, Meta’s).

## Contenido

- Público: dueños y responsables de marketing de pymes y marcas en el Perú y Latinoamérica (en inglés, sin dar por hecho que el lector está en el Perú).
- Extensión: 700 a 1100 palabras. Estructura: introducción breve (2 párrafos) → secciones `##` (y `###` si hace falta) → al menos una lista o tabla útil → «En resumen» → línea final `**Fuentes:**` con enlaces.
- Tono: claro, práctico, en segunda persona («tu web», «tus campañas»), sin promesas exageradas ni relleno.
- Enlaza 1 o 2 artículos anteriores del blog cuando venga al caso (enlaces internos sin parámetros UTM; en inglés, a `/en/blog/...`).
- No es asesoría legal: si el tema es normativo, dilo.

## Datos y fuentes (lo más importante)

- Toda cifra, fecha o afirmación concreta debe estar confirmada en una fuente fiable: documentación oficial (Google, Meta, WhatsApp, Shopify, etc.), organismos públicos o medios reconocidos (TechCrunch, The Verge, Search Engine Land, Gestión, El Comercio, Andina…).
- No uses cifras que solo aparezcan en blogs de empresas que venden la herramienta. Si un dato no está confirmado, no lo pongas o preséntalo como no confirmado.
- Cita las fuentes al final con enlaces reales que hayas abierto.
- Nunca inventes citas, porcentajes ni fechas.

## Temas

- Novedades recientes (últimos 2 a 3 meses) o guías prácticas sobre: Meta Ads, Google Ads, TikTok Ads, SEO y búsqueda con IA, GA4 / Tag Manager / tracking, ecommerce y Shopify, IA aplicada al marketing, email marketing y WhatsApp.
- Antes de elegir, revisa los títulos de `src/content/blog/` para no repetir un tema ya publicado.
- Alterna categorías: evita la misma categoría que el artículo anterior más reciente.
