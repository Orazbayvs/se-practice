import { describe, expect, test, vi } from 'vitest';
import { availabilityReason, canBook, type BookingRequest } from './booking';
import {
  explainAvailability,
  fallbackExplanation,
  mockAdapter,
  type ExplanationAdapter,
  type ExplanationInput,
} from './explain';
import { timeToMinutes } from './lib/availability';

// The fixed scenario of README Part 5: now 09:00, one booking 10:00–11:00.
const NOW = '09:00';
const BOOKINGS = [{ start: 600, end: 660 }];

function decide(start: string, end: string, blocked = false, now = NOW) {
  const request: BookingRequest = {
    start: timeToMinutes(start),
    end: timeToMinutes(end),
    now: timeToMinutes(now),
    blocked,
    bookings: BOOKINGS,
  };
  const input: ExplanationInput = {
    roomLabel: 'Room A-101',
    start,
    end,
    isAvailable: canBook(request),
    reasonCode: availabilityReason(request),
  };
  return input;
}

const neverAnswers: ExplanationAdapter = () => new Promise(() => {});
const throws: ExplanationAdapter = async () => {
  throw new Error('503 Service Unavailable');
};

describe('normal cases: the checker decides, the mock explains', () => {
  test('E1 F2: an available request (11:00–12:00) is explained as available', async () => {
    const input = decide('11:00', '12:00');
    expect(input.reasonCode).toBe('available');
    expect(input.isAvailable).toBe(true);

    const result = await explainAvailability(input, mockAdapter, 500);
    expect(result.ok && result.source).toBe('model');
    if (!result.ok) throw new Error('expected an explanation');
    expect(result.isAvailable).toBe(true);
    expect(result.explanation).toMatch(/\bavailable\b/);
    expect(result.explanation).not.toMatch(/unavailable/);
  });

  test('E2 F2: an overlapping request (10:30–11:30) is unavailable and mentions the overlap', async () => {
    const input = decide('10:30', '11:30');
    expect(input.reasonCode).toBe('overlap');
    expect(input.isAvailable).toBe(false);

    const result = await explainAvailability(input, mockAdapter, 500);
    if (!result.ok) throw new Error('expected an explanation');
    expect(result.source).toBe('model');
    expect(result.isAvailable).toBe(false);
    expect(result.explanation).toMatch(/unavailable/);
    expect(result.explanation).toMatch(/overlap/);
  });

  test('E3 F2: a blocked room gives room_blocked', async () => {
    const input = decide('14:00', '15:00', true);
    expect(input.reasonCode).toBe('room_blocked');

    const result = await explainAvailability(input, mockAdapter, 500);
    if (!result.ok) throw new Error('expected an explanation');
    expect(result.isAvailable).toBe(false);
    expect(result.explanation).toMatch(/blocked/);
  });

  test('E4 F2: a reversed request (12:30–12:00) gives invalid_time', async () => {
    const input = decide('12:30', '12:00');
    expect(input.reasonCode).toBe('invalid_time');

    const result = await explainAvailability(input, mockAdapter, 500);
    if (!result.ok) throw new Error('expected an explanation');
    expect(result.isAvailable).toBe(false);
    expect(result.explanation).toMatch(/unavailable/);
  });

  test('E5 F2: a request in the past (08:00–08:30 at 09:00) gives past_time', async () => {
    const input = decide('08:00', '08:30');
    expect(input.reasonCode).toBe('past_time');

    const result = await explainAvailability(input, mockAdapter, 500);
    if (!result.ok) throw new Error('expected an explanation');
    expect(result.isAvailable).toBe(false);
    expect(result.explanation).toMatch(/passed/);
  });
});

describe('failure cases', () => {
  test('E6 F3: a blank room label is rejected before the adapter is called', async () => {
    const adapter = vi.fn(mockAdapter);
    const result = await explainAvailability({ ...decide('11:00', '12:00'), roomLabel: '   ' }, adapter, 500);
    expect(result.ok).toBe(false);
    expect(adapter).not.toHaveBeenCalled();
  });

  test('E7 F3: a 500-character room label is rejected', async () => {
    const adapter = vi.fn(mockAdapter);
    const result = await explainAvailability(
      { ...decide('11:00', '12:00'), roomLabel: 'R'.repeat(500) },
      adapter,
      500
    );
    expect(result.ok).toBe(false);
    expect(adapter).not.toHaveBeenCalled();
  });

  test('E8 F4: an adapter that never answers times out into the fallback', async () => {
    const input = decide('10:30', '11:30');
    const startedAt = Date.now();
    const result = await explainAvailability(input, neverAnswers, 50);
    const elapsed = Date.now() - startedAt;

    if (!result.ok || result.source !== 'fallback') throw new Error('expected the fallback');
    expect(result.fallbackReason).toBe('timeout');
    expect(result.explanation).toBe(fallbackExplanation(input));
    expect(result.isAvailable).toBe(false);
    expect(elapsed).toBeLessThan(1000);
  });

  test('E9 F4: an adapter that throws (simulated API failure) gives the fallback', async () => {
    const input = decide('11:00', '12:00');
    const result = await explainAvailability(input, throws, 500);

    if (!result.ok || result.source !== 'fallback') throw new Error('expected the fallback');
    expect(result.fallbackReason).toBe('adapter_error');
    expect(result.explanation).toBe('This request is available.');
    expect(result.isAvailable).toBe(true);
  });
});

describe('the output check (F2) and the decision (F1)', () => {
  test('F2: an answer that contradicts the decision is replaced by the fallback', async () => {
    const input = decide('10:30', '11:30'); // overlap -> unavailable
    const liar: ExplanationAdapter = async () => ({ explanation: 'Room A-101 is available, go ahead.' });
    const result = await explainAvailability(input, liar, 500);

    if (!result.ok || result.source !== 'fallback') throw new Error('expected the fallback');
    expect(result.fallbackReason).toBe('invalid_output');
    expect(result.isAvailable).toBe(false);
  });

  test('F2: an answer that names a time the request does not contain is replaced by the fallback', async () => {
    const input = decide('11:00', '12:00');
    const inventor: ExplanationAdapter = async () => ({
      explanation: 'Room A-101 is available for 11:00–12:00, and also at 16:00.',
    });
    const result = await explainAvailability(input, inventor, 500);
    expect(result.ok && result.source).toBe('fallback');
  });

  test('F1: the explanation never changes isAvailable or reasonCode', async () => {
    for (const [start, end, blocked] of [
      ['11:00', '12:00', false],
      ['10:30', '11:30', false],
      ['14:00', '15:00', true],
    ] as const) {
      const input = decide(start, end, blocked);
      for (const adapter of [mockAdapter, throws]) {
        const result = await explainAvailability(input, adapter, 200);
        if (!result.ok) throw new Error('expected an explanation');
        expect(result.isAvailable).toBe(input.isAvailable);
        expect(result.reasonCode).toBe(input.reasonCode);
      }
    }
  });
});

describe('review findings', () => {
  const overlap: ExplanationInput = {
    roomLabel: 'Room A-101',
    start: '10:30',
    end: '11:30',
    isAvailable: false,
    reasonCode: 'overlap',
  };

  test('V2 F2: an unavailable answer that also says the room is free (at 4 pm) is replaced by the fallback', async () => {
    const hedging: ExplanationAdapter = async () => ({
      explanation: 'Room A-101 is unavailable for 10:30–11:30. It is free at 4 pm instead.',
    });
    const result = await explainAvailability(overlap, hedging, 500);
    expect(result.ok && result.source).toBe('fallback');
  });

  test('V2 F2: an invented time written as 16.00 is replaced by the fallback', async () => {
    const inventor: ExplanationAdapter = async () => ({
      explanation: 'Room A-101 is unavailable for 10:30–11:30 because of a booking until 16.00.',
    });
    const result = await explainAvailability(overlap, inventor, 500);
    expect(result.ok && result.source).toBe('fallback');
  });
});
