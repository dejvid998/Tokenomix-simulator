import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Save, Plus, Trash2 } from 'lucide-react';
import type { TokenomicsData, TokenAllocation, VestingType, MarketCondition } from '@/types/tokenomics';

interface Props {
  data: TokenomicsData;
  onChange: (data: TokenomicsData) => void;
}

const TEMPLATES = {
  dao: {
    totalSupply: 1000000000,
    allocations: [
      { category: "Community Treasury", percentage: 40, vesting: { cliff: 12, duration: 48, type: "linear" as VestingType } },
      { category: "Team", percentage: 15, vesting: { cliff: 12, duration: 36, type: "linear" as VestingType } },
      { category: "Early Contributors", percentage: 10, vesting: { cliff: 6, duration: 24, type: "linear" as VestingType } },
      { category: "Public Sale", percentage: 25, vesting: { cliff: 0, duration: 0, type: "cliff" as VestingType } },
      { category: "Ecosystem Growth", percentage: 10, vesting: { cliff: 3, duration: 36, type: "linear" as VestingType } }
    ],
    marketCondition: "neutral" as MarketCondition
  },
  defi: {
    totalSupply: 2000000000,
    allocations: [
      { category: "Protocol Treasury", percentage: 35, vesting: { cliff: 3, duration: 48, type: "linear" as VestingType } },
      { category: "Team", percentage: 20, vesting: { cliff: 12, duration: 36, type: "linear" as VestingType } },
      { category: "Liquidity Mining", percentage: 15, vesting: { cliff: 0, duration: 24, type: "linear" as VestingType } },
      { category: "Public Sale", percentage: 20, vesting: { cliff: 0, duration: 0, type: "cliff" as VestingType } },
      { category: "Marketing", percentage: 10, vesting: { cliff: 1, duration: 24, type: "linear" as VestingType } }
    ],
    marketCondition: "neutral" as MarketCondition
  }
} satisfies Record<string, TokenomicsData>;

export const TokenomicsForm: React.FC<Props> = ({ data, onChange }) => {
  const handleTotalSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      totalSupply: Number(e.target.value)
    });
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newAllocations = [...data.allocations];
    newAllocations[index] = {
      ...newAllocations[index],
      category: value
    };
    onChange({
      ...data,
      allocations: newAllocations
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

  const handleVestingChange = (index: number, field: keyof TokenAllocation['vesting'], value: any) => {
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

  const handleExportCSV = () => {
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
    
    toast.success("CSV report downloaded successfully!");
  };

  const handleAddAllocation = () => {
    const newAllocation: TokenAllocation = {
      category: "New Team",
      percentage: 0,
      vesting: { cliff: 0, duration: 12, type: "linear" }
    };
    
    onChange({
      ...data,
      allocations: [...data.allocations, newAllocation]
    });
    toast.success("New team allocation added!");
  };

  const handleRemoveAllocation = (index: number) => {
    const totalRemainingPercentage = data.allocations
      .filter((_, i) => i !== index)
      .reduce((sum, allocation) => sum + allocation.percentage, 0);

    if (totalRemainingPercentage > 100) {
      toast.error("Total allocation cannot exceed 100%");
      return;
    }

    const newAllocations = data.allocations.filter((_, i) => i !== index);
    onChange({
      ...data,
      allocations: newAllocations
    });
    toast.success("Team allocation removed!");
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
          onClick={() => handleTemplateSelect("defi")}
          className="flex-1"
        >
          Load DeFi Template
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

      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
          Token Allocation & Vesting
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddAllocation}
          className="flex gap-2 items-center"
        >
          <Plus className="w-4 h-4" />
          Add Team
        </Button>
      </div>

      <div className="space-y-4">
        {data.allocations.map((allocation, index) => (
          <Card key={`${allocation.category}-${index}`} className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <Input
                  value={allocation.category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  className="mb-2"
                  placeholder="Team Name"
                  autoFocus={false}
                />
                <span className="text-sm text-zinc-500">
                  {allocation.percentage}%
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAllocation(index)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
                onValueChange={(value: VestingType) => handleVestingChange(index, "type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="cliff">Cliff</SelectItem>
                  <SelectItem value="exponential">Exponential</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
          Market Condition Simulation
        </h4>
        <Select
          value={data.marketCondition}
          onValueChange={(value: MarketCondition) => 
            onChange({ ...data, marketCondition: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bull">Bull Market</SelectItem>
            <SelectItem value="bear">Bear Market</SelectItem>
            <SelectItem value="neutral">Neutral Market</SelectItem>
            <SelectItem value="shock">Liquidity Shock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button className="flex-1" onClick={() => toast.success("Configuration saved!")}>
          <Save className="mr-2" />
          Save Configuration
        </Button>
        <Button 
          variant="outline"
          onClick={handleExportCSV}
          className="flex-1"
        >
          <Download className="mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};
