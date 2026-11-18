import { describe, expect, test } from 'vitest';
import { canBook, checkRoom } from './booking';
import type { Room } from './rooms';

const fixedRooms: Room[] = [
  { id: 'test-a', name: 'Test A', capacity: 8, equipment: ['projector'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'test-b', name: 'Test B', capacity: 20, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
  { id: 'test-c', name: 'Test C', capacity: 10, equipment: ['projector'], blocked: true, bookings: [] },
];

describe('booking rules', () => {
  test('T01 AC1: start equal to end is rejected', () => {
    expect(canBook({ start: 660, end: 660, now: 600, blocked: false, bookings: [] })).toBe(false);
  });

  test('T02 AC1: a request in the past is rejected', () => {
    expect(canBook({ start: 600, end: 660, now: 661, blocked: false, bookings: [] })).toBe(false);
  });

  test('T03 AC2: duration above 120 minutes is rejected', () => {
    expect(canBook({ start: 660, end: 782, now: 600, blocked: false, bookings: [] })).toBe(false);
  });

  test('T04 AC3: blocked room is rejected', () => {
    expect(checkRoom(fixedRooms, 'test-c', { start: 660, end: 720, now: 600 })).toBe(false);
  });

  test('T05 AC4: an overlap is rejected', () => {
    expect(canBook({ start: 630, end: 690, now: 600, blocked: false, bookings: [{ start: 600, end: 660 }] })).toBe(false);
  });

  test('T06 AC5: canBook does not change bookings', () => {
    const bookings = [{ start: 600, end: 660 }];
    canBook({ start: 630, end: 690, now: 600, blocked: false, bookings });
    expect(bookings).toEqual([{ start: 600, end: 660 }]);
  });

  test('T07 F3: checkRoom rejects a blocked chosen room', () => {
    expect(checkRoom(fixedRooms, 'test-c', { start: 660, end: 720, now: 600 })).toBe(false);
  });

  test('T08 F5: switching rooms changes availability at the same times', () => {
    expect(checkRoom(fixedRooms, 'test-a', { start: 630, end: 690, now: 600 })).toBe(false);
    expect(checkRoom(fixedRooms, 'test-b', { start: 630, end: 690, now: 600 })).toBe(true);
  });

  test('T09 B1 AC2: exactly 120 minutes is available', () => {
    expect(canBook({ start: 720, end: 840, now: 600, blocked: false, bookings: [] })).toBe(true);
  });

  test('T10 B2 AC2: 121 minutes is rejected', () => {
    expect(canBook({ start: 720, end: 841, now: 600, blocked: false, bookings: [] })).toBe(false);
  });

  test('T11 B3 AC4: touching the end of a booking is available', () => {
    expect(canBook({ start: 660, end: 720, now: 600, blocked: false, bookings: [{ start: 600, end: 660 }] })).toBe(true);
  });

  test('T12 B4 AC4: overlapping a booking is rejected', () => {
    expect(canBook({ start: 659, end: 661, now: 600, blocked: false, bookings: [{ start: 600, end: 660 }] })).toBe(false);
  });

  test('T13 F5: unknown room ids are not available', () => {
    expect(checkRoom(fixedRooms, 'missing', { start: 660, end: 720, now: 600 })).toBe(false);
  });

  test('T14 AC1: invalid end after 24:00 is rejected', () => {
    expect(canBook({ start: 1380, end: 1441, now: 600, blocked: false, bookings: [] })).toBe(false);
  });

  test('T15 INT: filtered result is checked with the chosen room', () => {
    const matches = fixedRooms.filter(room => room.capacity >= 20);
    expect(matches.map(room => room.id)).toEqual(['test-b']);
    expect(checkRoom(matches, 'test-b', { start: 660, end: 720, now: 600 })).toBe(true);
  });
});
