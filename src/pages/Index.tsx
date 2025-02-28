
import React from 'react';
import { Card } from "@/components/ui/card";
import { TokenDistributionChart } from "@/components/charts/TokenDistributionChart";
import { TokenomicsForm } from "@/components/forms/TokenomicsForm";
import { ProjectHeader } from "@/components/layout/ProjectHeader";

const Index = () => {
  const [tokenomicsData, setTokenomicsData] = React.useState({
    totalSupply: 1000000000,
    allocations: [
      { category: "Team", percentage: 20 },
      { category: "Advisors", percentage: 5 },
      { category: "Public Sale", percentage: 30 },
      { category: "Ecosystem", percentage: 25 },
      { category: "Treasury", percentage: 20 }
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-8">
        <ProjectHeader />
        
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Token Distribution
            </h3>
            <TokenDistributionChart data={tokenomicsData.allocations} />
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
              Configure Tokenomics
            </h3>
            <TokenomicsForm 
              data={tokenomicsData} 
              onChange={setTokenomicsData} 
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
