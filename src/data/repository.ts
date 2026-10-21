import { db } from '@/data/db';
import {
  costConfigurationSchema,
  experimentSessionSchema,
  measurementSchema,
  type CostConfiguration,
  type ExperimentSession,
  type Measurement,
  type MeasurementDraft,
  type SessionDraft,
} from '@/data/schemas';
import {
  ILLUSTRATIVE_SESSION_ID,
  illustrativeMeasurements,
  illustrativeSession,
} from '@/data/sample';
import { createId } from '@/lib/id';
import { materialList } from '@/content/guidance';

const COST_CONFIG_ID = 'default';

export async function listSessions(): Promise<ExperimentSession[]> {
  const rows = await db.sessions.orderBy('createdAt').reverse().toArray();
  return rows.map((row) => experimentSessionSchema.parse(row));
}

export async function getSession(
  id: string,
): Promise<ExperimentSession | undefined> {
  const row = await db.sessions.get(id);
  return row ? experimentSessionSchema.parse(row) : undefined;
}

export async function createSession(
  draft: SessionDraft,
  options?: { isIllustrative?: boolean },
): Promise<ExperimentSession> {
  const now = new Date().toISOString();
  const session = experimentSessionSchema.parse({
    ...draft,
    id: createId(),
    isIllustrative: options?.isIllustrative ?? false,
    createdAt: now,
    updatedAt: now,
  });
  await db.sessions.add(session);
  return session;
}

export async function updateSession(
  id: string,
  draft: SessionDraft,
): Promise<ExperimentSession> {
  const existing = await getSession(id);
  if (!existing) {
    throw new Error(`Session ${id} was not found.`);
  }
  const session = experimentSessionSchema.parse({
    ...existing,
    ...draft,
    updatedAt: new Date().toISOString(),
  });
  await db.sessions.put(session);
  return session;
}

export async function deleteSession(id: string): Promise<void> {
  await db.transaction('rw', db.sessions, db.measurements, async () => {
    await db.measurements.where('sessionId').equals(id).delete();
    await db.sessions.delete(id);
  });
}

export async function listMeasurements(
  sessionId: string,
): Promise<Measurement[]> {
  const rows = await db.measurements.where('sessionId').equals(sessionId).toArray();
  return rows
    .map((row) => measurementSchema.parse(row))
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
}

export async function createMeasurement(
  sessionId: string,
  draft: MeasurementDraft,
): Promise<Measurement> {
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} was not found.`);
  }
  const measurement = measurementSchema.parse({
    ...draft,
    id: createId(),
    sessionId,
  });
  await db.measurements.add(measurement);
  return measurement;
}

export async function updateMeasurement(
  id: string,
  draft: MeasurementDraft,
): Promise<Measurement> {
  const existing = await db.measurements.get(id);
  if (!existing) {
    throw new Error(`Measurement ${id} was not found.`);
  }
  const measurement = measurementSchema.parse({
    ...existing,
    ...draft,
    id: existing.id,
    sessionId: existing.sessionId,
  });
  await db.measurements.put(measurement);
  return measurement;
}

export async function deleteMeasurement(id: string): Promise<void> {
  await db.measurements.delete(id);
}

export async function importMeasurements(
  sessionId: string,
  rows: Measurement[],
): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} was not found.`);
  }
  const parsed = rows.map((row) =>
    measurementSchema.parse({ ...row, sessionId }),
  );
  await db.measurements.bulkAdd(parsed);
}

export async function seedIllustrativeSample(): Promise<void> {
  await db.transaction('rw', db.sessions, db.measurements, async () => {
    await db.measurements.where('sessionId').equals(ILLUSTRATIVE_SESSION_ID).delete();
    await db.sessions.delete(ILLUSTRATIVE_SESSION_ID);
    await db.sessions.add(experimentSessionSchema.parse(illustrativeSession));
    await db.measurements.bulkAdd(
      illustrativeMeasurements.map((row) => measurementSchema.parse(row)),
    );
  });
}

export async function removeIllustrativeSample(): Promise<void> {
  await deleteSession(ILLUSTRATIVE_SESSION_ID);
}

function defaultCostConfiguration(): CostConfiguration {
  return costConfigurationSchema.parse({
    id: COST_CONFIG_ID,
    materials: materialList.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: 0,
      unitCostInr: 0,
      notes: `${item.unit} — enter a local quote. No catalogue price is published here.`,
    })),
    installationCostInr: 0,
    incrementalCostInr: 0,
    baselinePowerW: 0,
    proposedPowerW: 0,
    operatingHoursPerDay: 0,
    operatingDaysPerYear: 0,
    electricityTariffPerKWh: 0,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCostConfiguration(): Promise<CostConfiguration> {
  const existing = await db.costConfigs.get(COST_CONFIG_ID);
  if (existing) return costConfigurationSchema.parse(existing);
  const created = defaultCostConfiguration();
  await db.costConfigs.put(created);
  return created;
}

export async function saveCostConfiguration(
  config: CostConfiguration,
): Promise<CostConfiguration> {
  const parsed = costConfigurationSchema.parse({
    ...config,
    id: COST_CONFIG_ID,
    updatedAt: new Date().toISOString(),
  });
  await db.costConfigs.put(parsed);
  return parsed;
}

export async function resetCostConfiguration(): Promise<CostConfiguration> {
  const created = defaultCostConfiguration();
  await db.costConfigs.put(created);
  return created;
}
