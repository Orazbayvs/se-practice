export function timeToMinutes(time: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return -1;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (minutes > 59 || hours > 24 || (hours === 24 && minutes !== 0)) return -1;
  return hours * 60 + minutes;
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
