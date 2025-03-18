
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import type { TokenAllocation } from '@/types/tokenomics';

interface Props {
  data: TokenAllocation[];
  totalSupply: number;
}

export const TokenUnlockChart: React.FC<Props> = ({ data, totalSupply }) => {
  const calculateUnlocks = () => {
    const monthlyData = Array.from({ length: 24 }, (_, month) => {
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
  const cliffMonths = data.map(allocation => allocation.vesting.cliff)
    .filter(cliff => cliff > 0);
  
  // Calculate percentage for each category
  const percentages = data.reduce((acc, allocation) => {
    acc[allocation.category] = allocation.percentage;
    return acc;
  }, {} as Record<string, number>);

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
          margin={{ top: 20, right: 30, left: 40, bottom: 45 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            opacity={0.3}
            stroke="#9F9EA1"
          />
          <XAxis 
            dataKey="month" 
            label={{ 
              value: 'Months After TGE', 
              position: 'insideBottom', 
              offset: -10,
              fill: '#555555',
              fontSize: 12,
              fontWeight: 500
            }}
            tick={{ 
              fill: '#555555',
              fontSize: 11 
            }}
            stroke="#888888"
            tickMargin={10}
          />
          <YAxis 
            label={{ 
              value: 'Tokens Unlocked', 
              angle: -90, 
              position: 'insideLeft', 
              offset: -5,
              fill: '#555555',
              fontSize: 12,
              fontWeight: 500
            }}
            tickFormatter={formatTokenAmount}
            tick={{ 
              fill: '#555555',
              fontSize: 11
            }}
            stroke="#888888"
            tickMargin={10}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '8px 12px',
            }}
            labelStyle={{
              fontWeight: 600,
              marginBottom: '4px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={60}
            wrapperStyle={{
              paddingTop: '30px',
              bottom: '0px'
            }}
            formatter={(value, entry) => {
              const percentage = percentages[value] || 0;
              return (
                <span style={{ color: '#555555', fontSize: '12px', fontWeight: 500 }}>
                  {value} ({percentage}%)
                </span>
              );
            }}
          />
          
          {cliffMonths.map((month, index) => (
            <ReferenceLine
              key={`cliff-${month}-${index}`}
              x={month}
              stroke="#9F9EA1"
              strokeDasharray="3 3"
              label={{
                value: `Cliff End`,
                position: 'top',
                fill: '#555555',
                fontSize: 11,
                fontWeight: 500
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
