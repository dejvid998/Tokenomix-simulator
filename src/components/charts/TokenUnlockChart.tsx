
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import type { TokenAllocation } from '@/types/tokenomics';

interface Props {
  data: TokenAllocation[];
  totalSupply: number;
}

export const TokenUnlockChart: React.FC<Props> = ({ data, totalSupply }) => {
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

  const formatTokenAmount = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const formatTooltipValue = (value: number, name: string) => {
    const formattedAmount = formatTokenAmount(value);
    const percentage = ((value / totalSupply) * 100).toFixed(2);
    return [`${formattedAmount} (${percentage}%)`, name];
  };

  const colors = [
    "#2563eb", "#dc2626", "#2dd4bf", "#f59e0b", 
    "#8b5cf6", "#ec4899", "#10b981", "#6366f1"
  ];

  const chartData = calculateUnlocks();
  const categories = data.map(d => d.category);

  // Find months with cliff unlock events
  const cliffMonths = data.map(allocation => allocation.vesting.cliff)
    .filter(cliff => cliff > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <div>
          Total Supply: {formatTokenAmount(totalSupply)} tokens
        </div>
        <div className="flex gap-2 items-center">
          <span className="h-2 w-2 rounded-full bg-zinc-800 dark:bg-white" />
          <span>Total Unlocked</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            opacity={0.5}
            stroke="#9ca3af"
          />
          <XAxis 
            dataKey="month" 
            label={{ 
              value: 'Months After TGE', 
              position: 'insideBottom', 
              offset: -5,
              fill: '#6b7280'
            }}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            label={{ 
              value: 'Tokens Unlocked', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 0,
              fill: '#6b7280'
            }}
            tickFormatter={formatTokenAmount}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
          
          {/* Add reference lines for cliff periods */}
          {cliffMonths.map((month, index) => (
            <ReferenceLine
              key={`cliff-${month}-${index}`}
              x={month}
              stroke="#9ca3af"
              strokeDasharray="3 3"
              label={{
                value: `Cliff End`,
                position: 'top',
                fill: '#6b7280',
                fontSize: 12
              }}
            />
          ))}

          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              name={category}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#374151"
            strokeWidth={3}
            dot={false}
            name="Total"
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
