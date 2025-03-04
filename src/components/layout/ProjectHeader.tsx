
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProjectHeader = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          Token Vesting Platform
        </span>
      </div>
      
      <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-200 bg-clip-text text-transparent">
        UnlockFi
      </h1>
      
      <p className="max-w-2xl text-zinc-600 dark:text-zinc-300">
        Design Your Token Economics
      </p>

      <Button variant="outline" size="sm" className="mt-4">
        <span>Learn more</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
