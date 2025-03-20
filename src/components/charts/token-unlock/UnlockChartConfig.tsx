
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import type { TokenAllocation } from '@/types/tokenomics';
import { formatTokenAmount, formatTooltipValue } from '@/utils/tokenUnlockCalculations';

interface UnlockChartConfigProps {
  chartData: any[];
  categories: string[];
  cliffMonths: number[];
  percentages: Record<string, number>;
  totalSupply: number;
}

export const UnlockChartConfig: React.FC<UnlockChartConfigProps> = ({ 
  chartData, 
  categories, 
  cliffMonths, 
  percentages,
  totalSupply
}) => {
  const colors = [
    "#2563eb", "#dc2626", "#2dd4bf", "#f59e0b", 
    "#8b5cf6", "#ec4899", "#10b981", "#6366f1"
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 20, bottom: 45 }}
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
          formatter={(value: number, name: string) => formatTooltipValue(value, name, totalSupply)}
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
          height={36}
          wrapperStyle={{
            paddingTop: '10px',
            fontSize: '12px',
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
        
        {/* Market Reference Line */}
        <ReferenceLine
          y={totalSupply * 0.6} // Adjust this value to position the market line appropriately
          stroke="#8B5CF6" // Purple color for market
          strokeWidth={2}
          strokeDasharray="5 5"
          label={{
            value: 'Market',
            position: 'right',
            fill: '#8B5CF6',
            fontSize: 12,
            fontWeight: 600,
            dy: 15 // Move label down to avoid overlap with legend
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
  );
};
