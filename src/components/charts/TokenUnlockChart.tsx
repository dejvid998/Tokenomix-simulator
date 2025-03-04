
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { TokenAllocation } from '@/types/tokenomics';

interface Props {
  data: TokenAllocation[];
  totalSupply: number;
}

export const TokenUnlockChart: React.FC<Props> = ({ data, totalSupply }) => {
  // Calculate unlocks for each month (0-12)
  const calculateUnlocks = () => {
    const monthlyData = Array.from({ length: 13 }, (_, month) => {
      const unlocksByCategory = data.map(allocation => {
        const { percentage, vesting } = allocation;
        const tokens = (percentage / 100) * totalSupply;
        
        if (month < vesting.cliff) return 0;
        
        if (vesting.type === 'cliff') {
          return month >= vesting.cliff ? tokens : 0;
        }
        
        // Linear vesting after cliff
        const vestingMonths = vesting.duration - vesting.cliff;
        if (vestingMonths <= 0) return tokens;
        
        const monthsVested = Math.max(0, month - vesting.cliff);
        const vestingProgress = Math.min(monthsVested / vestingMonths, 1);
        
        return tokens * vestingProgress;
      });

      const totalUnlocked = unlocksByCategory.reduce((sum, amount) => sum + amount, 0);
      const percentUnlocked = (totalUnlocked / totalSupply) * 100;

      return {
        month: month,
        unlocked: percentUnlocked.toFixed(2)
      };
    });

    return monthlyData;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={calculateUnlocks()}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          label={{ value: 'Tokens Unlocked (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          formatter={(value: any) => [`${value}%`, 'Unlocked']}
          labelFormatter={(label: any) => `Month ${label}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="unlocked" 
          stroke="#8884d8" 
          name="Token Unlock %" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
