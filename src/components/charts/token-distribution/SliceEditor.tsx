
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { TokenAllocation } from '@/types/tokenomics';

interface SliceEditorProps {
  chartData: TokenAllocation[];
  activeIndex: number | null;
  editingValue: number;
  onSliderChange: (value: number[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const SliceEditor: React.FC<SliceEditorProps> = ({ 
  chartData, 
  activeIndex, 
  editingValue, 
  onSliderChange, 
  onSave, 
  onCancel
}) => {
  if (activeIndex === null) return null;
  
  return (
    <div className="absolute top-0 right-0 z-10 p-3 bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg">
      <div className="flex flex-col space-y-3 w-56">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">{chartData[activeIndex]?.category}</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="h-7 w-7 p-0"
          >
            ✕
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Allocation Percentage</span>
            <span className="text-xs font-medium">{editingValue}%</span>
          </div>
          <Slider
            value={[editingValue]}
            min={0}
            max={100}
            step={1}
            onValueChange={onSliderChange}
          />
        </div>
        <div className="flex justify-end">
          <Button 
            size="sm" 
            onClick={onSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
