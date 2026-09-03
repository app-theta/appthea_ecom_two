/** Maps a Sale status (Pending/Processing/Confirmed/Delivery/Cancelled) to a .pill--* tone class. */
export function statusTone(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'cancelled') return 'danger';
  if (s === 'delivery') return 'success';
  if (s === 'confirmed') return 'info';
  return 'pending';
}

export function initials(name) {
  return String(name ?? '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
}

export function dateShort(value) {
  if (!value) return '';
  const d = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
