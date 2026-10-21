export interface EnergyInputs {
  baselinePowerW: number;
  proposedPowerW: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  electricityTariffPerKWh: number;
  materialCostInr: number;
  installationCostInr: number;
  incrementalCostInr: number;
}

export type EnergyIssue = {
  field: string;
  message: string;
};

export interface EnergyResult {
  issues: EnergyIssue[];
  baselineAnnualKWh: number | null;
  proposedAnnualKWh: number | null;
  annualEnergyDifferenceKWh: number | null;
  annualCostDifferenceInr: number | null;
  totalUpfrontInr: number | null;
  simplePaybackYears: number | null;
  comparabilityNote: string;
  paybackNote: string;
}

export function wattsToKilowatts(watts: number): number {
  if (!Number.isFinite(watts)) {
    throw new Error('Power must be a finite number of watts.');
  }
  return watts / 1000;
}

export function annualEnergyKWh(
  powerW: number,
  operatingHoursPerDay: number,
  operatingDaysPerYear: number,
): number {
  return wattsToKilowatts(powerW) * operatingHoursPerDay * operatingDaysPerYear;
}

function isNonNegativeFinite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function validateEnergyInputs(inputs: EnergyInputs): EnergyIssue[] {
  const issues: EnergyIssue[] = [];
  const fields: Array<[keyof EnergyInputs, string, number?]> = [
    ['baselinePowerW', 'Baseline power (W)'],
    ['proposedPowerW', 'Proposed power (W)'],
    ['operatingHoursPerDay', 'Operating hours per day', 24],
    ['operatingDaysPerYear', 'Operating days per year', 366],
    ['electricityTariffPerKWh', 'Tariff (INR / kWh)'],
    ['materialCostInr', 'Material cost (INR)'],
    ['installationCostInr', 'Installation cost (INR)'],
    ['incrementalCostInr', 'Incremental cost (INR)'],
  ];

  for (const [key, label, max] of fields) {
    const value = inputs[key];
    if (!isNonNegativeFinite(value)) {
      issues.push({
        field: key,
        message: `${label} must be a finite number ≥ 0. Invalid values are not converted to zero.`,
      });
      continue;
    }
    if (max !== undefined && value > max) {
      issues.push({
        field: key,
        message: `${label} cannot exceed ${max}.`,
      });
    }
  }

  return issues;
}

export function calculateEnergy(inputs: EnergyInputs): EnergyResult {
  const issues = validateEnergyInputs(inputs);
  if (issues.length > 0) {
    return {
      issues,
      baselineAnnualKWh: null,
      proposedAnnualKWh: null,
      annualEnergyDifferenceKWh: null,
      annualCostDifferenceInr: null,
      totalUpfrontInr: null,
      simplePaybackYears: null,
      comparabilityNote:
        'Energy comparison is withheld until every input is a valid non-negative number.',
      paybackNote: 'Payback is not calculated while inputs are invalid.',
    };
  }

  const baselineAnnualKWh = annualEnergyKWh(
    inputs.baselinePowerW,
    inputs.operatingHoursPerDay,
    inputs.operatingDaysPerYear,
  );
  const proposedAnnualKWh = annualEnergyKWh(
    inputs.proposedPowerW,
    inputs.operatingHoursPerDay,
    inputs.operatingDaysPerYear,
  );
  const annualEnergyDifferenceKWh = baselineAnnualKWh - proposedAnnualKWh;
  const annualCostDifferenceInr =
    annualEnergyDifferenceKWh * inputs.electricityTariffPerKWh;
  const totalUpfrontInr = inputs.materialCostInr + inputs.installationCostInr;

  let comparabilityNote =
    'Annual energy figures convert watts to kilowatts once (÷ 1 000), then multiply by hours/day and days/year.';
  if (inputs.baselinePowerW === 0 && inputs.proposedPowerW === 0) {
    comparabilityNote +=
      ' Both electrical loads are 0 W, so this is not a comparison against an existing cooling device.';
  } else if (inputs.baselinePowerW === 0) {
    comparabilityNote +=
      ' Baseline electrical power is 0 W. Do not read the result as avoided air-conditioner consumption unless that is the device you entered.';
  }

  let simplePaybackYears: number | null = null;
  let paybackNote: string;
  if (inputs.incrementalCostInr > 0 && annualCostDifferenceInr > 0) {
    simplePaybackYears = inputs.incrementalCostInr / annualCostDifferenceInr;
    paybackNote =
      'Simple payback = incremental cost ÷ annual cost savings. This is an estimate under the hours, days and tariff you entered.';
  } else if (!(annualCostDifferenceInr > 0)) {
    paybackNote =
      'Simple payback is not defined when annual cost savings are zero or negative. Division by zero is not performed.';
  } else {
    paybackNote =
      'Simple payback is not reported when incremental cost is 0 INR. There is no extra capital to recover.';
  }

  return {
    issues,
    baselineAnnualKWh,
    proposedAnnualKWh,
    annualEnergyDifferenceKWh,
    annualCostDifferenceInr,
    totalUpfrontInr,
    simplePaybackYears,
    comparabilityNote,
    paybackNote,
  };
}

export type ScenarioId = 'best' | 'base' | 'worst';

export const SCENARIO_FACTORS: Record<
  ScenarioId,
  { label: string; hoursFactor: number; tariffFactor: number; assumption: string }
> = {
  best: {
    label: 'Best case',
    hoursFactor: 1.15,
    tariffFactor: 1.1,
    assumption:
      'Operating hours 15% higher and tariff 10% higher than the values you entered. Higher avoided energy cost, shorter payback if savings stay positive.',
  },
  base: {
    label: 'Base case',
    hoursFactor: 1,
    tariffFactor: 1,
    assumption: 'Uses the hours, days, tariff and loads exactly as entered.',
  },
  worst: {
    label: 'Worst case',
    hoursFactor: 0.85,
    tariffFactor: 0.9,
    assumption:
      'Operating hours 15% lower and tariff 10% lower than entered. Smaller savings, longer payback if savings stay positive.',
  },
};

export function calculateScenario(
  inputs: EnergyInputs,
  scenario: ScenarioId,
): EnergyResult {
  const factors = SCENARIO_FACTORS[scenario];
  return calculateEnergy({
    ...inputs,
    operatingHoursPerDay: Math.min(24, inputs.operatingHoursPerDay * factors.hoursFactor),
    electricityTariffPerKWh: inputs.electricityTariffPerKWh * factors.tariffFactor,
  });
}
