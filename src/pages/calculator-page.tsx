import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/loading';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import {
  getCostConfiguration,
  resetCostConfiguration,
  saveCostConfiguration,
} from '@/data/repository';
import type { CostConfiguration, MaterialLine } from '@/data/schemas';
import { costConfigurationSchema } from '@/data/schemas';
import {
  calculateEnergy,
  calculateScenario,
  SCENARIO_FACTORS,
  type EnergyInputs,
  type ScenarioId,
} from '@/lib/energy';
import { createId } from '@/lib/id';
import { formatInr, formatNumber, formatYears } from '@/lib/format';

function toInputs(config: CostConfiguration): EnergyInputs {
  const materialCostInr = config.materials.reduce(
    (sum, line) => sum + line.quantity * line.unitCostInr,
    0,
  );
  return {
    baselinePowerW: config.baselinePowerW,
    proposedPowerW: config.proposedPowerW,
    operatingHoursPerDay: config.operatingHoursPerDay,
    operatingDaysPerYear: config.operatingDaysPerYear,
    electricityTariffPerKWh: config.electricityTariffPerKWh,
    materialCostInr,
    installationCostInr: config.installationCostInr,
    incrementalCostInr: config.incrementalCostInr,
  };
}

function parseNonNegative(raw: string): number {
  if (raw.trim() === '') return Number.NaN;
  return Number(raw);
}

export function CalculatorPage() {
  const [config, setConfig] = React.useState<CostConfiguration | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    getCostConfiguration()
      .then((value) => {
        if (!cancelled) setConfig(value);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Could not load cost data.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const inputs = config ? toInputs(config) : null;
  const result = inputs ? calculateEnergy(inputs) : null;
  const scenarios = inputs
    ? (Object.keys(SCENARIO_FACTORS) as ScenarioId[]).map((id) => ({
        id,
        ...SCENARIO_FACTORS[id],
        result: calculateScenario(inputs, id),
      }))
    : [];

  function update<K extends keyof CostConfiguration>(key: K, value: CostConfiguration[K]) {
    setConfig((current) => (current ? { ...current, [key]: value } : current));
  }

  function updateMaterial(id: string, patch: Partial<MaterialLine>) {
    setConfig((current) =>
      current
        ? {
            ...current,
            materials: current.materials.map((line) =>
              line.id === id ? { ...line, ...patch } : line,
            ),
          }
        : current,
    );
  }

  async function persist() {
    if (!config) return;
    const parsed = costConfigurationSchema.safeParse({
      ...config,
      updatedAt: new Date().toISOString(),
    });
    if (!parsed.success) {
      setError(parsed.error.issues.map((issue) => issue.message).join(' '));
      setStatus(null);
      return;
    }
    const saved = await saveCostConfiguration(parsed.data);
    setConfig(saved);
    setError(null);
    setStatus('Assumptions saved in this browser.');
  }

  return (
    <main id="main-content">
      <PageHeader
        eyebrow="Cost and savings"
        title="Estimates from your quotes, not from a catalogue."
        description="Every figure below is computed from the numbers you type. Watts are converted to kilowatts once. Payback is reported only when incremental cost and annual savings are both positive. A passive retrofit does not automatically replace an air conditioner."
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <Banner tone="warning" title="These are estimates">
          Enter local supplier quotes and an electrical baseline you can justify. Leaving
          power at 0 W means there is no electrical comparison — not a claim of zero
          consumption.
        </Banner>

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-charcoal-soft">
            <Spinner /> Loading saved assumptions…
          </p>
        ) : null}
        {error ? (
          <Banner tone="danger" title="Check the inputs">
            {error}
          </Banner>
        ) : null}
        {status ? (
          <Banner tone="success" title="Saved">
            {status}
          </Banner>
        ) : null}

        {config ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Materials and installation</CardTitle>
                <CardDescription>
                  Quantity × unit cost is summed. Empty or invalid cells are not treated as zero
                  until you enter a number.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Table>
                  <THead>
                    <TR>
                      <TH>Material</TH>
                      <TH>Quantity</TH>
                      <TH>Unit cost (INR)</TH>
                      <TH>Line total</TH>
                      <TH>Notes</TH>
                      <TH>
                        <span className="sr-only">Remove</span>
                      </TH>
                    </TR>
                  </THead>
                  <TBody>
                    {config.materials.map((line) => (
                      <TR key={line.id}>
                        <TD>
                          <Input
                            aria-label="Material name"
                            value={line.name}
                            onChange={(event) =>
                              updateMaterial(line.id, { name: event.target.value })
                            }
                          />
                        </TD>
                        <TD>
                          <Input
                            aria-label={`${line.name} quantity`}
                            type="number"
                            min={0}
                            step="0.01"
                            value={Number.isFinite(line.quantity) ? line.quantity : ''}
                            onChange={(event) =>
                              updateMaterial(line.id, {
                                quantity: parseNonNegative(event.target.value),
                              })
                            }
                          />
                        </TD>
                        <TD>
                          <Input
                            aria-label={`${line.name} unit cost`}
                            type="number"
                            min={0}
                            step="0.01"
                            value={Number.isFinite(line.unitCostInr) ? line.unitCostInr : ''}
                            onChange={(event) =>
                              updateMaterial(line.id, {
                                unitCostInr: parseNonNegative(event.target.value),
                              })
                            }
                          />
                        </TD>
                        <TD className="tabular-nums">
                          {Number.isFinite(line.quantity) && Number.isFinite(line.unitCostInr)
                            ? formatInr(line.quantity * line.unitCostInr)
                            : '—'}
                        </TD>
                        <TD>
                          <Input
                            aria-label={`${line.name} notes`}
                            value={line.notes}
                            onChange={(event) =>
                              updateMaterial(line.id, { notes: event.target.value })
                            }
                          />
                        </TD>
                        <TD>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Remove ${line.name}`}
                            onClick={() =>
                              update('materials', config.materials.filter((item) => item.id !== line.id))
                            }
                          >
                            <Trash2 />
                          </Button>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    update('materials', [
                      ...config.materials,
                      {
                        id: createId(),
                        name: 'New line',
                        quantity: Number.NaN,
                        unitCostInr: Number.NaN,
                        notes: '',
                      },
                    ])
                  }
                >
                  <Plus /> Add material line
                </Button>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Installation cost" unit="INR" htmlFor="install-cost">
                    <Input
                      id="install-cost"
                      type="number"
                      min={0}
                      value={
                        Number.isFinite(config.installationCostInr)
                          ? config.installationCostInr
                          : ''
                      }
                      onChange={(event) =>
                        update('installationCostInr', parseNonNegative(event.target.value))
                      }
                    />
                  </Field>
                  <Field
                    label="Incremental project cost"
                    unit="INR"
                    htmlFor="incremental-cost"
                    hint="Cost above doing nothing. Payback uses this figure, not the total bill."
                  >
                    <Input
                      id="incremental-cost"
                      type="number"
                      min={0}
                      value={
                        Number.isFinite(config.incrementalCostInr)
                          ? config.incrementalCostInr
                          : ''
                      }
                      onChange={(event) =>
                        update('incrementalCostInr', parseNonNegative(event.target.value))
                      }
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Electrical comparison</CardTitle>
                <CardDescription>
                  Baseline is the device you would otherwise run. Proposed is the SolarCool fan
                  (often 0 W if the prototype is fully passive). Do not enter an air-conditioner
                  load unless that is the actual alternative at the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Baseline power" unit="W" htmlFor="base-w">
                  <Input
                    id="base-w"
                    type="number"
                    min={0}
                    value={Number.isFinite(config.baselinePowerW) ? config.baselinePowerW : ''}
                    onChange={(event) =>
                      update('baselinePowerW', parseNonNegative(event.target.value))
                    }
                  />
                </Field>
                <Field label="Proposed power" unit="W" htmlFor="prop-w">
                  <Input
                    id="prop-w"
                    type="number"
                    min={0}
                    value={Number.isFinite(config.proposedPowerW) ? config.proposedPowerW : ''}
                    onChange={(event) =>
                      update('proposedPowerW', parseNonNegative(event.target.value))
                    }
                  />
                </Field>
                <Field label="Operating hours" unit="h / day" htmlFor="hours">
                  <Input
                    id="hours"
                    type="number"
                    min={0}
                    max={24}
                    step="0.1"
                    value={
                      Number.isFinite(config.operatingHoursPerDay)
                        ? config.operatingHoursPerDay
                        : ''
                    }
                    onChange={(event) =>
                      update('operatingHoursPerDay', parseNonNegative(event.target.value))
                    }
                  />
                </Field>
                <Field label="Operating days" unit="days / year" htmlFor="days">
                  <Input
                    id="days"
                    type="number"
                    min={0}
                    max={366}
                    value={
                      Number.isFinite(config.operatingDaysPerYear)
                        ? config.operatingDaysPerYear
                        : ''
                    }
                    onChange={(event) =>
                      update('operatingDaysPerYear', parseNonNegative(event.target.value))
                    }
                  />
                </Field>
                <Field label="Electricity tariff" unit="INR / kWh" htmlFor="tariff">
                  <Input
                    id="tariff"
                    type="number"
                    min={0}
                    step="0.01"
                    value={
                      Number.isFinite(config.electricityTariffPerKWh)
                        ? config.electricityTariffPerKWh
                        : ''
                    }
                    onChange={(event) =>
                      update('electricityTariffPerKWh', parseNonNegative(event.target.value))
                    }
                  />
                </Field>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Material subtotal"
                value={result?.issues.length ? '—' : formatInr(inputs?.materialCostInr ?? 0)}
              />
              <StatCard
                label="Total upfront"
                value={
                  result?.totalUpfrontInr != null ? formatInr(result.totalUpfrontInr) : '—'
                }
                caption="Materials + installation. Distinct from incremental cost."
              />
              <StatCard
                label="Annual energy difference"
                value={
                  result?.annualEnergyDifferenceKWh != null
                    ? formatNumber(result.annualEnergyDifferenceKWh, 1)
                    : '—'
                }
                unit="kWh"
                caption="Baseline kWh − proposed kWh"
                tone="solar"
              />
              <StatCard
                label="Simple payback"
                value={
                  result?.simplePaybackYears != null
                    ? formatYears(result.simplePaybackYears)
                    : '—'
                }
                caption={result?.paybackNote}
              />
            </div>

            {result ? (
              <Banner tone="info" title="How the numbers were produced">
                <p>
                  Baseline annual energy:{' '}
                  {result.baselineAnnualKWh === null
                    ? '—'
                    : `${formatNumber(result.baselineAnnualKWh, 2)} kWh`}
                  . Proposed:{' '}
                  {result.proposedAnnualKWh === null
                    ? '—'
                    : `${formatNumber(result.proposedAnnualKWh, 2)} kWh`}
                  . Annual cost difference:{' '}
                  {result.annualCostDifferenceInr === null
                    ? '—'
                    : formatInr(result.annualCostDifferenceInr, 2)}
                  .
                </p>
                <p className="mt-2">{result.comparabilityNote}</p>
                <p className="mt-2">{result.paybackNote}</p>
              </Banner>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle>Scenario comparison</CardTitle>
                <CardDescription>
                  Best and worst cases only change operating hours and tariff by the stated
                  factors. Loads and capital costs stay as entered.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <THead>
                    <TR>
                      <TH>Scenario</TH>
                      <TH>Assumption</TH>
                      <TH>Annual cost difference</TH>
                      <TH>Payback</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {scenarios.map((scenario) => (
                      <TR key={scenario.id}>
                        <TD className="font-medium text-forest">{scenario.label}</TD>
                        <TD className="max-w-md text-charcoal-soft">{scenario.assumption}</TD>
                        <TD className="tabular-nums">
                          {scenario.result.annualCostDifferenceInr === null
                            ? '—'
                            : formatInr(scenario.result.annualCostDifferenceInr, 2)}
                        </TD>
                        <TD>
                          {scenario.result.simplePaybackYears === null
                            ? 'Not defined'
                            : formatYears(scenario.result.simplePaybackYears)}
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void persist()}>Save assumptions</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  void resetCostConfiguration().then((value) => {
                    setConfig(value);
                    setStatus('Assumptions reset. Material names remain; costs return to 0.');
                  });
                }}
              >
                Reset to empty quotes
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
