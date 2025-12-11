export function sanitizeString(value = '', maxLen = 200) {
  if (typeof value !== 'string') return '';
  const cleaned = value.trim().replace(/\s+/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
  return cleaned.substring(0, maxLen);
}

export function isISODateString(s) {
  if (typeof s !== 'string') return false;
  // YYYY-MM-DD basic check
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  // Basic semantic check
  const [y, m, d] = s.split('-').map(Number);
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  return true;
}

export function isValidRoomType(t) {
  return ['single', 'double', 'dorm'].includes(String(t).trim());
}

export function sanitizeInteger(value, fallback = 0) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}
