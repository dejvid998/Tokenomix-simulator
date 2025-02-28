
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TokenomicsData {
  totalSupply: number;
  allocations: {
    category: string;
    percentage: number;
  }[];
}

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

  return (
    <div className="space-y-6">
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
          Token Allocation
        </h4>
        
        {data.allocations.map((allocation, index) => (
          <div key={allocation.category} className="space-y-2">
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
          </div>
        ))}
      </div>

      <Button className="w-full mt-6">
        Save Configuration
      </Button>
    </div>
  );
};
