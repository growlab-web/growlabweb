/**
 * Identificadores para Google Tag Manager.
 * Cada botón, enlace y formulario importante lleva un `id` estable y descriptivo (en español, con guiones) para poder usar las
 * variables integradas de GTM (Click ID, Click Classes, Form ID…) en los activadores. Lista completa en README.md.
 * gtmId('Últimos proyectos') → 'ultimos-proyectos'
 */
export const gtmId = (text) => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
