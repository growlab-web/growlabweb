---
title: 'Google tag y Tag Manager se unifican: qué cambia en tu medición y qué revisar'
slug: google-tag-manager-unificacion-google-tag
description: 'Cada Google tag pasa a ser un contenedor de Tag Manager. Qué cambia para GA4 y Google Ads, qué instalaciones se actualizan en enero de 2027 y qué revisar ya.'
date: 2026-11-28
category: tracking-analitica
cover: /images/blog/categorias/tracking-analitica.jpg
coverAlt: 'Portada del blog de GrowLab sobre tracking y analítica'
author: GrowLab
tags: [Google Tag Manager, Google tag, GA4, Google Ads, tracking]
---

Si tu web mide visitas con Google Analytics 4 o conversiones con Google Ads, casi seguro usa la **Google tag** (gtag.js), **Google Tag Manager** (GTM) o ambas. Hasta ahora eran dos herramientas separadas, con configuraciones y permisos distintos, y eso solía causar datos duplicados o etiquetas que no se activaban.

El 17 de noviembre de 2026 Google confirmó en las notas de versión de Tag Manager que **cada Google tag se convierte en un contenedor de Tag Manager**. Te contamos qué cambia (y qué no) y qué revisar antes de enero de 2027.

## Qué anunció Google

Google lo resume así: lleva **todas las funciones de Google Tag Manager a la Google tag**. En la práctica:

- **Cada Google tag pasa a ser un contenedor de Tag Manager.** Si tu web solo usa la Google tag, ahora puede aprovechar la interfaz de etiquetado de GTM, su depuración y el **control de versiones**.
- **No cambia cómo funciona la etiqueta en tu web.** Google aclara que la actualización no modifica el comportamiento de las etiquetas en la página; solo te da la opción de usar las funciones de Tag Manager.
- **Cada destino de Google tiene su propia etiqueta** (GA4, Google Ads, Floodlight o Merchant Center), y se conservan tu configuración y los activadores de eventos automáticos.
- **Todos los fragmentos de instalación nuevos serán iguales** y ya no incluirán el comando `gtag('config')`. Google recomienda configurar el inicio con los activadores de inicialización estándar de Tag Manager.
- **Los permisos de Tag Manager se aplican a todo**: el acceso a los datos de Tag Assistant se gestionará con los mismos permisos del contenedor.

Este paso cierra una serie de cambios que Google anunció el 20 de agosto de 2026, junto con una interfaz más simple (una pestaña **Configuración** centralizada y una sección **Avanzado** con activadores, variables, plantillas y carpetas) y el **etiquetado visual**, que permite crear eventos seleccionando elementos de tu web sin programar. Según Google, este último está en beta para conversiones de compra en Google Ads y se ampliará a otros usos de forma progresiva.

## Los cambios previos que debes conocer

La unificación llega después de otros ajustes técnicos de los últimos meses:

| Fecha | Cambio | Qué implica para ti |
| --- | --- | --- |
| 9 de julio de 2026 | El ID del contenedor define qué puede ejecutar | Un ID `GTM-` permite todo tipo de etiquetas (incluido HTML personalizado); un ID `G-` o `AW-` solo permite etiquetas de Google |
| 8 de octubre de 2026 | Los fragmentos de GTM se inician al cargar, sin esperar a `gtag('config')` | Los comandos `config` aparecen en la capa de datos como eventos `gtag.config` y pueden activar etiquetas con activadores de evento personalizado comodín |
| 12 de octubre de 2026 | Los contenedores envían datos directamente a GA4 y Google Ads | Ya no se carga el script gtag.js adicional: menos latencia y diagnósticos más claros |
| 17 de noviembre de 2026 | Cada Google tag se convierte en contenedor de Tag Manager | Interfaz, versiones y permisos de GTM también para quien solo usaba la Google tag |

## ¿Tu instalación es «no compatible»?

Este es el punto que más conviene revisar. Google considera **no compatible** cargar un ID que no empieza por `GTM-` (por ejemplo, `G-`, `AW-` o `DC-`) mediante el fragmento de Tag Manager (gtm.js), o usar el fragmento de GTM junto con comandos `gtag('config')` para esos ID.

Google indica que las instalaciones no compatibles **recibirán la actualización en enero de 2027** y recomienda corregirlas antes. También informó que avisó por correo a los usuarios de contenedores afectados, así que revisa la bandeja de la cuenta con la que administras Tag Manager.

La solución que propone Google es sencilla: si quieres seguir usando `gtag('config')` para GA4 o Google Ads, usa en todas las páginas el **fragmento estándar de la Google tag (gtag.js)**. Si en cambio gestionas todo desde Tag Manager, deja solo el fragmento de GTM y configura ahí tus etiquetas.

## La optimización del contenedor: recomendada, no obligatoria

Si ya usas Tag Manager, verás un aviso para **«Optimizar tu contenedor de Tag Manager»**. Este proceso lleva la configuración de tus Google tags a la nueva pestaña Configuración y hace que el contenedor envíe datos directamente a cada destino. Lo que conviene saber:

- Google indica que **no se hace ningún cambio automático**: tú decides si lo adoptas.
- Necesitas permisos de edición, aprobación o publicación en el contenedor.
- **Tus etiquetas de eventos y activadores se mantienen.** Puedes previsualizar los cambios, probarlos en el modo Vista previa y volver a una versión anterior si algo falla.
- Al optimizar, el contenedor se vincula con tus cuentas de Google (GA4, Google Ads) y se da acceso de **lectura** por defecto, que puedes ajustar en la gestión de usuarios.

## Checklist para revisar tu medición

1. **Identifica cómo está instalada tu web**: busca en el código si aparece `gtm.js`, `gtag/js` o ambos, y qué ID usa cada uno.
2. **Corrige mezclas no compatibles**: un ID `G-` o `AW-` cargado con el fragmento de GTM, o `gtag('config')` junto al fragmento de GTM.
3. **Revisa los activadores de evento personalizado comodín** en GTM: desde octubre pueden activarse con los nuevos eventos `gtag.config`.
4. **Evita contar doble**: si GA4 está instalado por código y también desde GTM, deja una sola vía.
5. **Ordena los permisos** del contenedor: ahora también controlan el acceso a Tag Assistant.
6. **Haz la optimización en un entorno de prueba**, valida en Vista previa y en los informes en tiempo real de GA4 antes de publicar.
7. **Documenta cada versión**: Tag Manager ya sugiere con IA un nombre y una descripción al publicar.

Si además envías datos desde tu servidor, en nuestro artículo sobre [Stape y el tracking del lado del servidor](/blog/stape-tracking-server-side) explicamos cómo encaja con Tag Manager. Y si tus cifras no cuadran entre plataformas, revisa [las ventanas de atribución de GA4, Meta y Google Ads](/blog/ventanas-atribucion-ga4-meta-google-ads).

## En resumen

Google tag y Tag Manager pasan a ser una sola plataforma: cada Google tag es ahora un contenedor con la interfaz, las versiones y los permisos de GTM, sin cambiar cómo mide tu web. Lo urgente es revisar si tu instalación mezcla fragmentos de forma no compatible, porque esas webs se actualizarán en enero de 2027. Después, optimiza tu contenedor y limpia las etiquetas duplicadas.

**Fuentes:** [Notas de versión de Google Tag Manager](https://support.google.com/tagmanager/answer/4620708?hl=es) · [Google: novedades de la Google tag y Google Tag Manager (20 de agosto de 2026)](https://support.google.com/tagmanager/answer/17079602?hl=es) · [Google: instala correctamente la Google tag con gtag.js](https://support.google.com/tagmanager/answer/17231523?hl=es) · [Google: optimiza tu contenedor de Tag Manager](https://support.google.com/tagmanager/answer/16659369?hl=es) · [Google: el ID del contenedor y el comportamiento de las etiquetas](https://support.google.com/tagmanager/answer/17070049?hl=es) · [Search Engine Roundtable: unificación de Google tag y Tag Manager](https://seroundtable.com/google-tag-manager-unification-42562.html)
