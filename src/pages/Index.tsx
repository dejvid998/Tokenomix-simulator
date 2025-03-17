
import React from 'react';
import { Card } from "@/components/ui/card";
import { TokenDistributionChart } from "@/components/charts/TokenDistributionChart";
import { TokenUnlockChart } from "@/components/charts/TokenUnlockChart";
import { TokenomicsForm } from "@/components/forms/TokenomicsForm";
import { NavBar } from "@/components/layout/NavBar";
import type { TokenomicsData, TokenAllocation, VestingType } from '@/types/tokenomics';
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { TEMPLATES } from '@/components/forms/tokenomics/tokenomics-templates';

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

  const handleTemplateSelect = (newAllocations: TokenAllocation[]) => {
    setTokenomicsData(prev => ({
      ...prev,
      allocations: newAllocations
    }));
  };

  // Function to load a complete template including total supply
  const handleFullTemplateSelect = (template: string) => {
    if (TEMPLATES[template]) {
      setTokenomicsData(TEMPLATES[template]);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6 mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Optimize & Simulate Your Tokenomics – In Seconds
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Instant Tokenomics Simulations, Investor-Ready Reports
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 scale-100 hover:scale-105 transition-all duration-300"
              >
                <BarChart className="mr-2" />
                Start a New Simulation
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="scale-100 hover:scale-105 transition-all duration-300"
                onClick={() => handleFullTemplateSelect('makerdao')}
              >
                Import MakerDAO Tokenomics
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
                  Token Distribution
                </h3>
                <Card className="p-4 md:p-6 backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl h-[500px]">
                  <div className="hover:scale-[1.02] transition-transform duration-300 h-full">
                    <TokenDistributionChart 
                      data={tokenomicsData.allocations}
                      onTemplateSelect={handleTemplateSelect}
                    />
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
                  Token Unlock Schedule
                </h3>
                <Card className="p-4 md:p-6 backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl h-[500px]">
                  <div className="hover:scale-[1.02] transition-transform duration-300 h-full">
                    <TokenUnlockChart 
                      data={tokenomicsData.allocations}
                      totalSupply={tokenomicsData.totalSupply}
                    />
                  </div>
                </Card>
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
