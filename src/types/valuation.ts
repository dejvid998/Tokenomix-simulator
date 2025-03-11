
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
  risks: {
    type: 'warning' | 'error';
    message: string;
    suggestion: string;
  }[];
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
