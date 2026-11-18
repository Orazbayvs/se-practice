export interface Room {
  id: string;
  name: string;
  building: string;
  blocked: boolean;
  capacity: number;
}

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  start: number; // minutes from midnight (0–1440)
  end: number;
}

export interface CheckResult {
  available: boolean;
  reasons: string[];
}
