import type { ExperimentSession, Measurement } from '@/data/schemas';

/** Namespace for demonstration rows. Never mix into experimental evidence. */
export const ILLUSTRATIVE_SESSION_ID = 'illustrative-sample-v1';

export const illustrativeSession: ExperimentSession = {
  id: ILLUSTRATIVE_SESSION_ID,
  title: 'Illustrative sample — not experimental evidence',
  date: '2024-05-12',
  locationLabel: 'Conceptual workshop (sample)',
  configuration:
    'Sample configuration used only to demonstrate charts and CSV. Not a measured prototype.',
  sensorDetails:
    'Illustrative values. Sensor model, accuracy and placement were not recorded because this is not a real test.',
  notes:
    'These rows exist so the dashboard can be demonstrated before field data is entered. Reset them at any time. They are excluded from any claim presented as experimental evidence.',
  isIllustrative: true,
  createdAt: '2024-05-12T04:00:00.000Z',
  updatedAt: '2024-05-12T04:00:00.000Z',
};

export const illustrativeMeasurements: Measurement[] = [
  {
    id: 'illust-m1',
    sessionId: ILLUSTRATIVE_SESSION_ID,
    timestamp: '2024-05-12T08:00:00.000Z',
    outdoorTemperatureC: 31.2,
    baselineIndoorTemperatureC: 33.8,
    systemIndoorTemperatureC: 32.4,
    relativeHumidityPercent: 48,
    solarIrradianceWm2: 420,
  },
  {
    id: 'illust-m2',
    sessionId: ILLUSTRATIVE_SESSION_ID,
    timestamp: '2024-05-12T10:00:00.000Z',
    outdoorTemperatureC: 34.6,
    baselineIndoorTemperatureC: 37.1,
    systemIndoorTemperatureC: 35.2,
    relativeHumidityPercent: 42,
    solarIrradianceWm2: 710,
    fanPowerW: 18,
  },
  {
    id: 'illust-m3',
    sessionId: ILLUSTRATIVE_SESSION_ID,
    timestamp: '2024-05-12T12:00:00.000Z',
    outdoorTemperatureC: 37.4,
    baselineIndoorTemperatureC: 40.2,
    systemIndoorTemperatureC: 37.9,
    relativeHumidityPercent: 36,
    solarIrradianceWm2: 890,
    fanPowerW: 18,
  },
  {
    id: 'illust-m4',
    sessionId: ILLUSTRATIVE_SESSION_ID,
    timestamp: '2024-05-12T14:00:00.000Z',
    outdoorTemperatureC: 38.1,
    baselineIndoorTemperatureC: 41.0,
    systemIndoorTemperatureC: 38.6,
    relativeHumidityPercent: 34,
    solarIrradianceWm2: 840,
    fanPowerW: 18,
  },
  {
    id: 'illust-m5',
    sessionId: ILLUSTRATIVE_SESSION_ID,
    timestamp: '2024-05-12T16:00:00.000Z',
    outdoorTemperatureC: 36.0,
    baselineIndoorTemperatureC: 39.4,
    systemIndoorTemperatureC: 36.8,
    relativeHumidityPercent: 39,
    solarIrradianceWm2: 510,
  },
  {
    id: 'illust-m6',
    sessionId: ILLUSTRATIVE_SESSION_ID,
    timestamp: '2024-05-12T18:00:00.000Z',
    outdoorTemperatureC: 32.8,
    baselineIndoorTemperatureC: 36.2,
    systemIndoorTemperatureC: 34.1,
    relativeHumidityPercent: 46,
    solarIrradianceWm2: 120,
  },
];
