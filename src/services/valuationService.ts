
import type { ValuationInput, ValuationOutput, ValuationReport } from '@/types/valuation';

export class ValuationService {
  // For now, using mock data. This would be replaced with actual AI model calls
  static async generateValuation(input: ValuationInput): Promise<ValuationOutput> {
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const baseValuation = input.totalSupply * input.tokenPrice;
    const marketMultiplier = input.marketCondition === 'Bull' ? 1.2 : 
                            input.marketCondition === 'Bear' ? 0.8 : 1;

    return {
      fdvRange: {
        min: baseValuation * 0.8 * marketMultiplier,
        max: baseValuation * 1.2 * marketMultiplier
      },
      initialMarketCapRange: {
        min: (baseValuation * (input.tgeCirculatingSupply / 100)) * 0.8,
        max: (baseValuation * (input.tgeCirculatingSupply / 100)) * 1.2
      },
      confidenceScore: 0.85,
      marketSentiment: {
        score: 0.75,
        description: "Positive market sentiment with moderate volatility expected"
      },
      comparables: [
        {
          name: "Similar Project A",
          fdv: baseValuation * 1.1,
          mcap: baseValuation * 0.3,
          performance: 25
        },
        {
          name: "Similar Project B",
          fdv: baseValuation * 0.9,
          mcap: baseValuation * 0.25,
          performance: 15
        }
      ],
      risks: [
        {
          type: input.tgeCirculatingSupply > 30 ? 'error' : 'warning',
          message: "High initial circulating supply",
          suggestion: "Consider reducing TGE unlock to improve token price stability"
        },
        {
          type: input.dexLiquidity < baseValuation * 0.1 ? 'error' : 'warning',
          message: "Low DEX liquidity ratio",
          suggestion: "Increase initial liquidity to reduce price impact"
        }
      ]
    };
  }

  static async generateReport(
    valuation: ValuationOutput, 
    questionnaireData: any
  ): Promise<ValuationReport> {
    return {
      valuation,
      questionnaire: Object.entries(questionnaireData).map(([q, a]) => ({
        question: q,
        answer: String(a)
      })),
      recommendations: [
        {
          category: "Tokenomics",
          suggestions: [
            "Implement gradual token unlocks",
            "Consider increasing lock-up period"
          ]
        },
        {
          category: "Liquidity",
          suggestions: [
            "Allocate more tokens to liquidity mining",
            "Implement longer liquidity lock periods"
          ]
        }
      ],
      timestamp: new Date().toISOString()
    };
  }
}
