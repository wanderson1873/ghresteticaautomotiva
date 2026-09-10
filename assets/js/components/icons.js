/* =============================================================================
   ÍCONES — biblioteca SVG inline (sem dependência externa)
   Uso:  GHR.icon('check')  →  string com o <svg>
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.icons = {
  arrow:  '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check:  '<path d="M20 6 9 17l-5-5"/>',
  spark:  '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8"/>',
  shield: '<path d="M12 3 5 6v6c0 4.4 3 7.9 7 9 4-1.1 7-4.6 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  brush:  '<path d="M4 20c2.8 0 4-1.6 4-4H4v4Z"/><path d="M8 16 18.6 5.4a2 2 0 0 1 2.8 2.8L10.8 18.8"/>',
  close:  '<path d="M6 6l12 12M18 6 6 18"/>',
  chevL:  '<path d="m14 6-6 6 6 6"/>',
  chevR:  '<path d="m10 6 6 6-6 6"/>',
  zoom:   '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6M11 8.5v5M8.5 11h5"/>',
  wa:     '<path d="M12.05 3a9 9 0 0 0-7.7 13.65L3 21l4.5-1.3A9 9 0 1 0 12.05 3Z"/><path d="M8.9 8.3c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.1.6l-.4.5c-.1.2-.2.3 0 .6a6.3 6.3 0 0 0 2.9 2.5c.3.1.4 0 .6-.1l.5-.6c.2-.2.3-.2.6-.1l1.6.8c.3.1.4.3.4.5a1.9 1.9 0 0 1-1.3 1.5c-.6.2-1.4.2-3.2-.6a9 9 0 0 1-4-3.9c-.6-1.2-.5-2.2-.1-2.8Z"/>',
  ig:     '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/>',
  fb:     '<path d="M14.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5H17.4V5.1A21 21 0 0 0 15.2 5c-2.2 0-3.7 1.3-3.7 3.8V11H9v3h2.5v7Z"/>',
  pin:    '<path d="M12 21s7-5.4 7-10.5A7 7 0 0 0 5 10.5C5 15.6 12 21 12 21Z"/><circle cx="12" cy="10.4" r="2.6"/>',
  car:      '<path d="M5 17h14M4 17v-4.2L6 8h12l2 4.8V17M4 17v2h2.5v-2M17.5 19H20v-2"/><circle cx="8" cy="13.6" r="1"/><circle cx="16" cy="13.6" r="1"/>',
  tag:      '<path d="M4 11.5V5a1 1 0 0 1 1-1h6.5a1 1 0 0 1 .7.3l7.5 7.5a1 1 0 0 1 0 1.4l-6.5 6.5a1 1 0 0 1-1.4 0L4.3 12.2a1 1 0 0 1-.3-.7Z"/><circle cx="8.2" cy="8.2" r="1.2"/>',
  key:      '<circle cx="7.5" cy="14.5" r="3.5"/><path d="m10.2 12.2 7.3-7.3M15 7.4l2.1 2.1M17.5 4.9l2.1 2.1"/>',
  wrench:   '<path d="M15.6 4.6a5 5 0 0 0-6.4 6.4L4 16.2 7.8 20l5.2-5.2a5 5 0 0 0 6.4-6.4L16.6 11h-3.2V7.8l2.2-3.2Z"/>',
  wheel:    '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v5.4M12 15.1v5.4M3.5 12h5.4M15.1 12h5.4"/>',
  building: '<path d="M4 20V6.5a1 1 0 0 1 .7-1l6-1.8a1 1 0 0 1 1.3 1V20M12 20V9.6l6.3 1.6a1 1 0 0 1 .7 1V20M3 20h18"/><path d="M7 9h2M7 12.5h2M7 16h2M15 14h1.5M15 17h1.5"/>'
};

/**
 * Devolve o SVG de um ícone.
 * @param {string} name  chave em GHR.icons
 * @param {number} size  tamanho em px (padrão 20)
 */
GHR.icon = function (name, size) {
  const d = GHR.icons[name];
  if (!d) return '';
  const s = size || 20;
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
};
