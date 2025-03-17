
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from '../forms/tokenomics/tokenomics-templates';
import type { TokenAllocation } from '@/types/tokenomics';
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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
  const handleTemplateSelect = (templateKey: string) => {
    if (!onTemplateSelect) return;
    
    try {
      const template = TEMPLATES[templateKey];
      if (template) {
        onTemplateSelect(template.allocations);
        toast.success(`${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} template applied`);
      }
    } catch (error) {
      toast.error("Failed to load template");
    }
  };

  return (
    <div className="space-y-6">
      {onTemplateSelect && (
        <>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
              Templates
            </h4>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTemplateSelect('dao')}
              >
                MakerDAO-like
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTemplateSelect('defi')}
              >
                DeFi Protocol
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTemplateSelect('makerdao')}
              >
                MakerDAO Original
              </Button>
            </div>
          </div>
          <Separator className="my-2" />
        </>
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
