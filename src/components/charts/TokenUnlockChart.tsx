
import React from 'react';
import type { TokenAllocation } from '@/types/tokenomics';
import { calculateUnlocks } from '@/utils/tokenUnlockCalculations';
import { UnlockChartHeader } from './token-unlock/UnlockChartHeader';
import { UnlockChartConfig } from './token-unlock/UnlockChartConfig';

interface Props {
  data: TokenAllocation[];
  totalSupply: number;
}

export const TokenUnlockChart: React.FC<Props> = ({ data, totalSupply }) => {
  const chartData = calculateUnlocks(data, totalSupply);
  const categories = data.map(d => d.category);
  const cliffMonths = data.map(allocation => allocation.vesting.cliff)
    .filter(cliff => cliff > 0);
  
  // Calculate percentage for each category
  const percentages = data.reduce((acc, allocation) => {
    acc[allocation.category] = allocation.percentage;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-2" id="token-unlock-chart">
      <UnlockChartHeader totalSupply={totalSupply} />
      <UnlockChartConfig 
        chartData={chartData}
        categories={categories}
        cliffMonths={cliffMonths}
        percentages={percentages}
        totalSupply={totalSupply}
      />
    </div>
  );
};
