---
title: 'Requisitos de Gmail, Outlook y Yahoo para envíos masivos: guía para que tus correos no terminen en spam'
slug: requisitos-gmail-outlook-yahoo-envios-masivos
description: 'SPF, DKIM, DMARC, baja con un clic y tasa de spam: qué exigen Gmail, Outlook y Yahoo a quien envía correos masivos y cómo cumplirlo paso a paso.'
date: 2026-11-05
category: email-marketing
cover: /images/blog/categorias/email-marketing.jpg
coverAlt: 'Portada del blog de GrowLab sobre email marketing'
author: GrowLab
tags: [email marketing, entregabilidad, Gmail, DMARC]
---

Puedes tener la mejor oferta y el mejor diseño, pero si tu newsletter llega a la carpeta de spam (o ni siquiera llega), nadie la verá. Desde 2024, Gmail y Yahoo exigen a quienes envían correos masivos que **autentiquen su dominio** y faciliten la baja; en 2025 se sumó Outlook, y desde noviembre de 2025 Gmail endureció la aplicación de estas reglas.

Muchas pymes no saben que estas exigencias existen hasta que ven caer sus aperturas o reciben correos rebotados. En esta guía te explicamos qué pide cada proveedor, cómo saber si te afecta y qué revisar en tu dominio y en tu herramienta de email marketing.

## ¿A quién le afecta?

Cada proveedor define a los «remitentes masivos» por volumen:

- **Gmail:** quien envía cerca de **5000 mensajes o más en 24 horas** a cuentas personales de Gmail. Los envíos del mismo dominio principal suman juntos, y Google aclara que quien alcanza esa cifra **una sola vez** queda considerado remitente masivo de forma permanente.
- **Outlook:** los dominios que envían **más de 5000 correos al día** a sus direcciones de consumo (outlook.com, hotmail.com y live.com).
- **Yahoo:** también distingue entre todos los remitentes y los remitentes masivos, con exigencias adicionales para estos últimos.

Aunque no llegues a ese volumen, los requisitos básicos (como autenticar con SPF o DKIM) **aplican a todos los remitentes**. Y si piensas crecer, conviene cumplir todo desde ya.

## Qué exige cada proveedor

| Requisito | Gmail | Yahoo | Outlook |
| --- | --- | --- | --- |
| SPF y DKIM (remitentes masivos) | Ambos | Ambos | Ambos deben pasar |
| DMARC | Sí, puede ser `p=none` | Sí, al menos `p=none` y debe pasar | Sí, al menos `p=none`, alineado con SPF o DKIM |
| Baja con un clic | Obligatoria en correos de marketing | Obligatoria (cabecera List-Unsubscribe) | Recomendada: enlace de baja visible |
| Procesar las bajas | Recomienda hacerlo en 48 horas | En 2 días | — |
| Tasa de spam | Menos de 0,3 % (ideal: menos de 0,1 %) | Menos de 0,3 % | — |

Además, Gmail pide a todos los remitentes registros DNS directos e inversos (PTR) válidos, conexión **TLS**, mensajes con formato estándar y no suplantar direcciones @gmail.com en el remitente.

## Los tres registros que debes revisar

### SPF

Es un registro en el DNS de tu dominio que indica **qué servidores pueden enviar correo en tu nombre**. Si usas Google Workspace para el correo diario y una herramienta como Mailchimp, Brevo o Klaviyo para tus campañas, ambos deben estar autorizados.

### DKIM

Agrega una **firma digital** a cada mensaje para demostrar que no fue alterado y que salió de tu dominio. Tu plataforma de email marketing te da los registros para copiarlos en tu DNS. Gmail exige una clave DKIM de **1024 bits o más**.

### DMARC

Le dice a Gmail, Outlook o Yahoo **qué hacer si un correo falla** SPF y DKIM, y te envía informes. Para cumplir, basta con empezar con una política `p=none` (solo monitorear), pero el dominio del remitente que ve tu cliente debe estar **alineado** con el dominio de SPF o de DKIM. Por eso es importante que tus campañas salgan desde tu propio dominio (por ejemplo, `novedades@tumarca.pe`) y no desde el dominio genérico de la herramienta.

## Qué pasa si no cumples

- **Gmail:** según su FAQ oficial, los mensajes que no cumplen «sufrirán interrupciones», que pueden incluir **rechazos temporales y permanentes** o el envío a spam. Desde **noviembre de 2025**, Gmail está intensificando la aplicación sobre el tráfico que no cumple. Además, desde junio de 2024, los remitentes masivos con una tasa de spam reportada mayor a 0,3 % no pueden acceder a medidas de mitigación.
- **Outlook:** desde el **5 de mayo de 2025**, los correos de remitentes de alto volumen que no cumplen van a la carpeta de **correo no deseado**. Microsoft anunció que más adelante, en una fecha aún por definir, los rechazará con el error `550; 5.7.515`.
- **Yahoo:** aplica sus requisitos a todos los remitentes y exige más a los masivos; si los incumples, tus correos pueden no llegar a la bandeja de entrada.

## Checklist para tu marca

1. **Envía desde tu propio dominio**, nunca desde una dirección gratuita (@gmail.com, @hotmail.com) para campañas.
2. **Configura SPF, DKIM y DMARC** con los datos que te da tu plataforma de email y tu proveedor de correo. Si no sabes dónde está tu DNS, suele estar donde compraste el dominio.
3. **Activa la baja con un clic** (cabecera List-Unsubscribe) en tu herramienta y deja también un enlace de baja visible en el pie del correo.
4. **Procesa las bajas en menos de 48 horas**; las herramientas profesionales lo hacen al instante.
5. **Usa solo contactos que dieron su permiso.** Las listas compradas disparan las quejas de spam (y en el Perú tratar datos personales sin consentimiento tiene implicancias legales; repasa el [nuevo reglamento de protección de datos](/blog/nuevo-reglamento-proteccion-datos-peru-marketing)).
6. **Limpia tu lista** de direcciones inválidas o inactivas para reducir rebotes.
7. **Mide tu tasa de spam** en Google Postmaster Tools y mantenla por debajo de 0,1 %.

Este mismo principio de permiso y calidad aplica a otros canales: es también lo que protege tu número de [WhatsApp Business frente a bloqueos](/blog/bloqueos-whatsapp-business).

## En resumen

Gmail, Outlook y Yahoo ya no solo recomiendan, sino que **exigen** autenticación (SPF, DKIM y DMARC), baja sencilla y pocas quejas de spam a quienes envían correos masivos. Revisar tu dominio y tu herramienta toma poco tiempo y es la base para que tus campañas de email lleguen a la bandeja de entrada y vendan.

**Fuentes:** [Google: directrices para remitentes de correo](https://support.google.com/a/answer/81126?hl=en) · [Google: preguntas frecuentes sobre los requisitos para remitentes](https://support.google.com/a/answer/14229414?hl=en) · [Microsoft: nuevos requisitos de Outlook para remitentes de alto volumen](https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730) · [Yahoo Sender Hub: buenas prácticas y requisitos](https://senders.yahooinc.com/best-practices/)
