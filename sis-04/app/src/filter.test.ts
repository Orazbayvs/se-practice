import { describe, expect, test } from 'vitest';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const fixedRooms: Room[] = [
  { id: 'test-a', name: 'Test A', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
  { id: 'test-b', name: 'Test B', capacity: 16, equipment: ['projector', 'video-conference'], blocked: false, bookings: [] },
  { id: 'test-c', name: 'Test C', capacity: 4, equipment: ['display'], blocked: false, bookings: [] },
];

describe('room filtering', () => {
  test('T16 F1: capacity filter excludes rooms below attendees', () => {
    expect(filterRooms(fixedRooms, { attendees: 10, equipment: [] }).map(room => room.id)).toEqual(['test-b']);
  });

  test('T17 F2: selected equipment uses all-items matching', () => {
    expect(filterRooms(fixedRooms, { attendees: 1, equipment: ['projector', 'whiteboard'] }).map(room => room.id)).toEqual(['test-a']);
  });

  test('T18 F4: filter can return an empty result', () => {
    expect(filterRooms(fixedRooms, { attendees: 20, equipment: ['display'] })).toEqual([]);
  });

  test('T19 B5: capacity exactly equal to attendees is included', () => {
    expect(filterRooms(fixedRooms, { attendees: 8, equipment: [] }).map(room => room.id)).toContain('test-a');
  });

  test('T20 B6: capacity one below attendees is excluded', () => {
    expect(filterRooms(fixedRooms, { attendees: 9, equipment: [] }).map(room => room.id)).not.toContain('test-a');
  });

  test('T21 F1 F2: combined criteria are both enforced', () => {
    expect(filterRooms(fixedRooms, { attendees: 16, equipment: ['projector', 'video-conference'] }).map(room => room.id)).toEqual(['test-b']);
  });
});
