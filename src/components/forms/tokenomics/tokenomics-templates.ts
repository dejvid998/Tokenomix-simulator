
import type { TokenomicsData, VestingType } from '@/types/tokenomics';

export const TEMPLATES: Record<string, TokenomicsData> = {
  dao: {
    totalSupply: 1000000000,
    allocations: [
      { category: "Community Treasury", percentage: 40, vesting: { cliff: 12, duration: 48, type: "linear" as VestingType } },
      { category: "Team", percentage: 15, vesting: { cliff: 12, duration: 36, type: "linear" as VestingType } },
      { category: "Early Contributors", percentage: 10, vesting: { cliff: 6, duration: 24, type: "linear" as VestingType } },
      { category: "Public Sale", percentage: 25, vesting: { cliff: 0, duration: 0, type: "cliff" as VestingType } },
      { category: "Ecosystem Growth", percentage: 10, vesting: { cliff: 3, duration: 36, type: "linear" as VestingType } }
    ],
    marketCondition: "neutral"
  },
  defi: {
    totalSupply: 2000000000,
    allocations: [
      { category: "Protocol Treasury", percentage: 35, vesting: { cliff: 3, duration: 48, type: "linear" as VestingType } },
      { category: "Team", percentage: 20, vesting: { cliff: 12, duration: 36, type: "linear" as VestingType } },
      { category: "Liquidity Mining", percentage: 15, vesting: { cliff: 0, duration: 24, type: "linear" as VestingType } },
      { category: "Public Sale", percentage: 20, vesting: { cliff: 0, duration: 0, type: "cliff" as VestingType } },
      { category: "Marketing", percentage: 10, vesting: { cliff: 1, duration: 24, type: "linear" as VestingType } }
    ],
    marketCondition: "neutral"
  }
};
