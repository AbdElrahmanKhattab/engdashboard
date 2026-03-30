import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const FINANCIAL_DATA = [
  { name: 'MAR', profit: 4000, expenses: 2400 },
  { name: 'APR', profit: 3000, expenses: 1398 },
  { name: 'MAY', profit: 2000, expenses: 9800 },
  { name: 'JUN', profit: 2780, expenses: 3908 },
];

export function FinancialsChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={FINANCIAL_DATA} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3" vertical={false} stroke="var(--chart-grid-stroke)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 600, fill: 'var(--chart-axis-tick)' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 600, fill: 'var(--chart-axis-tick)' }} 
          />
          <Tooltip 
            cursor={{ fill: 'var(--chart-grid-stroke)', opacity: 0.1 }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
              backgroundColor: 'var(--chart-tooltip-bg)',
              color: 'var(--chart-tooltip-color)'
            }}
            itemStyle={{ color: 'var(--chart-tooltip-color)' }}
          />
          <Bar dataKey="profit" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="expenses" fill="#bfdbfe" className="dark:fill-blue-900/40" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EfficiencyGauge({ rate }: { rate: number }) {
  const data = [
    { name: 'Completed', value: rate },
    { name: 'Remaining', value: 100 - rate },
  ];
  // Using white for the gauge when it's on a blue background
  const COLORS = ['#FFFFFF', 'rgba(255, 255, 255, 0.2)'];

  return (
    <div className="relative h-48 w-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{rate}%</span>
      </div>
    </div>
  );
}
