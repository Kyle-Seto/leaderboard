import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Application } from '../types';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface StatsProps {
  applications: Application[];
  dateRange: { start: string; end: string };
}

export function Stats({ applications, dateRange }: StatsProps) {
  const filteredApps = applications.filter(
    app => app.date >= dateRange.start && app.date <= dateRange.end
  );

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const count = filteredApps.filter(app => app.date === date).length;
    return {
      date: format(subDays(new Date(), i), 'MMM dd'),
      count,
    };
  }).reverse();

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Applications Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}