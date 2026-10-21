import { describe, expect, it } from 'vitest';
import type { Measurement } from '@/data/schemas';
import { pairedObservations, summariseTemperatures } from './stats';

function row(partial: Partial<Measurement> & Pick<Measurement, 'id'>): Measurement {
  return {
    sessionId: 's1',
    timestamp: '2024-05-12T08:00:00.000Z',
    outdoorTemperatureC: 30,
    baselineIndoorTemperatureC: 34,
    systemIndoorTemperatureC: 32,
    ...partial,
  };
}

describe('pairedObservations', () => {
  it('computes reduction on the same row, not from unrelated averages', () => {
    const { rows } = pairedObservations([
      row({
        id: 'a',
        timestamp: '2024-05-12T08:00:00.000Z',
        baselineIndoorTemperatureC: 34,
        systemIndoorTemperatureC: 31,
      }),
      row({
        id: 'b',
        timestamp: '2024-05-12T10:00:00.000Z',
        baselineIndoorTemperatureC: 36,
        systemIndoorTemperatureC: 35,
      }),
    ]);
    expect(rows.map((item) => item.pairedReductionC)).toEqual([3, 1]);
  });

  it('excludes rows with an invalid timestamp and reports the count', () => {
    const { rows, excludedCount, exclusionReasons } = pairedObservations([
      row({ id: 'ok' }),
      row({ id: 'bad', timestamp: 'not-a-date' }),
    ]);
    expect(rows).toHaveLength(1);
    expect(excludedCount).toBe(1);
    expect(exclusionReasons[0]).toMatch(/timestamp/i);
  });
});

describe('summariseTemperatures', () => {
  it('reports observation count and paired mean', () => {
    const summary = summariseTemperatures([
      row({ id: 'a', baselineIndoorTemperatureC: 34, systemIndoorTemperatureC: 32 }),
      row({
        id: 'b',
        timestamp: '2024-05-12T12:00:00.000Z',
        baselineIndoorTemperatureC: 36,
        systemIndoorTemperatureC: 33,
      }),
    ]);
    expect(summary.observationCount).toBe(2);
    expect(summary.meanPairedReductionC).toBe(2.5);
    expect(summary.meanBaselineIndoorC).toBe(35);
    expect(summary.meanSystemIndoorC).toBe(32.5);
  });

  it('does not subtract averages from unrelated periods', () => {
    const summary = summariseTemperatures([
      row({
        id: 'morning',
        timestamp: '2024-05-12T08:00:00.000Z',
        baselineIndoorTemperatureC: 30,
        systemIndoorTemperatureC: 29,
      }),
      row({
        id: 'afternoon',
        timestamp: '2024-05-12T15:00:00.000Z',
        baselineIndoorTemperatureC: 40,
        systemIndoorTemperatureC: 36,
      }),
    ]);
    const fromUnrelatedAverages =
      (30 + 40) / 2 - (29 + 36) / 2;
    expect(summary.meanPairedReductionC).toBeCloseTo(fromUnrelatedAverages, 10);
    expect(summary.meanPairedReductionC).toBe(2.5);
  });
});
