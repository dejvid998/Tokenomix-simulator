
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { TokenAllocation } from '@/types/tokenomics';

interface Props {
  data: TokenAllocation[];
  totalSupply: number;
}

export const TokenUnlockChart: React.FC<Props> = ({ data, totalSupply }) => {
  // Calculate unlocks for each category and month (1-12)
  const calculateUnlocks = () => {
    const monthlyData = Array.from({ length: 12 }, (_, month) => {
      const monthNumber = month + 1;
      const unlocksByCategory = data.reduce((acc, allocation) => {
        const { category, percentage, vesting } = allocation;
        const tokens = (percentage / 100) * totalSupply;
        
        let unlockedAmount = 0;
        if (monthNumber >= vesting.cliff) {
          if (vesting.type === 'cliff') {
            unlockedAmount = tokens;
          } else {
            // Linear vesting after cliff
            const vestingMonths = vesting.duration - vesting.cliff;
            if (vestingMonths <= 0) {
              unlockedAmount = tokens;
            } else {
              const monthsVested = Math.max(0, monthNumber - vesting.cliff);
              const vestingProgress = Math.min(monthsVested / vestingMonths, 1);
              unlockedAmount = tokens * vestingProgress;
            }
          }
        }
        
        acc[category] = unlockedAmount;
        return acc;
      }, {} as Record<string, number>);

      return {
        month: monthNumber,
        ...unlocksByCategory,
        total: Object.values(unlocksByCategory).reduce((sum, val) => sum + val, 0)
      };
    });

    return monthlyData;
  };

  const colors = [
    "#2563eb", "#dc2626", "#2dd4bf", "#f59e0b", 
    "#8b5cf6", "#ec4899", "#10b981", "#6366f1"
  ];

  const chartData = calculateUnlocks();
  const categories = data.map(d => d.category);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
        <XAxis 
          dataKey="month" 
          label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          label={{ value: 'Tokens Unlocked', angle: -90, position: 'insideLeft', offset: -5 }}
        />
        <Tooltip 
          formatter={(value: number) => [
            value.toLocaleString(undefined, { maximumFractionDigits: 0 }),
            'Tokens'
          ]}
        />
        <Legend />
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={false}
            name={category}
          />
        ))}
        <Line
          type="monotone"
          dataKey="total"
          stroke="#374151"
          strokeWidth={3}
          dot={false}
          name="Total"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
