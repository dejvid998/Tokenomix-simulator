export interface FundingRound {
  name: string;
  amount: number;
  tokenPrice: number;
  fundraisingMethod: 'Pre-Seed' | 'Seed' | 'Private Sale' | 'IDO' | 'Fair Launch';
  dilution?: number; // percentage
  date?: string; // ISO date
}

export interface ValuationInput {
  fundraisingAmount: number;
  tokenPrice: number;
  fundraisingMethod: 'IDO' | 'Private Sale' | 'Fair Launch';
  totalSupply: number;
  tgeCirculatingSupply: number;
  dexLiquidity: number;
  lockupDuration: number;
  projectCategory: 'DeFi' | 'GameFi' | 'NFT' | 'Infrastructure' | 'DAO';
  marketCondition: 'Bull' | 'Bear' | 'Neutral';
  initialStaking: number;
  teamTokens: number;
  marketingBudget: number;
  fundingRounds?: FundingRound[];
}

export interface RiskAnalysis {
  type: 'warning' | 'error';
  category: 'token_allocation' | 'supply_dynamics' | 'market' | 'stress_test';
  message: string;
  suggestion: string;
  details?: {
    currentValue: number;
    threshold: number;
    metric: string;
  };
}

export interface ValuationOutput {
  fdvRange: {
    min: number;
    max: number;
  };
  initialMarketCapRange: {
    min: number;
    max: number;
  };
  confidenceScore: number;
  marketSentiment: {
    score: number;
    description: string;
  };
  comparables: {
    name: string;
    fdv: number;
    mcap: number;
    performance: number;
  }[];
  risks: RiskAnalysis[];
}

export interface ValuationReport {
  valuation: ValuationOutput;
  questionnaire: {
    question: string;
    answer: string;
  }[];
  recommendations: {
    category: string;
    suggestions: string[];
  }[];
  timestamp: string;
}
