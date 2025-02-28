
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProjectHeader = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          Tokenomics Simulator
        </span>
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Design Your Token Economics
      </h1>
      
      <p className="max-w-2xl text-zinc-600 dark:text-zinc-300">
        Simulate and visualize token distribution models with real-time updates. 
        Create sustainable tokenomics that align with your project goals.
      </p>

      <Button variant="outline" size="sm" className="mt-4">
        <span>Learn more</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
