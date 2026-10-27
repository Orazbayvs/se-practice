import { useState, useMemo } from 'react';
import { Building2, Clock, CheckCircle2, XCircle, CalendarX, Users } from 'lucide-react';
import { sampleRooms, sampleBookings } from '@/lib/sampleData';
import { Room, Booking, CheckResult } from '@/lib/types';
import {
  checkAvailability,
  timeToMinutes,
  minutesToTime,
  formatDuration,
} from '@/lib/availability';

function App() {
  const [rooms] = useState<Room[]>(sampleRooms);
  const [bookings] = useState<Booking[]>(sampleBookings);

  const [roomId, setRoomId] = useState<string>(rooms[0].id);
  const [bookingScenario, setBookingScenario] = useState<'sample' | 't10'>('sample');
  const [startTime, setStartTime] = useState<string>('14:00');
  const [endTime, setEndTime] = useState<string>('15:00');
  const [currentTime, setCurrentTime] = useState<string>('09:00');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === roomId) ?? rooms[0],
    [rooms, roomId]
  );

  const activeBookings = useMemo<Booking[]>(
    () => bookingScenario === 't10'
      ? [
          ...bookings.filter((booking) => booking.roomId !== 'b204'),
          { id: 't10-booking-1', roomId: 'b204', title: 'Existing booking 1', start: 600, end: 660 },
          { id: 't10-booking-2', roomId: 'b204', title: 'Existing booking 2', start: 700, end: 760 },
        ]
      : bookings,
    [bookingScenario, bookings]
  );
  const roomBookings = useMemo(
    () => activeBookings.filter((b) => b.roomId === selectedRoom.id),
    [activeBookings, selectedRoom]
  );

  const handleCheck = () => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const cur = timeToMinutes(currentTime);
    if (start < 0 || end < 0 || cur < 0) {
      setResult({ available: false, reasons: ['Please enter valid times in HH:MM format.'] });
    } else {
      setResult(checkAvailability(selectedRoom, start, end, cur, activeBookings));
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setResult(null);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/90 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Smart Campus Room Availability
              </h1>
              <p className="text-sm text-slate-300">
                Check if a room is free for your requested time slot.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form Card */}
          <section className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">Check a room</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a room, enter start and end times, and set the current time for the check.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="bookingScenario" className="block text-sm font-medium text-slate-700">
                  Booking test scenario
                </label>
                <select
                  id="bookingScenario"
                  value={bookingScenario}
                  onChange={(e) => {
                    const scenario = e.target.value === 't10' ? 't10' : 'sample';
                    setBookingScenario(scenario);
                    setSubmitted(false);
                    setResult(null);
                    if (scenario === 't10') {
                      setRoomId('b204');
                      setStartTime('12:00');
                      setEndTime('13:00');
                    }
                  }}
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="sample">Standard sample bookings</option>
                  <option value="t10">T10 — overlap with second booking</option>
                </select>
                {bookingScenario === 't10' && (
                  <p className="mt-1 text-xs text-slate-500">
                    Uses 10:00–11:00 and 11:40–12:40 bookings; the 12:00–13:00 request overlaps the second.
                  </p>
                )}
              </div>

              {/* Room selector */}
              <div>
                <label htmlFor="room" className="block text-sm font-medium text-slate-700">
                  Room
                </label>
                <select
                  id="room"
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    setSubmitted(false);
                    setResult(null);
                  }}
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.building}
                      {r.blocked ? ' (Blocked)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current time */}
              <div>
                <label htmlFor="currentTime" className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Current time
                </label>
                <input
                  id="currentTime"
                  type="time"
                  value={currentTime}
                  onChange={(e) => {
                    setCurrentTime(e.target.value);
                    setSubmitted(false);
                    setResult(null);
                  }}
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="mt-1 text-xs text-slate-400">
                  The requested start must be after this time.
                </p>
              </div>

              {/* Start / End time grid */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-slate-700">
                    Start time
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setSubmitted(false);
                      setResult(null);
                    }}
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-slate-700">
                    End time
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setSubmitted(false);
                      setResult(null);
                    }}
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Duration preview */}
              {(() => {
                const s = timeToMinutes(startTime);
                const e = timeToMinutes(endTime);
                if (s >= 0 && e >= 0 && e > s) {
                  return (
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-slate-400" />
                      Duration: <span className="font-medium text-slate-800">{formatDuration(e - s)}</span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleCheck}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  Check availability
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Result (AC5) */}
            {submitted && result && (
              <div
                className={`mt-6 rounded-xl p-4 ${
                  result.available
                    ? 'bg-emerald-50 ring-1 ring-emerald-200'
                    : 'bg-rose-50 ring-1 ring-rose-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.available ? (
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="h-6 w-6 flex-shrink-0 text-rose-600" />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-bold ${
                        result.available ? 'text-emerald-800' : 'text-rose-800'
                      }`}
                    >
                      {result.available ? 'Available' : 'Unavailable'}
                    </p>
                    {result.available ? (
                      <p className="mt-0.5 text-sm text-emerald-700">
                        {selectedRoom.name} is free for {minutesToTime(timeToMinutes(startTime))}–
                        {minutesToTime(timeToMinutes(endTime))}.
                      </p>
                    ) : (
                      <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-rose-700">
                        {result.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Sidebar: room info + existing bookings */}
          <aside className="lg:col-span-2 space-y-6">
            {/* Room info */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Room details
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Building</span>
                  <span className="text-sm font-medium text-slate-800">{selectedRoom.building}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Users className="h-4 w-4" /> Capacity
                  </span>
                  <span className="text-sm font-medium text-slate-800">{selectedRoom.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <CalendarX className="h-4 w-4" /> Status
                  </span>
                  {selectedRoom.blocked ? (
                    <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                      Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Existing bookings */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Existing bookings
              </h3>
              {roomBookings.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No bookings for this room.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {roomBookings
                    .sort((a, b) => a.start - b.start)
                    .map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5"
                      >
                        <span className="truncate text-sm font-medium text-slate-700">{b.title}</span>
                        <span className="ml-3 flex-shrink-0 text-sm tabular-nums text-slate-500">
                          {minutesToTime(b.start)}–{minutesToTime(b.end)}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-slate-400 sm:px-6">
          Fictional sample data for demonstration purposes.
        </div>
      </footer>
    </div>
  );
}

export default App;
