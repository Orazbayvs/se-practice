import { Room, Booking } from './types';

export const sampleRooms: Room[] = [
  { id: 'a101', name: 'Room A-101', building: 'Engineering Block', blocked: false, capacity: 40 },
  { id: 'b204', name: 'Room B-204', building: 'Science Block', blocked: false, capacity: 30 },
  { id: 'c310', name: 'Lab C-310', building: 'Research Wing', blocked: true, capacity: 20 },
  { id: 'd105', name: 'Room D-105', building: 'Library Building', blocked: false, capacity: 50 },
  { id: 'e001', name: 'Auditorium E-001', building: 'Main Hall', blocked: false, capacity: 200 },
];

export const sampleBookings: Booking[] = [
  { id: 'bk1', roomId: 'a101', title: 'Intro to Algorithms', start: 540, end: 630 },
  { id: 'bk2', roomId: 'a101', title: 'Faculty Meeting', start: 780, end: 840 },
  { id: 'bk3', roomId: 'b204', title: 'Organic Chem Lab', start: 600, end: 660 },
  { id: 'bk5', roomId: 'd105', title: 'Reading Circle', start: 480, end: 540 },
  { id: 'bk6', roomId: 'e001', title: 'Guest Lecture', start: 900, end: 1020 },
];
