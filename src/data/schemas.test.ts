import { describe, expect, it } from 'vitest';
import { measurementSchema, experimentSessionSchema } from './schemas';

describe('measurementSchema', () => {
  it('accepts a complete paired reading', () => {
    const parsed = measurementSchema.parse({
      id: 'm1',
      sessionId: 's1',
      timestamp: '2024-05-12T08:00:00.000Z',
      outdoorTemperatureC: 31,
      baselineIndoorTemperatureC: 34,
      systemIndoorTemperatureC: 32,
    });
    expect(parsed.outdoorTemperatureC).toBe(31);
    expect(parsed.relativeHumidityPercent).toBeUndefined();
  });

  it('rejects humidity outside 0–100', () => {
    const result = measurementSchema.safeParse({
      id: 'm1',
      sessionId: 's1',
      timestamp: '2024-05-12T08:00:00.000Z',
      outdoorTemperatureC: 31,
      baselineIndoorTemperatureC: 34,
      systemIndoorTemperatureC: 32,
      relativeHumidityPercent: 140,
    });
    expect(result.success).toBe(false);
  });
});

describe('experimentSessionSchema', () => {
  it('requires configuration and sensor details', () => {
    const result = experimentSessionSchema.safeParse({
      id: 's1',
      title: 'Test',
      date: '2024-05-12',
      locationLabel: 'Site',
      configuration: '',
      sensorDetails: '',
      notes: '',
      isIllustrative: false,
      createdAt: '2024-05-12T08:00:00.000Z',
      updatedAt: '2024-05-12T08:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });
});
