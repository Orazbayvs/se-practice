import { useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { ROOMS } from './rooms';

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function App() {
  const [attendees, setAttendees] = useState(4);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const filteredRooms = filterRooms(ROOMS, { attendees, equipment });
  const room = filteredRooms.find(candidate => candidate.id === roomId);

  function check() {
    setResult(null);
    if (!start || !now || !end) {
      setError('Fill in the current time, the start and the end.');
      return;
    }
    const s = toMinutes(start);
    const e = toMinutes(end);
    const n = toMinutes(now);
    if (!(s < e)) {
      setError('The end time must be after the start time.');
      return;
    }
    setError('');
    if (!room) {
      setError('Select a room that matches the filters.');
      return;
    }
    setResult(checkRoom(ROOMS, room.id, { start: s, end: e, now: n }));
  }

  const toggleEquipment = (item: string) => {
    setEquipment(current => current.includes(item)
      ? current.filter(value => value !== item)
      : [...current, item]);
    setResult(null);
  };

  const changeRoom = (id: string) => {
    setRoomId(id);
    setResult(null);
  };

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>
      <section className="filters" aria-label="Room filters">
        <label>Attendees
          <input
            type="number"
            min="1"
            value={attendees}
            onChange={e => {
              setAttendees(Math.max(1, Number(e.target.value) || 1));
              setResult(null);
            }}
          />
        </label>
        <fieldset>
          <legend>Required equipment</legend>
          {['projector', 'whiteboard', 'video-conference', 'display'].map(item => (
            <label className="inline" key={item}>
              <input
                type="checkbox"
                checked={equipment.includes(item)}
                onChange={() => toggleEquipment(item)}
              />
              {item}
            </label>
          ))}
        </fieldset>
      </section>

      <h2>Matching rooms</h2>
      {filteredRooms.length === 0 ? (
        <p className="empty" role="status">No rooms match these requirements.</p>
      ) : (
        <ul className="room-list">
          {filteredRooms.map(candidate => (
            <li key={candidate.id}>
              <button
                type="button"
                className={candidate.id === roomId ? 'room selected' : 'room'}
                onClick={() => changeRoom(candidate.id)}
              >
                <strong>{candidate.name}</strong>
                <span>Capacity {candidate.capacity} · {candidate.equipment.join(', ')}</span>
                {candidate.blocked && <span className="blocked">Blocked</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="row">
        <label>Room
          <select value={roomId} onChange={e => changeRoom(e.target.value)}>
            {filteredRooms.map(candidate => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}{candidate.blocked ? ' (blocked)' : ''}
              </option>
            ))}
          </select>
        </label>
        <label>Current time<input type="time" value={now} onChange={e => setNow(e.target.value)} /></label>
        <label>Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
        <label>End<input type="time" value={end} onChange={e => setEnd(e.target.value)} /></label>
      </div>
      <button onClick={check}>Check availability</button>
      {error && <p className="error">{error}</p>}
      {result !== null && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>{result ? 'Available' : 'Unavailable'}</p>
      )}
      <h2>Existing bookings</h2>
      {room ? (
        <ul>{room.bookings.length ? room.bookings.map((booking, i) => (
          <li key={i}>{fmt(booking.start)}–{fmt(booking.end)}</li>
        )) : <li>none</li>}</ul>
      ) : <p>Select a matching room to see bookings.</p>}
    </main>
  );
}
