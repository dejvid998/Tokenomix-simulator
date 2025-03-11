
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MarketCondition } from '@/types/tokenomics';

interface Props {
  value: MarketCondition;
  onChange: (value: MarketCondition) => void;
}

export const MarketConditionSelect: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
        Market Condition Simulation
      </h4>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bull">Bull Market</SelectItem>
          <SelectItem value="bear">Bear Market</SelectItem>
          <SelectItem value="neutral">Neutral Market</SelectItem>
          <SelectItem value="shock">Liquidity Shock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
