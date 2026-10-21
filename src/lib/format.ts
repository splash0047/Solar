import { format, isValid, parseISO } from 'date-fns';

export function formatInr(value: number, fractionDigits = 0): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatNumber(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatTemperature(value: number): string {
  return `${formatNumber(value, 1)} °C`;
}

export function formatTimestamp(value: string): string {
  const parsed = parseISO(value);
  if (!isValid(parsed)) {
    const fallback = new Date(value);
    if (!isValid(fallback)) return value;
    return format(fallback, 'd MMM yyyy, HH:mm');
  }
  return format(parsed, 'd MMM yyyy, HH:mm');
}

export function formatYears(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (value < 0.05) return '< 1 month';
  if (value < 1) return `${formatNumber(value * 12, 1)} months`;
  return `${formatNumber(value, 1)} years`;
}
