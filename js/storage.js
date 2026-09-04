const KEY = 'abcTutoringBookings';

function readBookings() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function writeBookings(bookings) {
  try { window.localStorage.setItem(KEY, JSON.stringify(bookings)); return true; } catch { return false; }
}

export function isSlotBooked(tutorId, slotId) {
  return readBookings().some((booking) => booking.tutorId === tutorId && booking.slotId === slotId);
}

export function saveBooking(booking) {
  const bookings = readBookings();
  if (bookings.some((item) => item.tutorId === booking.tutorId && item.slotId === booking.slotId)) return { ok: false, reason: 'slot_taken' };
  return writeBookings([...bookings, booking]) ? { ok: true } : { ok: false, reason: 'storage_unavailable' };
}

export function createBookingId() {
  const random = window.crypto?.randomUUID?.().slice(0, 8) || Math.random().toString(36).slice(2, 10);
  return `ABC-${Date.now().toString(36).toUpperCase()}-${random.toUpperCase()}`;
}
