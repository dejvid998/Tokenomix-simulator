
import type { ValuationInput, ValuationOutput, ValuationReport, RiskAnalysis } from '@/types/valuation';

export class ValuationService {
  private static analyzeTokenAllocation(input: ValuationInput): RiskAnalysis[] {
    const risks: RiskAnalysis[] = [];
    
    // Team/Insider allocation risk
    if (input.tgeCirculatingSupply > 40) {
      risks.push({
        type: 'error',
        category: 'token_allocation',
        message: "Excessive insider token concentration",
        suggestion: "Reduce insider allocation to below 40% to minimize centralization risks",
        details: {
          currentValue: input.tgeCirculatingSupply,
          threshold: 40,
          metric: "Insider Allocation %"
        }
      });
    }

    // Public allocation risk
    const estimatedPublicAllocation = 100 - input.tgeCirculatingSupply;
    if (estimatedPublicAllocation < 10) {
      risks.push({
        type: 'error',
        category: 'token_allocation',
        message: "Insufficient public allocation",
        suggestion: "Increase public allocation to at least 10% to improve community engagement",
        details: {
          currentValue: estimatedPublicAllocation,
          threshold: 10,
          metric: "Public Allocation %"
        }
      });
    }

    // Private sale dominance risk
    if (input.fundraisingMethod === 'Private Sale' && input.fundraisingAmount > input.totalSupply * input.tokenPrice * 0.4) {
      risks.push({
        type: 'warning',
        category: 'token_allocation',
        message: "High private sale allocation",
        suggestion: "Consider reducing private sale allocation to improve token distribution",
        details: {
          currentValue: (input.fundraisingAmount / (input.totalSupply * input.tokenPrice)) * 100,
          threshold: 40,
          metric: "Private Sale %"
        }
      });
    }

    return risks;
  }

  private static analyzeSupplyDynamics(input: ValuationInput): RiskAnalysis[] {
    const risks: RiskAnalysis[] = [];

    // Circulating supply risks
    if (input.tgeCirculatingSupply < 50) {
      risks.push({
        type: 'warning',
        category: 'supply_dynamics',
        message: "Low circulating supply",
        suggestion: "Consider increasing circulating supply above 50% to reduce manipulation risks",
        details: {
          currentValue: input.tgeCirculatingSupply,
          threshold: 50,
          metric: "Circulating Supply %"
        }
      });
    }

    // Liquidity risks
    const liquidityRatio = (input.dexLiquidity / (input.totalSupply * input.tokenPrice)) * 100;
    if (liquidityRatio < 5) {
      risks.push({
        type: 'error',
        category: 'supply_dynamics',
        message: "Insufficient DEX liquidity ratio",
        suggestion: "Increase initial liquidity to at least 5% to reduce price impact",
        details: {
          currentValue: liquidityRatio,
          threshold: 5,
          metric: "Liquidity Ratio %"
        }
      });
    }

    // Market cap to liquidity ratio
    const mcapToLiquidity = input.dexLiquidity / (input.totalSupply * input.tokenPrice * (input.tgeCirculatingSupply / 100));
    if (mcapToLiquidity < 0.1) {
      risks.push({
        type: 'warning',
        category: 'supply_dynamics',
        message: "Low market cap to liquidity ratio",
        suggestion: "Increase liquidity provision relative to initial market cap",
        details: {
          currentValue: mcapToLiquidity * 100,
          threshold: 10,
          metric: "MCap/Liquidity %"
        }
      });
    }

    return risks;
  }

  private static analyzeMarketRisks(input: ValuationInput): RiskAnalysis[] {
    const risks: RiskAnalysis[] = [];

    // High initial unlock risk
    if (input.tgeCirculatingSupply > 10) {
      risks.push({
        type: 'warning',
        category: 'market',
        message: "High TGE unlock percentage",
        suggestion: "Consider reducing initial unlock to prevent early sell pressure",
        details: {
          currentValue: input.tgeCirculatingSupply,
          threshold: 10,
          metric: "TGE Unlock %"
        }
      });
    }

    // Market condition risks
    if (input.marketCondition === 'Bear' && input.tgeCirculatingSupply > 5) {
      risks.push({
        type: 'error',
        category: 'market',
        message: "High unlock during bear market",
        suggestion: "Reduce initial circulation during adverse market conditions",
        details: {
          currentValue: input.tgeCirculatingSupply,
          threshold: 5,
          metric: "Bear Market Unlock %"
        }
      });
    }

    return risks;
  }

  private static runStressTests(input: ValuationInput): RiskAnalysis[] {
    const risks: RiskAnalysis[] = [];

    // Liquidity shock simulation
    const shockImpact = input.dexLiquidity * 0.5;
    if (shockImpact / (input.totalSupply * input.tokenPrice) < 0.02) {
      risks.push({
        type: 'warning',
        category: 'stress_test',
        message: "High vulnerability to liquidity shocks",
        suggestion: "Increase liquidity buffers to handle market stress scenarios",
        details: {
          currentValue: (shockImpact / (input.totalSupply * input.tokenPrice)) * 100,
          threshold: 2,
          metric: "Shock Resistance %"
        }
      });
    }

    return risks;
  }

  static async generateValuation(input: ValuationInput): Promise<ValuationOutput> {
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // If funding rounds provided, derive an implied blended price when available
    const totalRoundAmount = (input.fundingRounds || []).reduce((sum, r) => sum + (r.amount || 0), 0);
    const weightedPriceNumerator = (input.fundingRounds || []).reduce((sum, r) => sum + ((r.tokenPrice || input.tokenPrice) * (r.amount || 0)), 0);
    const blendedTokenPrice = totalRoundAmount > 0 ? (weightedPriceNumerator / totalRoundAmount) : input.tokenPrice;

    const baseValuation = input.totalSupply * blendedTokenPrice;
    const marketMultiplier = input.marketCondition === 'Bull' ? 1.2 : 
                            input.marketCondition === 'Bear' ? 0.8 : 1;

    // Collect all risks from different analyzers
    const allRisks = [
      ...this.analyzeTokenAllocation(input),
      ...this.analyzeSupplyDynamics(input),
      ...this.analyzeMarketRisks(input),
      ...this.runStressTests(input)
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
