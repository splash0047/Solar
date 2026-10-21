import { beforeEach, describe, expect, it } from 'vitest';
import { db } from './db';
import {
  createMeasurement,
  createSession,
  deleteMeasurement,
  deleteSession,
  getCostConfiguration,
  listMeasurements,
  listSessions,
  saveCostConfiguration,
  seedIllustrativeSample,
} from './repository';
import { ILLUSTRATIVE_SESSION_ID } from './sample';

beforeEach(async () => {
  await db.measurements.clear();
  await db.sessions.clear();
  await db.costConfigs.clear();
});

describe('experiment repository', () => {
  it('persists sessions and measurements', async () => {
    const session = await createSession({
      title: 'Workshop day 1',
      date: '2024-05-12',
      locationLabel: 'Wardha',
      configuration: 'Shading + insulation, fan off',
      sensorDetails: 'Two DS18B20 sensors, ±0.5 °C, 1.2 m above floor',
      notes: '',
    });
    await createMeasurement(session.id, {
      timestamp: '2024-05-12T08:00:00.000Z',
      outdoorTemperatureC: 31,
      baselineIndoorTemperatureC: 34,
      systemIndoorTemperatureC: 32.5,
    });
    const listed = await listSessions();
    expect(listed).toHaveLength(1);
    const measurements = await listMeasurements(session.id);
    expect(measurements).toHaveLength(1);
    expect(measurements[0]?.systemIndoorTemperatureC).toBe(32.5);
  });

  it('deletes measurements independently and cascades on session delete', async () => {
    const session = await createSession({
      title: 'Session',
      date: '2024-05-12',
      locationLabel: 'Site',
      configuration: 'Baseline only',
      sensorDetails: 'Logger A',
      notes: '',
    });
    const first = await createMeasurement(session.id, {
      timestamp: '2024-05-12T08:00:00.000Z',
      outdoorTemperatureC: 30,
      baselineIndoorTemperatureC: 32,
      systemIndoorTemperatureC: 31,
    });
    await createMeasurement(session.id, {
      timestamp: '2024-05-12T09:00:00.000Z',
      outdoorTemperatureC: 31,
      baselineIndoorTemperatureC: 33,
      systemIndoorTemperatureC: 32,
    });
    await deleteMeasurement(first.id);
    expect(await listMeasurements(session.id)).toHaveLength(1);
    await deleteSession(session.id);
    expect(await listSessions()).toHaveLength(0);
    expect(await listMeasurements(session.id)).toHaveLength(0);
  });

  it('keeps the illustrative sample in its own namespace', async () => {
    await seedIllustrativeSample();
    const sessions = await listSessions();
    expect(sessions[0]?.id).toBe(ILLUSTRATIVE_SESSION_ID);
    expect(sessions[0]?.isIllustrative).toBe(true);
    const measurements = await listMeasurements(ILLUSTRATIVE_SESSION_ID);
    expect(measurements.length).toBeGreaterThan(0);
  });
});

describe('cost configuration', () => {
  it('round-trips user-entered costs without inventing prices', async () => {
    const initial = await getCostConfiguration();
    expect(initial.installationCostInr).toBe(0);
    const saved = await saveCostConfiguration({
      ...initial,
      installationCostInr: 2500,
      electricityTariffPerKWh: 7.5,
    });
    expect(saved.installationCostInr).toBe(2500);
    const reloaded = await getCostConfiguration();
    expect(reloaded.electricityTariffPerKWh).toBe(7.5);
  });
});
