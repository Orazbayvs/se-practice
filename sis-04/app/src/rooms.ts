export type Interval = { start: number; end: number };

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Interval[];
};

export const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', capacity: 16, equipment: ['projector', 'whiteboard', 'video-conference'], blocked: false, bookings: [] },
  { id: 'c305', name: 'Room C-305', capacity: 4, equipment: ['display', 'whiteboard'], blocked: false, bookings: [{ start: 660, end: 720 }] },
  { id: 'd401', name: 'Room D-401', capacity: 20, equipment: ['projector', 'video-conference'], blocked: true, bookings: [] },
  { id: 'e102', name: 'Room E-102', capacity: 12, equipment: ['projector', 'display', 'whiteboard'], blocked: false, bookings: [{ start: 780, end: 840 }] },
];
