import { z } from 'zod';

export const TEMPERATURE_MIN_C = -40;
export const TEMPERATURE_MAX_C = 80;

const finiteNumber = z.number({ error: 'Value must be a number.' }).finite({
  error: 'Value must be a finite number.',
});

export const temperatureCSchema = finiteNumber
  .min(TEMPERATURE_MIN_C, {
    error: `Temperature must be at least ${TEMPERATURE_MIN_C} °C.`,
  })
  .max(TEMPERATURE_MAX_C, {
    error: `Temperature must be at most ${TEMPERATURE_MAX_C} °C.`,
  });

const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?)?$/;

export const isoTimestampSchema = z
  .string()
  .trim()
  .min(1, { error: 'Timestamp is required.' })
  .refine(
    (value) => ISO_TIMESTAMP_PATTERN.test(value) && Number.isFinite(Date.parse(value)),
    {
      error: 'Timestamp must be a valid ISO-8601 date or datetime (e.g. 2024-05-12T08:00:00Z).',
    },
  );

export const experimentSessionSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(160),
  date: z
    .string()
    .trim()
    .min(1)
    .refine((value) => Number.isFinite(Date.parse(value)), {
      error: 'Date must be a valid calendar date.',
    }),
  locationLabel: z.string().trim().min(1, { error: 'Location is required.' }).max(160),
  configuration: z.string().trim().min(1, { error: 'Configuration is required.' }),
  sensorDetails: z.string().trim().min(1, { error: 'Sensor details are required.' }),
  notes: z.string().trim(),
  isIllustrative: z.boolean(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export const measurementSchema = z.object({
  id: z.string().min(1),
  sessionId: z.string().min(1),
  timestamp: isoTimestampSchema,
  outdoorTemperatureC: temperatureCSchema,
  baselineIndoorTemperatureC: temperatureCSchema,
  systemIndoorTemperatureC: temperatureCSchema,
  relativeHumidityPercent: finiteNumber.min(0).max(100).optional(),
  solarIrradianceWm2: finiteNumber.min(0).max(1600).optional(),
  fanPowerW: finiteNumber.min(0).max(2000).optional(),
});

export const sessionDraftSchema = experimentSessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isIllustrative: true,
});

export const measurementDraftSchema = measurementSchema.omit({
  id: true,
  sessionId: true,
});

export const materialLineSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, { error: 'Material name is required.' }),
  quantity: finiteNumber.min(0),
  unitCostInr: finiteNumber.min(0),
  notes: z.string().trim(),
});

export const costConfigurationSchema = z.object({
  id: z.string().min(1),
  materials: z.array(materialLineSchema),
  installationCostInr: finiteNumber.min(0),
  incrementalCostInr: finiteNumber.min(0),
  baselinePowerW: finiteNumber.min(0),
  proposedPowerW: finiteNumber.min(0),
  operatingHoursPerDay: finiteNumber.min(0).max(24),
  operatingDaysPerYear: finiteNumber.min(0).max(366),
  electricityTariffPerKWh: finiteNumber.min(0),
  updatedAt: isoTimestampSchema,
});

export type ExperimentSession = z.infer<typeof experimentSessionSchema>;
export type Measurement = z.infer<typeof measurementSchema>;
export type SessionDraft = z.infer<typeof sessionDraftSchema>;
export type MeasurementDraft = z.infer<typeof measurementDraftSchema>;
export type MaterialLine = z.infer<typeof materialLineSchema>;
export type CostConfiguration = z.infer<typeof costConfigurationSchema>;
