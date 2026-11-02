import { expect, test } from 'vitest';
import { canBook } from './booking';

test('T01 AC4: a request touching after a booking is available', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 660, end: 720, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(true);
});

test('T02 AC1: a request starting now is unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 540, end: 570, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(false);
});

test('T03 AC1: a zero-duration request is unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 720, end: 720, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(false);
});

test('T04 AC1: a reversed request is unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 750, end: 720, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(false);
});

test('T05 AC1: a request beyond the end of the day is unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 1380, end: 1441, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(false);
});

test('T06 AC2: a request of exactly 120 minutes is available', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 720, end: 840, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(true);
});

test('T07 AC2: a request of 121 minutes is unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 720, end: 841, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(false);
});

test('T08 AC4: a request touching before a booking is available', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 570, end: 600, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(true);
});

test('T09 AC4: a partially overlapping request is unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 630, end: 690, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(false);
});

test('T10 AC4: a request containing an existing booking is unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 570, end: 690, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(false);
});

test('T11 AC4: a request inside an existing booking is unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 615, end: 645, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(false);
});

test('T12 AC4: an identical interval is unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 600, end: 660, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(false);
});

test('T13 AC3: a blocked room makes a touching request unavailable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 660, end: 720, now: 540, blocked: true, bookings };
  expect(canBook(input)).toBe(false);
});

test('T14 AC4: a request with no existing bookings is available', () => {
  const bookings: { start: number; end: number }[] = [];
  const input = { start: 630, end: 690, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(true);
});

test('AC5: an available check does not replace the bookings array', () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = bookings;
  const input = { start: 660, end: 720, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(true);
  expect(bookings).toBe(before);
});

test('X1 AC1: a request ending exactly at 24:00 is available', () => {
  const bookings = [{ start: 600, end: 660 }];
  const input = { start: 1380, end: 1440, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(true);
});

test('X2: a reversed existing booking does not overlap this request', () => {
  const bookings = [{ start: 700, end: 650 }];
  const input = { start: 660, end: 720, now: 540, blocked: false, bookings };
  expect(canBook(input)).toBe(true);
});
