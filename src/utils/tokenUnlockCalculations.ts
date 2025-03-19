
import type { TokenAllocation } from '@/types/tokenomics';

export const calculateUnlocks = (data: TokenAllocation[], totalSupply: number) => {
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

export const formatTokenAmount = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
};

export const formatTooltipValue = (value: number, name: string, totalSupply: number) => {
  const formattedAmount = formatTokenAmount(value);
  const percentage = ((value / totalSupply) * 100).toFixed(2);
  return [`${formattedAmount} (${percentage}%)`, name];
};
