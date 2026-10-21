import type { Measurement } from '@/data/schemas';

export interface TemperatureSummary {
  observationCount: number;
  excludedCount: number;
  exclusionReasons: string[];
  meanBaselineIndoorC: number | null;
  meanSystemIndoorC: number | null;
  meanPairedReductionC: number | null;
  meanOutdoorC: number | null;
  meanBaselineMinusOutdoorC: number | null;
  meanSystemMinusOutdoorC: number | null;
  minObservedC: number | null;
  maxObservedC: number | null;
}

export interface PairedObservation {
  timestamp: string;
  outdoorTemperatureC: number;
  baselineIndoorTemperatureC: number;
  systemIndoorTemperatureC: number;
  pairedReductionC: number;
  relativeHumidityPercent?: number;
  solarIrradianceWm2?: number;
  fanPowerW?: number;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function pairedObservations(measurements: Measurement[]): {
  rows: PairedObservation[];
  excludedCount: number;
  exclusionReasons: string[];
} {
  const rows: PairedObservation[] = [];
  const reasons: string[] = [];
  let excludedCount = 0;

  for (const row of measurements) {
    const missing: string[] = [];
    if (!isFiniteNumber(row.baselineIndoorTemperatureC)) missing.push('baseline indoor °C');
    if (!isFiniteNumber(row.systemIndoorTemperatureC)) missing.push('system indoor °C');
    if (!isFiniteNumber(row.outdoorTemperatureC)) missing.push('outdoor °C');
    if (!Number.isFinite(Date.parse(row.timestamp))) missing.push('timestamp');

    if (missing.length > 0) {
      excludedCount += 1;
      reasons.push(`Row ${row.id}: missing or invalid ${missing.join(', ')}.`);
      continue;
    }

    rows.push({
      timestamp: row.timestamp,
      outdoorTemperatureC: row.outdoorTemperatureC,
      baselineIndoorTemperatureC: row.baselineIndoorTemperatureC,
      systemIndoorTemperatureC: row.systemIndoorTemperatureC,
      pairedReductionC:
        row.baselineIndoorTemperatureC - row.systemIndoorTemperatureC,
      ...(isFiniteNumber(row.relativeHumidityPercent)
        ? { relativeHumidityPercent: row.relativeHumidityPercent }
        : {}),
      ...(isFiniteNumber(row.solarIrradianceWm2)
        ? { solarIrradianceWm2: row.solarIrradianceWm2 }
        : {}),
      ...(isFiniteNumber(row.fanPowerW) ? { fanPowerW: row.fanPowerW } : {}),
    });
  }

  rows.sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );

  return { rows, excludedCount, exclusionReasons: reasons };
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function summariseTemperatures(
  measurements: Measurement[],
): TemperatureSummary {
  const { rows, excludedCount, exclusionReasons } = pairedObservations(measurements);
  const allTemps = rows.flatMap((row) => [
    row.outdoorTemperatureC,
    row.baselineIndoorTemperatureC,
    row.systemIndoorTemperatureC,
  ]);

  return {
    observationCount: rows.length,
    excludedCount,
    exclusionReasons,
    meanBaselineIndoorC: mean(rows.map((row) => row.baselineIndoorTemperatureC)),
    meanSystemIndoorC: mean(rows.map((row) => row.systemIndoorTemperatureC)),
    meanPairedReductionC: mean(rows.map((row) => row.pairedReductionC)),
    meanOutdoorC: mean(rows.map((row) => row.outdoorTemperatureC)),
    meanBaselineMinusOutdoorC: mean(
      rows.map((row) => row.baselineIndoorTemperatureC - row.outdoorTemperatureC),
    ),
    meanSystemMinusOutdoorC: mean(
      rows.map((row) => row.systemIndoorTemperatureC - row.outdoorTemperatureC),
    ),
    minObservedC: allTemps.length ? Math.min(...allTemps) : null,
    maxObservedC: allTemps.length ? Math.max(...allTemps) : null,
  };
}
