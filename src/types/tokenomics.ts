
export type VestingType = "linear" | "cliff" | "exponential" | "custom";
export type MarketCondition = "bull" | "bear" | "neutral" | "shock";

export interface VestingSchedule {
  cliff: number;
  duration: number;
  type: VestingType;
  unlockPercentage?: number;
}

export interface TokenAllocation {
  category: string;
  percentage: number;
  vesting: VestingSchedule;
}

export interface TokenomicsData {
  totalSupply: number;
  allocations: TokenAllocation[];
  marketCondition: MarketCondition;
}

export interface SimulationResult {
  circulatingSupply: Array<{ month: number; amount: number }>;
  sellingPressure: Array<{ month: number; score: number }>;
  inflationRate: Array<{ month: number; rate: number }>;
}
