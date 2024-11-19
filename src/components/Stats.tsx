import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Application } from '../types';
import { format, subDays } from 'date-fns';

// Optionally import a color library for distinct colors
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

interface User {
  id: string;
  name: string;
}

interface StatsProps {
  applications: Application[];
  dateRange: { start: string; end: string };
  users: User[]; // New prop for users
}

export function Stats({ applications, dateRange, users }: StatsProps) {
  const filteredApps = applications.filter(
    app => app.date >= dateRange.start && app.date <= dateRange.end
  );

  // Create a map of userId to user name from the users array
  const userNames = users.reduce((acc, user) => {
    acc[user.id] = user.name;
    return acc;
  }, {} as Record<string, string>);

  // Get a list of unique userIds
  const userIds = Array.from(
    new Set(filteredApps.map(app => app.userId))
  );

  // Create a color scale to assign a unique color to each user
  const colorScale = scaleOrdinal(schemeCategory10);

  // Prepare daily data
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dailyCount = { date: format(subDays(new Date(), i), 'MMM dd') };

    // Count applications for each user
    userIds.forEach(userId => {
      const userCount = filteredApps.filter(
        app => app.date === date && app.userId === userId
      ).length;
      dailyCount[userId] = userCount;
    });

    return dailyCount;
  }).reverse();

  // Custom Tooltip Content
  const renderTooltip = ({ payload, label }: any) => {
    if (!payload || payload.length === 0) return null;

    return (
      <div className="custom-tooltip bg-white p-2 border rounded">
        <p>{label}</p>
        {payload.map((entry: any) => {
          const userName = userNames[entry.name] || entry.name; // Get user name from userId
          return (
            <p key={entry.name}>
              {userName}: {entry.value}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Applications Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={renderTooltip} />
            {/* Render a line for each user with a unique color */}
            {userIds.map((userId, index) => (
              <Line
                key={userId}
                type="monotone"
                dataKey={userId}
                stroke={colorScale(index)} // Assign a color based on the index
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
