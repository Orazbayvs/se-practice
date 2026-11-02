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

  if (start < 0 || end > 1440) {
    reasons.push('Times must be within 00:00–24:00.');
  }
  if (start >= end) {
    reasons.push('Start time must be earlier than end time.');
  }
  if (start <= now) {
    reasons.push('Start time must be after the current time.');
  }

  const validInterval = start >= 0 && end <= 1440 && start < end;

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

export function canBook(request: BookingRequest): boolean {
  return getUnavailabilityReasons(request).length === 0;
}

export function getBookingReasons(request: BookingRequest): string[] {
  return getUnavailabilityReasons(request);
}
