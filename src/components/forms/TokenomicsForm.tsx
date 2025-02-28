
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";

interface VestingSchedule {
  cliff: number;
  duration: number;
  type: "linear" | "cliff";
}

interface TokenAllocation {
  category: string;
  percentage: number;
  vesting: VestingSchedule;
}

interface TokenomicsData {
  totalSupply: number;
  allocations: TokenAllocation[];
  marketCondition: "bull" | "bear" | "neutral";
}

interface Props {
  data: TokenomicsData;
  onChange: (data: TokenomicsData) => void;
}

const TEMPLATES = {
  dao: {
    totalSupply: 1000000000,
    allocations: [
      { category: "Community Treasury", percentage: 40, vesting: { cliff: 12, duration: 48, type: "linear" } },
      { category: "Team", percentage: 15, vesting: { cliff: 12, duration: 36, type: "linear" } },
      { category: "Early Contributors", percentage: 10, vesting: { cliff: 6, duration: 24, type: "linear" } },
      { category: "Public Sale", percentage: 25, vesting: { cliff: 0, duration: 0, type: "cliff" } },
      { category: "Ecosystem Growth", percentage: 10, vesting: { cliff: 3, duration: 36, type: "linear" } }
    ],
    marketCondition: "neutral"
  },
  gamefi: {
    totalSupply: 2000000000,
    allocations: [
      { category: "Play Rewards", percentage: 35, vesting: { cliff: 3, duration: 48, type: "linear" } },
      { category: "Team", percentage: 20, vesting: { cliff: 12, duration: 36, type: "linear" } },
      { category: "Initial Game Assets", percentage: 15, vesting: { cliff: 0, duration: 24, type: "linear" } },
      { category: "Public Sale", percentage: 20, vesting: { cliff: 0, duration: 0, type: "cliff" } },
      { category: "Marketing", percentage: 10, vesting: { cliff: 1, duration: 24, type: "linear" } }
    ],
    marketCondition: "neutral"
  }
};

export const TokenomicsForm: React.FC<Props> = ({ data, onChange }) => {
  const handleTotalSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      totalSupply: Number(e.target.value)
    });
  };

  const handleAllocationChange = (index: number, value: number) => {
    const newAllocations = [...data.allocations];
    newAllocations[index] = {
      ...newAllocations[index],
      percentage: value
    };
    onChange({
      ...data,
      allocations: newAllocations
    });
  };

  const handleVestingChange = (index: number, field: keyof VestingSchedule, value: any) => {
    const newAllocations = [...data.allocations];
    newAllocations[index] = {
      ...newAllocations[index],
      vesting: {
        ...newAllocations[index].vesting,
        [field]: value
      }
    };
    onChange({
      ...data,
      allocations: newAllocations
    });
  };

  const handleTemplateSelect = (template: keyof typeof TEMPLATES) => {
    onChange(TEMPLATES[template]);
    toast.success("Template applied successfully!");
  };

  const handleExportReport = () => {
    // Basic CSV export
    const csvContent = [
      ["Category", "Percentage", "Cliff (months)", "Vesting Duration (months)", "Vesting Type"],
      ...data.allocations.map(a => [
        a.category,
        a.percentage,
        a.vesting.cliff,
        a.vesting.duration,
        a.vesting.type
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tokenomics-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => handleTemplateSelect("dao")}
          className="flex-1"
        >
          Load DAO Template
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleTemplateSelect("gamefi")}
          className="flex-1"
        >
          Load GameFi Template
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalSupply">Total Token Supply</Label>
        <Input
          id="totalSupply"
          type="number"
          value={data.totalSupply}
          onChange={handleTotalSupplyChange}
          className="font-mono"
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
          Token Allocation & Vesting
        </h4>
        
        {data.allocations.map((allocation, index) => (
          <div key={allocation.category} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>{allocation.category}</Label>
              <span className="text-sm text-zinc-500">
                {allocation.percentage}%
              </span>
            </div>
            
            <Slider
              value={[allocation.percentage]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => handleAllocationChange(index, values[0])}
              className="cursor-pointer"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cliff (months)</Label>
                <Input
                  type="number"
                  value={allocation.vesting.cliff}
                  onChange={(e) => handleVestingChange(index, "cliff", Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label>Duration (months)</Label>
                <Input
                  type="number"
                  value={allocation.vesting.duration}
                  onChange={(e) => handleVestingChange(index, "duration", Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>

            <div>
              <Label>Vesting Type</Label>
              <Select
                value={allocation.vesting.type}
                onValueChange={(value: "linear" | "cliff") => handleVestingChange(index, "type", value)}
              >
                <option value="linear">Linear</option>
                <option value="cliff">Cliff</option>
              </Select>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
          Market Condition Simulation
        </h4>
        <Select
          value={data.marketCondition}
          onValueChange={(value: "bull" | "bear" | "neutral") => 
            onChange({ ...data, marketCondition: value })}
        >
          <option value="bull">Bull Market</option>
          <option value="bear">Bear Market</option>
          <option value="neutral">Neutral Market</option>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button className="flex-1">
          Save Configuration
        </Button>
        <Button 
          variant="outline"
          onClick={handleExportReport}
          className="flex-1"
        >
          Export Report
        </Button>
      </div>
    </div>
  );
};
