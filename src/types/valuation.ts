
export interface ValuationInput {
  fundraisingAmount: number;
  tokenPrice: number;
  fundraisingMethod: 'IDO' | 'Private Sale' | 'Fair Launch';
  totalSupply: number;
  tgeCirculatingSupply: number;
  dexLiquidity: number;
  lockupDuration: number;
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
  risks: {
    type: 'warning' | 'error';
    message: string;
    suggestion: string;
  }[];
}
