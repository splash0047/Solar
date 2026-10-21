import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Download,
  FlaskConical,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Field } from '@/components/ui/label';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Spinner } from '@/components/ui/loading';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import {
  createMeasurement,
  createSession,
  deleteMeasurement,
  deleteSession,
  listMeasurements,
  listSessions,
  removeIllustrativeSample,
  seedIllustrativeSample,
  updateMeasurement,
  updateSession,
  importMeasurements,
} from '@/data/repository';
import {
  measurementDraftSchema,
  sessionDraftSchema,
  type ExperimentSession,
  type Measurement,
  type MeasurementDraft,
  type SessionDraft,
} from '@/data/schemas';
import { downloadTextFile, measurementsToCsv, parseMeasurementCsv } from '@/lib/csv';
import { formatNumber, formatTemperature, formatTimestamp } from '@/lib/format';
import { pairedObservations, summariseTemperatures } from '@/lib/stats';
import { TemperatureChart } from './dashboard/charts';

function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

export function DashboardPage() {
  const [sessions, setSessions] = React.useState<ExperimentSession[]>([]);
  const [measurements, setMeasurements] = React.useState<Measurement[]>([]);
  const [selectedId, setSelectedId] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [editingSession, setEditingSession] = React.useState(false);
  const [editingMeasurementId, setEditingMeasurementId] = React.useState<string | null>(
    null,
  );
  const [csvErrors, setCsvErrors] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const selected = sessions.find((session) => session.id === selectedId);

  const reload = React.useCallback(async (preferredId?: string) => {
    const listed = await listSessions();
    setError(null);
    setSessions(listed);
    const nextId = preferredId && listed.some((s) => s.id === preferredId)
      ? preferredId
      : listed[0]?.id ?? '';
    setSelectedId(nextId);
    if (nextId) {
      setMeasurements(await listMeasurements(nextId));
    } else {
      setMeasurements([]);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(async () => {
      try {
        await reload();
      } catch (cause: unknown) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Could not load sessions.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [reload]);

  React.useEffect(() => {
    let cancelled = false;
    if (!selectedId) {
      void Promise.resolve().then(() => {
        if (!cancelled) setMeasurements([]);
      });
      return;
    }
    void listMeasurements(selectedId)
      .then((data) => {
        if (!cancelled) setMeasurements(data);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Could not load measurements.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const summary = summariseTemperatures(measurements);
  const pairs = pairedObservations(measurements);

  async function handleCreateSession(draft: SessionDraft) {
    const created = await createSession(draft);
    setStatus('Session saved on this device.');
    await reload(created.id);
    setEditingSession(false);
  }

  async function handleUpdateSession(draft: SessionDraft) {
    if (!selected) return;
    await updateSession(selected.id, draft);
    setStatus('Session updated.');
    await reload(selected.id);
    setEditingSession(false);
  }

  async function handleDeleteSession() {
    if (!selected) return;
    if (
      !window.confirm(
        `Delete “${selected.title}” and every measurement in it? This cannot be undone.`,
      )
    ) {
      return;
    }
    await deleteSession(selected.id);
    setStatus('Session deleted.');
    await reload();
  }

  async function handleSaveMeasurement(draft: MeasurementDraft) {
    if (!selected) return;
    if (editingMeasurementId) {
      await updateMeasurement(editingMeasurementId, draft);
      setStatus('Measurement updated.');
    } else {
      await createMeasurement(selected.id, draft);
      setStatus('Measurement recorded.');
    }
    setEditingMeasurementId(null);
    setMeasurements(await listMeasurements(selected.id));
  }

  async function handleDeleteMeasurement(id: string) {
    if (!selected) return;
    if (!window.confirm('Delete this measurement?')) return;
    await deleteMeasurement(id);
    setMeasurements(await listMeasurements(selected.id));
    setStatus('Measurement deleted.');
  }

  async function handleExport() {
    if (!selected) return;
    const csv = measurementsToCsv(measurements);
    downloadTextFile(
      `${selected.title.replace(/\s+/g, '-').toLowerCase()}-measurements.csv`,
      csv,
      'text/csv;charset=utf-8',
    );
    setStatus('CSV exported with ISO timestamps and unit-labelled columns.');
  }

  async function handleImport(file: File) {
    if (!selected) return;
    const text = await file.text();
    const result = parseMeasurementCsv(text, selected.id);
    if (result.rejected.length > 0) {
      setCsvErrors(
        result.rejected
          .map((row) => `Row ${row.rowNumber}: ${row.messages.join(' ')}`)
          .join('\n'),
      );
    } else {
      setCsvErrors(null);
    }
    if (result.accepted.length > 0) {
      await importMeasurements(selected.id, result.accepted);
      setMeasurements(await listMeasurements(selected.id));
      setStatus(
        `Imported ${result.accepted.length} valid row${result.accepted.length === 1 ? '' : 's'}. ${result.rejected.length} row${result.rejected.length === 1 ? '' : 's'} rejected.`,
      );
    } else if (result.rejected.length > 0) {
      setStatus('No rows were imported. Invalid rows were not converted to zero.');
    }
  }

  return (
    <main id="main-content">
      <PageHeader
        eyebrow="Experimental dashboard"
        title="Record paired temperatures. Do not invent them."
        description="Sessions and measurements stay in IndexedDB on this device. Charts and summary cards use only the selected session. Illustrative rows are badged and are not experimental evidence."
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <Banner tone="danger" title="Could not load data">
            {error}
          </Banner>
        ) : null}
        {status ? (
          <Banner tone="success" title="Saved">
            {status}
          </Banner>
        ) : null}

        {loading ? (
          <div className="flex items-center gap-3 text-sm text-charcoal-soft">
            <Spinner /> Loading local records…
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              void seedIllustrativeSample().then(() => reload(undefined)).then(() => {
                setStatus('Illustrative sample loaded. It is labelled and separate from real tests.');
              });
            }}
            variant="secondary"
            size="sm"
          >
            Load illustrative sample
          </Button>
          <Button
            onClick={() => {
              void removeIllustrativeSample().then(() => reload()).then(() => {
                setStatus('Illustrative sample removed.');
              });
            }}
            variant="ghost"
            size="sm"
          >
            Remove illustrative sample
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Test sessions</CardTitle>
              <CardDescription>
                Each session records one configuration, one site and one sensor setup.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {sessions.length === 0 ? (
                <EmptyState
                  icon={<FlaskConical />}
                  title="No sessions yet"
                  description="Create a session, or load the illustrative sample to see how charts behave. The sample is not experimental evidence."
                />
              ) : (
                <Field label="Active session" htmlFor="session-select">
                  <Select
                    id="session-select"
                    value={selectedId}
                    onChange={(event) => setSelectedId(event.target.value)}
                  >
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title}
                        {session.isIllustrative ? ' (illustrative)' : ''}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}
              {selected ? (
                <div className="flex flex-col gap-2 rounded-control border border-line bg-ivory p-4 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display font-semibold text-forest">{selected.title}</p>
                    {selected.isIllustrative ? (
                      <Badge tone="solar">Illustrative — not evidence</Badge>
                    ) : (
                      <Badge tone="forest">Experimental record</Badge>
                    )}
                  </div>
                  <p className="text-charcoal-soft">{selected.locationLabel} · {selected.date}</p>
                  <p className="text-charcoal-soft">{selected.configuration}</p>
                  <p className="text-xs text-charcoal-faint">{selected.sensorDetails}</p>
                  {selected.notes ? (
                    <p className="text-xs text-charcoal-faint">{selected.notes}</p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setEditingSession(true)}>
                      <Pencil /> Edit session
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => void handleDeleteSession()}>
                      <Trash2 /> Delete
                    </Button>
                  </div>
                </div>
              ) : null}
              <Button
                variant="outline"
                onClick={() => {
                  setEditingSession(true);
                  setSelectedId('');
                }}
              >
                <Plus /> New session
              </Button>
            </CardContent>
          </Card>

          <SessionEditor
            key={editingSession ? selected?.id ?? 'new' : 'closed'}
            open={editingSession || sessions.length === 0}
            session={editingSession && selectedId ? selected : undefined}
            onCancel={() => setEditingSession(false)}
            onSubmit={(draft) =>
              selected && editingSession && selectedId
                ? handleUpdateSession(draft)
                : handleCreateSession(draft)
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Valid paired observations"
            value={summary.observationCount}
            caption={
              summary.excludedCount > 0
                ? `${summary.excludedCount} row${summary.excludedCount === 1 ? '' : 's'} excluded`
                : 'All stored rows were usable'
            }
            icon={<FlaskConical />}
          />
          <StatCard
            label="Mean paired reduction"
            value={
              summary.meanPairedReductionC === null
                ? '—'
                : formatNumber(summary.meanPairedReductionC, 2)
            }
            unit="°C"
            caption="baseline indoor − system indoor, then averaged over the same rows"
            tone="solar"
          />
          <StatCard
            label="Mean baseline indoor"
            value={
              summary.meanBaselineIndoorC === null
                ? '—'
                : formatNumber(summary.meanBaselineIndoorC, 1)
            }
            unit="°C"
          />
          <StatCard
            label="Mean system indoor"
            value={
              summary.meanSystemIndoorC === null
                ? '—'
                : formatNumber(summary.meanSystemIndoorC, 1)
            }
            unit="°C"
            tone="sage"
          />
        </div>

        {summary.exclusionReasons.length > 0 ? (
          <Banner tone="warning" title="Rows excluded from the paired statistic">
            <ul className="list-disc pl-4">
              {summary.exclusionReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </Banner>
        ) : null}

        {selected?.isIllustrative ? (
          <Banner tone="warning" title="Illustrative dataset">
            These numbers demonstrate the interface. They are not measurements from a
            physical prototype and must not appear in the project report as results.
          </Banner>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Temperature over time</CardTitle>
            <CardDescription>
              Outdoor, baseline indoor and system indoor for the selected session only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemperatureChart rows={pairs.rows} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {editingMeasurementId ? 'Edit measurement' : 'Record a measurement'}
            </CardTitle>
            <CardDescription>
              Required: timestamp, outdoor °C, baseline indoor °C, system indoor °C.
              Humidity, irradiance and fan power stay empty when they were not measured.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selected ? (
              <MeasurementEditor
                key={editingMeasurementId ?? 'new-measurement'}
                measurement={
                  editingMeasurementId
                    ? measurements.find((row) => row.id === editingMeasurementId)
                    : undefined
                }
                onSubmit={(draft) => handleSaveMeasurement(draft)}
                onCancel={() => setEditingMeasurementId(null)}
              />
            ) : (
              <EmptyState
                title="Create a session first"
                description="Measurements belong to a session so the configuration and sensors stay attached to the numbers."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Recorded observations</CardTitle>
              <CardDescription>
                CSV columns keep unit suffixes. Invalid imports are listed, never coerced to 0.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={!selected || measurements.length === 0}
                onClick={() => void handleExport()}
              >
                <Download /> Export CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!selected}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload /> Import CSV
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleImport(file);
                  event.target.value = '';
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {csvErrors ? (
              <Banner tone="danger" title="CSV rows rejected" className="mb-4">
                <pre className="whitespace-pre-wrap font-sans text-xs">{csvErrors}</pre>
              </Banner>
            ) : null}
            {measurements.length === 0 ? (
              <EmptyState
                title="No readings in this session"
                description="Enter a measurement or import a CSV with timestamp_ISO and the three temperature columns."
              />
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>Timestamp</TH>
                    <TH>Outdoor</TH>
                    <TH>Baseline indoor</TH>
                    <TH>System indoor</TH>
                    <TH>Δ paired</TH>
                    <TH>RH / irradiance / fan</TH>
                    <TH>
                      <span className="sr-only">Actions</span>
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {measurements.map((row) => (
                    <TR key={row.id}>
                      <TD className="whitespace-nowrap tabular-nums">
                        {formatTimestamp(row.timestamp)}
                      </TD>
                      <TD className="tabular-nums">
                        {formatTemperature(row.outdoorTemperatureC)}
                      </TD>
                      <TD className="tabular-nums">
                        {formatTemperature(row.baselineIndoorTemperatureC)}
                      </TD>
                      <TD className="tabular-nums">
                        {formatTemperature(row.systemIndoorTemperatureC)}
                      </TD>
                      <TD className="tabular-nums">
                        {formatNumber(
                          row.baselineIndoorTemperatureC - row.systemIndoorTemperatureC,
                          1,
                        )}{' '}
                        °C
                      </TD>
                      <TD className="text-xs text-charcoal-soft">
                        {[
                          row.relativeHumidityPercent !== undefined
                            ? `${row.relativeHumidityPercent} %`
                            : null,
                          row.solarIrradianceWm2 !== undefined
                            ? `${row.solarIrradianceWm2} W/m²`
                            : null,
                          row.fanPowerW !== undefined ? `${row.fanPowerW} W` : null,
                        ]
                          .filter(Boolean)
                          .join(' · ') || '—'}
                      </TD>
                      <TD>
                        <div className="flex gap-1">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Edit measurement"
                            onClick={() => setEditingMeasurementId(row.id)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Delete measurement"
                            onClick={() => void handleDeleteMeasurement(row.id)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function SessionEditor({
  open,
  session,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  session?: ExperimentSession;
  onSubmit: (draft: SessionDraft) => Promise<void>;
  onCancel: () => void;
}) {
  const form = useForm<SessionDraft>({
    resolver: zodResolver(sessionDraftSchema),
    defaultValues: session
      ? {
          title: session.title,
          date: session.date.slice(0, 10),
          locationLabel: session.locationLabel,
          configuration: session.configuration,
          sensorDetails: session.sensorDetails,
          notes: session.notes,
        }
      : {
          title: '',
          date: new Date().toISOString().slice(0, 10),
          locationLabel: '',
          configuration: '',
          sensorDetails: '',
          notes: '',
        },
  });

  if (!open) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{session ? 'Edit session' : 'New session'}</CardTitle>
        <CardDescription>
          Record what was actually installed and where the sensors sat. Leave notes empty if you have none.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
            form.reset();
          })}
        >
          <Field
            label="Title"
            htmlFor="session-title"
            required
            error={form.formState.errors.title?.message}
          >
            <Input id="session-title" {...form.register('title')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Test date"
              htmlFor="session-date"
              required
              error={form.formState.errors.date?.message}
            >
              <Input id="session-date" type="date" {...form.register('date')} />
            </Field>
            <Field
              label="Location"
              htmlFor="session-location"
              required
              error={form.formState.errors.locationLabel?.message}
            >
              <Input id="session-location" {...form.register('locationLabel')} />
            </Field>
          </div>
          <Field
            label="Configuration"
            htmlFor="session-config"
            required
            hint="Which components were installed, open or running?"
            error={form.formState.errors.configuration?.message}
          >
            <Textarea id="session-config" rows={3} {...form.register('configuration')} />
          </Field>
          <Field
            label="Sensor details"
            htmlFor="session-sensors"
            required
            hint="Model, stated accuracy, placement height and photograph reference."
            error={form.formState.errors.sensorDetails?.message}
          >
            <Textarea id="session-sensors" rows={3} {...form.register('sensorDetails')} />
          </Field>
          <Field label="Notes" htmlFor="session-notes">
            <Textarea id="session-notes" rows={2} {...form.register('notes')} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save session
            </Button>
            {session ? (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function optionalNumber(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : Number.NaN;
}

function MeasurementEditor({
  measurement,
  onSubmit,
  onCancel,
}: {
  measurement?: Measurement;
  onSubmit: (draft: MeasurementDraft) => Promise<void>;
  onCancel: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(measurementDraftSchema),
    defaultValues: {
      timestamp: measurement
        ? toDatetimeLocalValue(measurement.timestamp)
        : toDatetimeLocalValue(new Date().toISOString()),
      outdoorTemperatureC: measurement?.outdoorTemperatureC,
      baselineIndoorTemperatureC: measurement?.baselineIndoorTemperatureC,
      systemIndoorTemperatureC: measurement?.systemIndoorTemperatureC,
      relativeHumidityPercent: measurement?.relativeHumidityPercent,
      solarIrradianceWm2: measurement?.solarIrradianceWm2,
      fanPowerW: measurement?.fanPowerW,
    },
  });

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={form.handleSubmit(async (values) => {
        const draft: MeasurementDraft = {
          timestamp: fromDatetimeLocalValue(String(values.timestamp)),
          outdoorTemperatureC: Number(values.outdoorTemperatureC),
          baselineIndoorTemperatureC: Number(values.baselineIndoorTemperatureC),
          systemIndoorTemperatureC: Number(values.systemIndoorTemperatureC),
          relativeHumidityPercent: optionalNumber(values.relativeHumidityPercent),
          solarIrradianceWm2: optionalNumber(values.solarIrradianceWm2),
          fanPowerW: optionalNumber(values.fanPowerW),
        };
        const parsed = measurementDraftSchema.parse(draft);
        await onSubmit(parsed);
        form.reset();
      })}
    >
      <Field
        label="Timestamp"
        htmlFor="m-time"
        required
        error={form.formState.errors.timestamp?.message}
      >
        <Input id="m-time" type="datetime-local" {...form.register('timestamp')} />
      </Field>
      <Field
        label="Outdoor temperature"
        htmlFor="m-out"
        unit="°C"
        required
        error={form.formState.errors.outdoorTemperatureC?.message}
      >
        <Input
          id="m-out"
          type="number"
          step="0.1"
          {...form.register('outdoorTemperatureC', { valueAsNumber: true })}
        />
      </Field>
      <Field
        label="Baseline indoor"
        htmlFor="m-base"
        unit="°C"
        required
        error={form.formState.errors.baselineIndoorTemperatureC?.message}
      >
        <Input
          id="m-base"
          type="number"
          step="0.1"
          {...form.register('baselineIndoorTemperatureC', { valueAsNumber: true })}
        />
      </Field>
      <Field
        label="System indoor"
        htmlFor="m-sys"
        unit="°C"
        required
        error={form.formState.errors.systemIndoorTemperatureC?.message}
      >
        <Input
          id="m-sys"
          type="number"
          step="0.1"
          {...form.register('systemIndoorTemperatureC', { valueAsNumber: true })}
        />
      </Field>
      <Field
        label="Relative humidity"
        htmlFor="m-rh"
        unit="%"
        hint="Leave empty if not measured."
        error={form.formState.errors.relativeHumidityPercent?.message}
      >
        <Input
          id="m-rh"
          type="number"
          step="0.1"
          {...form.register('relativeHumidityPercent', {
            setValueAs: (value) => (value === '' ? undefined : Number(value)),
          })}
        />
      </Field>
      <Field
        label="Solar irradiance"
        htmlFor="m-irr"
        unit="W/m²"
        hint="Leave empty if not measured."
        error={form.formState.errors.solarIrradianceWm2?.message}
      >
        <Input
          id="m-irr"
          type="number"
          step="1"
          {...form.register('solarIrradianceWm2', {
            setValueAs: (value) => (value === '' ? undefined : Number(value)),
          })}
        />
      </Field>
      <Field
        label="Fan power"
        htmlFor="m-fan"
        unit="W"
        hint="Only if the active fan ran during this reading."
        error={form.formState.errors.fanPowerW?.message}
      >
        <Input
          id="m-fan"
          type="number"
          step="0.1"
          {...form.register('fanPowerW', {
            setValueAs: (value) => (value === '' ? undefined : Number(value)),
          })}
        />
      </Field>
      <div className="flex items-end gap-2 md:col-span-2">
        <Button type="submit">
          {measurement ? 'Update measurement' : 'Add measurement'}
        </Button>
        {measurement ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel edit
          </Button>
        ) : null}
      </div>
    </form>
  );
}
