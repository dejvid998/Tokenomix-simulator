
import React from 'react';
import { Card } from "@/components/ui/card";
import { TokenDistributionChart } from "@/components/charts/TokenDistributionChart";
import { TokenomicsForm } from "@/components/forms/TokenomicsForm";
import { TokenomicsQuestionnaire } from "@/components/forms/tokenomics/TokenomicsQuestionnaire";
import { ProjectHeader } from "@/components/layout/ProjectHeader";
import type { TokenomicsData, VestingType } from '@/types/tokenomics';

const Index = () => {
  const [tokenomicsData, setTokenomicsData] = React.useState<TokenomicsData>({
    totalSupply: 1000000000,
    allocations: [
      { 
        category: "Team", 
        percentage: 15,
        vesting: { cliff: 12, duration: 36, type: "linear" as VestingType }
      },
      { 
        category: "Advisors", 
        percentage: 5,
        vesting: { cliff: 6, duration: 24, type: "linear" as VestingType }
      },
      { 
        category: "Private Sale", 
        percentage: 10,
        vesting: { cliff: 3, duration: 12, type: "linear" as VestingType }
      },
      { 
        category: "Public Sale", 
        percentage: 20,
        vesting: { cliff: 0, duration: 0, type: "cliff" as VestingType }
      },
      { 
        category: "Community", 
        percentage: 20,
        vesting: { cliff: 0, duration: 24, type: "linear" as VestingType }
      },
      { 
        category: "Ecosystem", 
        percentage: 15,
        vesting: { cliff: 6, duration: 36, type: "linear" as VestingType }
      },
      { 
        category: "Treasury", 
        percentage: 15,
        vesting: { cliff: 6, duration: 48, type: "linear" as VestingType }
      }
    ],
    marketCondition: "neutral"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-12">
        <ProjectHeader />
        
        <div className="space-y-8 mt-12">
          <Card className="p-8 backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-6 tracking-wide uppercase">
              Token Distribution
            </h3>
            <div className="hover:scale-[1.02] transition-transform duration-300">
              <TokenDistributionChart data={tokenomicsData.allocations} />
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
                Configure Tokenomics
              </h3>
              <Card className="p-6 backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <TokenomicsForm 
                  data={tokenomicsData} 
                  onChange={setTokenomicsData} 
                />
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
                Tokenomics Questionnaire
              </h3>
              <Card className="p-6 backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <TokenomicsQuestionnaire />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
