
import React from 'react';
import { formatTokenAmount } from '@/utils/tokenUnlockCalculations';

interface UnlockChartHeaderProps {
  totalSupply: number;
}

export const UnlockChartHeader: React.FC<UnlockChartHeaderProps> = ({ totalSupply }) => {
  return (
    <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
      <div>
        Total Supply: {formatTokenAmount(totalSupply)} tokens
      </div>
      <div className="flex gap-2 items-center">
        <span className="h-2 w-2 rounded-full bg-zinc-800 dark:bg-white" />
        <span>Total Unlocked</span>
      </div>
    </div>
  );
};
