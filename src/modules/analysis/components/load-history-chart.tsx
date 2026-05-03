'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { LoadAnalysis } from '../types';
import { LOAD_LEVEL_CONFIGS } from '../constants';

interface Props {
  data: LoadAnalysis[];
  loading?: boolean;
}

export function LoadHistoryChart({ data, loading }: Props) {
  const [days, setDays] = useState(7);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-48 bg-gray-100 rounded-xl" />
        <div className="flex gap-2 justify-center">
          {[7, 14, 30].map((d) => (
            <div key={d} className="h-8 w-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-gray-500">Sin datos de carga todavia</p>
      </div>
    );
  }

  const chartData = [...data]
    .reverse()
    .map((a) => ({
      date: new Date(a.created_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      score: a.load_score,
      level: a.load_level,
    }));

  return (
    <div>
      <div className="flex justify-center gap-1 mb-3">
        {[7, 14, 30].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${days === d ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {d}d
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 'auto']} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(value) => [`${value}`, 'Carga']}
          />
          <ReferenceLine y={5} stroke="#eab308" strokeDasharray="3 3" />
          <ReferenceLine y={10} stroke="#f97316" strokeDasharray="3 3" />
          <ReferenceLine y={18} stroke="#ef4444" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ r: 3, fill: '#a855f7' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
