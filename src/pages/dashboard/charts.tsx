import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatTimestamp } from '@/lib/format';
import type { PairedObservation } from '@/lib/stats';
import { EmptyState } from '@/components/ui/empty-state';
import { LineChart as LineChartIcon } from 'lucide-react';

export function TemperatureChart({ rows }: { rows: PairedObservation[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<LineChartIcon />}
        title="No chartable observations"
        description="Add paired temperature readings for the selected session. The chart uses only those rows."
      />
    );
  }

  const data = rows.map((row) => ({
    time: formatTimestamp(row.timestamp),
    Outdoor: row.outdoorTemperatureC,
    'Baseline indoor': row.baselineIndoorTemperatureC,
    'System indoor': row.systemIndoorTemperatureC,
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#e2ded0" strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#5c6560' }} />
          <YAxis
            unit=" °C"
            tick={{ fontSize: 11, fill: '#5c6560' }}
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: '#FDFCF7',
              border: '1px solid #e2ded0',
              borderRadius: 10,
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="Outdoor" stroke="#c1803a" strokeWidth={2} dot={{ r: 3 }} />
          <Line
            type="monotone"
            dataKey="Baseline indoor"
            stroke="#b3452f"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="System indoor"
            stroke="#244B3B"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
