import { describe, expect, it } from 'vitest';
import { measurementsToCsv, parseMeasurementCsv } from './csv';
import type { Measurement } from '@/data/schemas';

describe('parseMeasurementCsv', () => {
  it('accepts well-formed rows and preserves units by column name', () => {
    const csv = [
      'timestamp_ISO,outdoorTemperature_C,baselineIndoorTemperature_C,systemIndoorTemperature_C,relativeHumidity_percent,solarIrradiance_W_m2,fanPower_W',
      '2024-05-12T08:00:00.000Z,31.2,33.8,32.4,48,420,',
    ].join('\n');
    const result = parseMeasurementCsv(csv, 'session-1');
    expect(result.rejected).toEqual([]);
    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0]?.outdoorTemperatureC).toBe(31.2);
    expect(result.accepted[0]?.fanPowerW).toBeUndefined();
    expect(result.accepted[0]?.sessionId).toBe('session-1');
  });

  it('rejects empty required cells instead of converting them to zero', () => {
    const csv = [
      'timestamp_ISO,outdoorTemperature_C,baselineIndoorTemperature_C,systemIndoorTemperature_C',
      '2024-05-12T08:00:00.000Z,,33.8,32.4',
    ].join('\n');
    const result = parseMeasurementCsv(csv, 'session-1');
    expect(result.accepted).toHaveLength(0);
    expect(result.rejected[0]?.rowNumber).toBe(2);
    expect(result.rejected[0]?.messages.join(' ')).toMatch(/empty/i);
  });

  it('rejects malformed timestamps with the affected row number', () => {
    const csv = [
      'timestamp_ISO,outdoorTemperature_C,baselineIndoorTemperature_C,systemIndoorTemperature_C',
      '12/05/2024,31,33,32',
    ].join('\n');
    const result = parseMeasurementCsv(csv, 'session-1');
    expect(result.accepted).toHaveLength(0);
    expect(result.rejected[0]?.rowNumber).toBe(2);
    expect(result.rejected[0]?.messages.join(' ')).toMatch(/timestamp/i);
  });

  it('rejects impossible temperatures', () => {
    const csv = [
      'timestamp_ISO,outdoorTemperature_C,baselineIndoorTemperature_C,systemIndoorTemperature_C',
      '2024-05-12T08:00:00.000Z,900,33,32',
    ].join('\n');
    const result = parseMeasurementCsv(csv, 'session-1');
    expect(result.accepted).toHaveLength(0);
    expect(result.rejected[0]?.messages.join(' ')).toMatch(/80/);
  });
});

describe('measurementsToCsv', () => {
  it('exports unit-labelled headers and ISO timestamps', () => {
    const rows: Measurement[] = [
      {
        id: 'm1',
        sessionId: 's1',
        timestamp: '2024-05-12T08:00:00.000Z',
        outdoorTemperatureC: 31.2,
        baselineIndoorTemperatureC: 33.8,
        systemIndoorTemperatureC: 32.4,
      },
    ];
    const csv = measurementsToCsv(rows);
    expect(csv).toMatch(/timestamp_ISO/);
    expect(csv).toMatch(/outdoorTemperature_C/);
    expect(csv).toMatch(/2024-05-12T08:00:00.000Z/);
    expect(csv).toMatch(/31.2/);
  });
});
