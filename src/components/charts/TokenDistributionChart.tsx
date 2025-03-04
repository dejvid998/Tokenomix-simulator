
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface TokenAllocation {
  category: string;
  percentage: number;
}

interface Props {
  data: TokenAllocation[];
}

const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];

export const TokenDistributionChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full" style={{ height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="percentage"
            nameKey="category"
            label={({ category, percentage }) => `${category} (${percentage}%)`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                className="transition-all duration-300 ease-in-out hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
