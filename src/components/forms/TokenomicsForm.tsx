
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { TokenomicsData, MarketCondition } from '@/types/tokenomics';
import { TemplateButtons } from './tokenomics/TemplateButtons';
import { AllocationCard } from './tokenomics/AllocationCard';
import { TotalSupplyInput } from './tokenomics/TotalSupplyInput';
import { MarketConditionSelect } from './tokenomics/MarketConditionSelect';
import { ActionButtons } from './tokenomics/ActionButtons';
import { useTokenomicsForm } from '@/hooks/useTokenomicsForm';

interface Props {
  data: TokenomicsData;
  onChange: (data: TokenomicsData) => void;
}

export const TokenomicsForm: React.FC<Props> = ({ data, onChange }) => {
  const {
    handleTotalSupplyChange,
    handleCategoryChange,
    handleAllocationChange,
    handleVestingChange,
    handleAddAllocation,
    handleRemoveAllocation,
    handleSaveConfiguration,
    handleExportXLSX,
  } = useTokenomicsForm(data, onChange);

  return (
    <div className="space-y-6">
      <TemplateButtons onTemplateSelect={onChange} />

      <TotalSupplyInput 
        value={data.totalSupply}
        onChange={handleTotalSupplyChange}
      />

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

      <MarketConditionSelect
        value={data.marketCondition}
        onChange={(value: MarketCondition) => 
          onChange({ ...data, marketCondition: value })}
      />

      <ActionButtons
        onSave={handleSaveConfiguration}
        onExport={handleExportXLSX}
      />
    </div>
  );
};
