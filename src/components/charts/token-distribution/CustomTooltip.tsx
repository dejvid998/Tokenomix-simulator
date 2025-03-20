
import React from 'react';
import { Card } from "@/components/ui/card";
import type { TokenAllocation } from '@/types/tokenomics';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
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
