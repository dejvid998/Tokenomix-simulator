import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Save, Plus } from 'lucide-react';
import type { TokenomicsData, TokenAllocation, MarketCondition } from '@/types/tokenomics';
import { TemplateButtons } from './tokenomics/TemplateButtons';
import { AllocationCard } from './tokenomics/AllocationCard';

interface Props {
  data: TokenomicsData;
  onChange: (data: TokenomicsData) => void;
}

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

  const handleExportCSV = () => {
    try {
      let csvContent = "Category,Percentage,Cliff (months),Vesting Duration (months),Vesting Type,Token Amount\n";
      
      data.allocations.forEach(a => {
        const tokenAmount = (a.percentage / 100) * data.totalSupply;
        csvContent += `${a.category},${a.percentage},${a.vesting.cliff},${a.vesting.duration},${a.vesting.type},${tokenAmount}\n`;
      });
      
      csvContent += `\nTotal Supply,${data.totalSupply}\n`;
      csvContent += `Market Condition,${data.marketCondition}\n`;

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tokenomics-report.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("CSV report downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export CSV");
    }
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

  const handleSaveConfiguration = () => {
    try {
      localStorage.setItem('tokenomics-config', JSON.stringify(data));
      
      const totalPercentage = data.allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
      
      if (totalPercentage !== 100) {
        toast.error("Total allocation must equal 100%");
        return;
      }
      
      toast.success("Configuration saved successfully!");
    } catch (error) {
      toast.error("Failed to save configuration");
    }
  };

  return (
    <div className="space-y-6">
      <TemplateButtons onTemplateSelect={onChange} />

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
          <AllocationCard
            key={`${allocation.category}-${index}`}
            allocation={allocation}
            index={index}
            onCategoryChange={handleCategoryChange}
            onAllocationChange={handleAllocationChange}
            onVestingChange={handleVestingChange}
            onRemove={handleRemoveAllocation}
          />
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
        <Button className="flex-1" onClick={handleSaveConfiguration}>
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
