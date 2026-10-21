import { describe, expect, it } from 'vitest';
import {
  annualEnergyKWh,
  calculateEnergy,
  calculateScenario,
  wattsToKilowatts,
  type EnergyInputs,
} from './energy';

const valid: EnergyInputs = {
  baselinePowerW: 1000,
  proposedPowerW: 18,
  operatingHoursPerDay: 8,
  operatingDaysPerYear: 365,
  electricityTariffPerKWh: 8,
  materialCostInr: 12000,
  installationCostInr: 4000,
  incrementalCostInr: 16000,
};

describe('wattsToKilowatts', () => {
  it('converts watts to kilowatts once', () => {
    expect(wattsToKilowatts(1000)).toBe(1);
    expect(wattsToKilowatts(18)).toBe(0.018);
  });

  it('rejects non-finite power', () => {
    expect(() => wattsToKilowatts(Number.NaN)).toThrow(/finite/);
  });
});

describe('annualEnergyKWh', () => {
  it('uses kW × hours × days', () => {
    expect(annualEnergyKWh(1000, 8, 365)).toBe(2920);
  });
});

describe('calculateEnergy', () => {
  it('returns savings and payback for a comparable electrical scenario', () => {
    const result = calculateEnergy(valid);
    expect(result.issues).toEqual([]);
    expect(result.baselineAnnualKWh).toBe(2920);
    expect(result.proposedAnnualKWh).toBeCloseTo(52.56, 5);
    expect(result.annualEnergyDifferenceKWh).toBeCloseTo(2867.44, 5);
    expect(result.annualCostDifferenceInr).toBeCloseTo(22939.52, 5);
    expect(result.simplePaybackYears).toBeCloseTo(16000 / 22939.52, 5);
    expect(result.totalUpfrontInr).toBe(16000);
  });

  it('does not invent payback when savings are zero', () => {
    const result = calculateEnergy({
      ...valid,
      baselinePowerW: 18,
      proposedPowerW: 18,
    });
    expect(result.annualCostDifferenceInr).toBe(0);
    expect(result.simplePaybackYears).toBeNull();
    expect(result.paybackNote.toLowerCase()).toMatch(/zero or negative/);
  });

  it('does not divide by a negative savings figure', () => {
    const result = calculateEnergy({
      ...valid,
      baselinePowerW: 10,
      proposedPowerW: 100,
    });
    expect(result.annualEnergyDifferenceKWh).toBeLessThan(0);
    expect(result.simplePaybackYears).toBeNull();
  });

  it('withholds payback when incremental cost is zero', () => {
    const result = calculateEnergy({ ...valid, incrementalCostInr: 0 });
    expect(result.simplePaybackYears).toBeNull();
    expect(result.paybackNote.toLowerCase()).toMatch(/incremental cost is 0/);
  });

  it('rejects invalid numbers instead of coercing them to zero', () => {
    const result = calculateEnergy({
      ...valid,
      electricityTariffPerKWh: Number.NaN,
    });
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.annualCostDifferenceInr).toBeNull();
  });

  it('rejects hours above 24', () => {
    const result = calculateEnergy({ ...valid, operatingHoursPerDay: 30 });
    expect(result.issues.some((issue) => issue.field === 'operatingHoursPerDay')).toBe(
      true,
    );
  });
});

describe('calculateScenario', () => {
  it('scales hours and tariff for the labelled cases', () => {
    const base = calculateScenario(valid, 'base');
    const best = calculateScenario(valid, 'best');
    const worst = calculateScenario(valid, 'worst');
    expect(base.annualCostDifferenceInr).not.toBeNull();
    expect(best.annualCostDifferenceInr).toBeGreaterThan(base.annualCostDifferenceInr!);
    expect(worst.annualCostDifferenceInr).toBeLessThan(base.annualCostDifferenceInr!);
  });
});
