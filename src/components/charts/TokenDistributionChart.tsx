
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from '../forms/tokenomics/tokenomics-templates';
import type { TokenAllocation } from '@/types/tokenomics';

interface Props {
  data: TokenAllocation[];
  onTemplateSelect?: (template: TokenAllocation[]) => void;
}

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#14B8A6', // Teal
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

export const TokenDistributionChart: React.FC<Props> = ({ data, onTemplateSelect }) => {
  return (
    <div className="space-y-6">
      {onTemplateSelect && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTemplateSelect(TEMPLATES.dao.allocations)}
          >
            MakerDAO-like
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTemplateSelect(TEMPLATES.defi.allocations)}
          >
            DeFi Protocol
          </Button>
        </div>
      )}
      
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
              height={36}
              formatter={(value: string) => (
                <span className="text-sm font-medium">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
