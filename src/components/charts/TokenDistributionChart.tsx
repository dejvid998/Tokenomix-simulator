
import React, { useState } from 'react';
import { CHART_COLORS } from './token-distribution/constants';
import { PieChartComponent } from './token-distribution/PieChartComponent';
import { CustomLegend } from './token-distribution/CustomLegend';
import { SliceEditor } from './token-distribution/SliceEditor';
import type { TokenAllocation } from '@/types/tokenomics';

interface Props {
  data: TokenAllocation[];
  onTemplateSelect?: (template: TokenAllocation[]) => void;
  onAllocationChange?: (index: number, newPercentage: number) => void;
}

export const TokenDistributionChart: React.FC<Props> = ({ data, onTemplateSelect, onAllocationChange }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<number>(0);
  
  // Create a new data array with exact percentage values (not calculated from percent)
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      // Ensure percentage is a whole number for display
      percentage: Math.round(item.percentage)
    }));
  }, [data]);

  const handlePieClick = (data: any, index: number) => {
    setActiveIndex(index);
    setEditingValue(chartData[index].percentage);
  };

  const handleSliderChange = (value: number[]) => {
    setEditingValue(value[0]);
  };

  const handleSaveAllocation = () => {
    if (onAllocationChange && activeIndex !== null) {
      onAllocationChange(activeIndex, editingValue);
      setActiveIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setActiveIndex(null);
  };

  return (
    <div className="space-y-6 flex flex-col items-center justify-center h-full w-full" id="token-distribution-chart">
      <div className="w-full relative" style={{ height: '320px' }}>
        <PieChartComponent 
          chartData={chartData}
          colors={CHART_COLORS}
          activeIndex={activeIndex}
          onPieClick={handlePieClick}
        />

        <SliceEditor 
          chartData={chartData}
          activeIndex={activeIndex}
          editingValue={editingValue}
          onSliderChange={handleSliderChange}
          onSave={handleSaveAllocation}
          onCancel={handleCancelEdit}
        />
      </div>

      {/* Separate legend with more space */}
      <CustomLegend 
        chartData={chartData} 
        colors={CHART_COLORS} 
        onSliceClick={handlePieClick} 
      />
    </div>
  );
};
