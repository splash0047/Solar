import Papa from 'papaparse';
import { measurementSchema, type Measurement } from '@/data/schemas';
import { createId } from '@/lib/id';

export const CSV_COLUMNS = [
  'timestamp_ISO',
  'outdoorTemperature_C',
  'baselineIndoorTemperature_C',
  'systemIndoorTemperature_C',
  'relativeHumidity_percent',
  'solarIrradiance_W_m2',
  'fanPower_W',
  'sessionId',
] as const;

export interface CsvRowError {
  rowNumber: number;
  messages: string[];
}

export interface CsvImportResult {
  accepted: Measurement[];
  rejected: CsvRowError[];
}

function emptyToUndefined(value: unknown): unknown {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  if (text === '') return undefined;
  return text;
}

function parseRequiredNumber(
  raw: unknown,
  field: string,
  messages: string[],
): number | undefined {
  const text = emptyToUndefined(raw);
  if (text === undefined) {
    messages.push(`${field} is required and was empty. Empty cells are not treated as 0.`);
    return undefined;
  }
  const value = Number(text);
  if (!Number.isFinite(value)) {
    messages.push(`${field} is not a finite number (received "${String(raw)}").`);
    return undefined;
  }
  return value;
}

function parseOptionalNumber(
  raw: unknown,
  field: string,
  messages: string[],
): number | undefined {
  const text = emptyToUndefined(raw);
  if (text === undefined) return undefined;
  const value = Number(text);
  if (!Number.isFinite(value)) {
    messages.push(`${field} is not a finite number (received "${String(raw)}").`);
    return undefined;
  }
  return value;
}

function cell(
  record: Record<string, unknown>,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    if (key in record) return record[key];
  }
  const lower = Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k.trim().toLowerCase(), v]),
  );
  for (const key of keys) {
    const found = lower[key.toLowerCase()];
    if (found !== undefined) return found;
  }
  return undefined;
}

export function parseMeasurementCsv(
  text: string,
  sessionId: string,
): CsvImportResult {
  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: 'greedy',
  });

  const rejected: CsvRowError[] = [];
  const accepted: Measurement[] = [];

  if (parsed.errors.length > 0) {
    for (const error of parsed.errors) {
      rejected.push({
        rowNumber: typeof error.row === 'number' ? error.row + 2 : 1,
        messages: [error.message],
      });
    }
  }

  parsed.data.forEach((record, index) => {
    const rowNumber = index + 2;
    const messages: string[] = [];
    const timestamp = emptyToUndefined(
      cell(record, 'timestamp_ISO', 'timestamp', 'time'),
    );

    const outdoor = parseRequiredNumber(
      cell(record, 'outdoorTemperature_C', 'outdoorTemperatureC', 'outdoor'),
      'outdoorTemperature_C',
      messages,
    );
    const baseline = parseRequiredNumber(
      cell(
        record,
        'baselineIndoorTemperature_C',
        'baselineIndoorTemperatureC',
        'baseline',
      ),
      'baselineIndoorTemperature_C',
      messages,
    );
    const system = parseRequiredNumber(
      cell(
        record,
        'systemIndoorTemperature_C',
        'systemIndoorTemperatureC',
        'system',
      ),
      'systemIndoorTemperature_C',
      messages,
    );
    const humidity = parseOptionalNumber(
      cell(record, 'relativeHumidity_percent', 'relativeHumidityPercent', 'humidity'),
      'relativeHumidity_percent',
      messages,
    );
    const irradiance = parseOptionalNumber(
      cell(record, 'solarIrradiance_W_m2', 'solarIrradianceWm2', 'irradiance'),
      'solarIrradiance_W_m2',
      messages,
    );
    const fanPower = parseOptionalNumber(
      cell(record, 'fanPower_W', 'fanPowerW', 'fan'),
      'fanPower_W',
      messages,
    );

    const candidate = {
      id: createId(),
      sessionId,
      timestamp,
      outdoorTemperatureC: outdoor,
      baselineIndoorTemperatureC: baseline,
      systemIndoorTemperatureC: system,
      ...(humidity !== undefined ? { relativeHumidityPercent: humidity } : {}),
      ...(irradiance !== undefined ? { solarIrradianceWm2: irradiance } : {}),
      ...(fanPower !== undefined ? { fanPowerW: fanPower } : {}),
    };

    const result = measurementSchema.safeParse(candidate);
    if (!result.success) {
      messages.push(
        ...result.error.issues.map((issue) => issue.message),
      );
    }

    if (messages.length > 0 || !result.success) {
      rejected.push({
        rowNumber,
        messages: [...new Set(messages)],
      });
      return;
    }

    accepted.push(result.data);
  });

  return { accepted, rejected };
}

export function measurementsToCsv(
  measurements: Measurement[],
): string {
  const rows = measurements.map((row) => ({
    timestamp_ISO: row.timestamp,
    outdoorTemperature_C: row.outdoorTemperatureC,
    baselineIndoorTemperature_C: row.baselineIndoorTemperatureC,
    systemIndoorTemperature_C: row.systemIndoorTemperatureC,
    relativeHumidity_percent: row.relativeHumidityPercent ?? '',
    solarIrradiance_W_m2: row.solarIrradianceWm2 ?? '',
    fanPower_W: row.fanPowerW ?? '',
    sessionId: row.sessionId,
  }));

  return Papa.unparse({
    fields: [...CSV_COLUMNS],
    data: rows,
  });
}

export function downloadTextFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
