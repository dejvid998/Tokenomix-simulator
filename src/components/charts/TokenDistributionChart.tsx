
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";
import type { TokenAllocation } from '@/types/tokenomics';

interface Props {
  data: TokenAllocation[];
  onTemplateSelect?: (template: TokenAllocation[]) => void;
}

const COLORS = [
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#3B82F6', // Blue
];

const COLOR_NAMES = [
  'Vivid Purple',
  'Magenta Pink',
  'Bright Orange',
  'Ocean Blue',
  'Emerald',
  'Amber',
  'Pink',
  'Indigo',
  'Teal',
  'Blue',
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Card className="bg-white/90 dark:bg-zinc-900/90 p-3 border-none shadow-lg">
        <p className="font-medium text-sm">{data.category}</p>
        <p className="text-sm text-muted-foreground">
          {data.percentage.toFixed(1)}% ({(data.percentage * 1000000000 / 100).toLocaleString()} tokens)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Vesting: {data.vesting.duration} months
          {data.vesting.cliff > 0 && ` (${data.vesting.cliff} months cliff)`}
        </p>
      </Card>
    );
  }
  return null;
};

export const TokenDistributionChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="w-full" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={130}
              fill="#8884d8"
              dataKey="percentage"
              nameKey="category"
              label={({ category, percentage }) => `${category} (${percentage}%)`}
              className="hover:opacity-80 transition-opacity duration-200"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-300 ease-in-out hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={90}
              wrapperStyle={{
                paddingTop: '30px',
                bottom: '0px'
              }}
              formatter={(value: string, entry: any, index: number) => {
                const { payload } = entry;
                const colorIndex = index % COLORS.length;
                return (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[colorIndex] }}
                    />
                    <span className="text-sm font-medium">
                      {value} ({payload.percentage}%)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {COLOR_NAMES[colorIndex]}
                    </span>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
