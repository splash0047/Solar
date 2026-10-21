import Dexie, { type EntityTable } from 'dexie';
import type {
  CostConfiguration,
  ExperimentSession,
  Measurement,
} from '@/data/schemas';

export class SolarCoolDatabase extends Dexie {
  sessions!: EntityTable<ExperimentSession, 'id'>;
  measurements!: EntityTable<Measurement, 'id'>;
  costConfigs!: EntityTable<CostConfiguration, 'id'>;

  constructor() {
    super('solarcool-rural');
    this.version(1).stores({
      sessions: 'id, date, createdAt, isIllustrative',
      measurements: 'id, sessionId, timestamp',
      costConfigs: 'id',
    });
  }
}

export const db = new SolarCoolDatabase();
