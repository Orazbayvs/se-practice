import { minutesToTime } from './lib/availability';

export type BookingInterval = {
  start: number;
  end: number;
  title?: string;
};

export type BookingRequest = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: BookingInterval[];
};

function getUnavailabilityReasons({
  start,
  end,
  now,
  blocked,
  bookings,
}: BookingRequest): string[] {
  const reasons: string[] = [];

  if (![start, end, now].every(Number.isFinite)) {
    reasons.push('Time values must be finite.');
  }
  if (start < 0 || end > 1440) {
    reasons.push('Times must be within 00:00–24:00.');
  }
  if (start >= end) {
    reasons.push('Start time must be earlier than end time.');
  }
  if (start <= now) {
    reasons.push('Start time must be after the current time.');
  }

  const validInterval =
    Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end <= 1440 && start < end;

  if (validInterval && end - start > 120) {
    reasons.push(`Booking duration is ${end - start} min — maximum allowed is 120 min.`);
  }

  if (blocked) {
    reasons.push('This room is currently blocked and cannot be booked.');
  }

  if (validInterval && end - start <= 120) {
    const overlaps = bookings.filter((booking) => booking.start < end && start < booking.end);
    for (const booking of overlaps) {
      const title = booking.title ? `"${booking.title}"` : 'an existing booking';
      reasons.push(
        `Overlaps with ${title} (${minutesToTime(booking.start)}–${minutesToTime(booking.end)}).`
      );
    }
  }

  return reasons;
}

/**
 * The six deterministic reason codes (Week 11, README §3.1).
 * The order of the checks below is the order of the rules in getUnavailabilityReasons:
 * AC1 (time) -> AC1 (past) -> AC2 (duration) -> AC3 (blocked) -> AC4 (overlap).
 */
export const REASON_CODES = [
  'invalid_time',
  'past_time',
  'too_long',
  'room_blocked',
  'overlap',
  'available',
] as const;

export type ReasonCode = (typeof REASON_CODES)[number];

export function availabilityReason({
  start,
  end,
  now,
  blocked,
  bookings,
}: BookingRequest): ReasonCode {
  if (
    ![start, end, now].every(Number.isFinite) ||
    start < 0 ||
    end > 1440 ||
    start >= end
  ) {
    return 'invalid_time';
  }
  if (start <= now) {
    return 'past_time';
  }
  if (end - start > 120) {
    return 'too_long';
  }
  if (blocked) {
    return 'room_blocked';
  }
  if (bookings.some((booking) => booking.start < end && start < booking.end)) {
    return 'overlap';
  }
  return 'available';
}

/** The authoritative decision. The rules live in availabilityReason. */
export function canBook(request: BookingRequest): boolean {
  return availabilityReason(request) === 'available';
}

export function getBookingReasons(request: BookingRequest): string[] {
  return getUnavailabilityReasons(request);
}
