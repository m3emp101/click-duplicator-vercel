const htmlEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
  '`': '&#096;',
};

export const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"'`]/g, (char) => htmlEscapeMap[char] || char);
