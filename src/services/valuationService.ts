
import type { ValuationInput, ValuationOutput, ValuationReport, RiskAnalysis } from '@/types/valuation';

export class ValuationService {
  private static analyzeTokenAllocation(input: ValuationInput): RiskAnalysis[] {
    const risks: RiskAnalysis[] = [];
    
    // Team allocation risk (using TGE as proxy for now)
    if (input.tgeCirculatingSupply > 30) {
      risks.push({
        type: 'error',
        category: 'token_allocation',
        message: "High initial token release",
        suggestion: "Consider reducing TGE unlock percentage to improve price stability"
      });
    }

    // Private sale dominance risk
    if (input.fundraisingMethod === 'Private Sale' && input.fundraisingAmount > input.totalSupply * input.tokenPrice * 0.4) {
      risks.push({
        type: 'warning',
        category: 'token_allocation',
        message: "High private sale allocation",
        suggestion: "Consider increasing public allocation for better token distribution"
      });
    }

    return risks;
  }

  private static analyzeSupplyDynamics(input: ValuationInput): RiskAnalysis[] {
    const risks: RiskAnalysis[] = [];

    // Initial circulating supply risks
    if (input.tgeCirculatingSupply < 5) {
      risks.push({
        type: 'warning',
        category: 'supply_dynamics',
        message: "Very low initial circulating supply",
        suggestion: "Consider increasing initial circulation to improve market efficiency"
      });
    }

    // Liquidity risks
    const liquidityRatio = (input.dexLiquidity / (input.totalSupply * input.tokenPrice)) * 100;
    if (liquidityRatio < 5) {
      risks.push({
        type: 'error',
        category: 'supply_dynamics',
        message: "Insufficient DEX liquidity ratio",
        suggestion: "Increase initial liquidity to reduce price impact and volatility"
      });
    }

    return risks;
  }

  static async generateValuation(input: ValuationInput): Promise<ValuationOutput> {
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const baseValuation = input.totalSupply * input.tokenPrice;
    const marketMultiplier = input.marketCondition === 'Bull' ? 1.2 : 
                            input.marketCondition === 'Bear' ? 0.8 : 1;

    // Collect all risks from different analyzers
    const allRisks = [
      ...this.analyzeTokenAllocation(input),
      ...this.analyzeSupplyDynamics(input)
    ];

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
      risks: allRisks
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
