import { Room, Booking, CheckResult } from './types';

export function timeToMinutes(time: string): number {
  if (!time) return -1;
  const [h, m] = time.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return -1;
  return h * 60 + m;
}

export function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

/**
 * Core availability check covering AC1–AC4.
 * Returns a decision (AC5) without mutating any booking data.
 */
export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number,
  bookings: Booking[]
): CheckResult {
  const reasons: string[] = [];

  // AC1: 0 ≤ start < end ≤ 1440 and start > currentTime
  if (start < 0 || end > 1440) {
    reasons.push('Times must be within 00:00–24:00.');
  }
  if (start >= end) {
    reasons.push('Start time must be earlier than end time.');
  }
  if (start <= currentTime) {
    reasons.push('Start time must be after the current time.');
  }

  const validInterval = start >= 0 && end <= 1440 && start < end;

  // AC2: reject bookings longer than 120 minutes
  if (validInterval && end - start > 120) {
    reasons.push(`Booking duration is ${end - start} min — maximum allowed is 120 min.`);
  }

  // AC3: reject when room is blocked
  if (room.blocked) {
    reasons.push('This room is currently blocked and cannot be booked.');
  }

  // AC4: reject overlapping intervals (touching endpoints allowed)
  if (validInterval) {
    const overlaps = bookings.filter(
      (b) => b.roomId === room.id && b.start < end && start < b.end
    );
    for (const b of overlaps) {
      reasons.push(
        `Overlaps with "${b.title}" (${minutesToTime(b.start)}–${minutesToTime(b.end)}).`
      );
    }
  }

  return { available: reasons.length === 0, reasons };
}
