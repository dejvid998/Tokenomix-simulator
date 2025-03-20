
import React from 'react';
import type { TokenAllocation } from '@/types/tokenomics';

interface CustomLegendProps {
  chartData: TokenAllocation[];
  colors: string[];
  onSliceClick: (entry: any, index: number) => void;
}

export const CustomLegend: React.FC<CustomLegendProps> = ({ chartData, colors, onSliceClick }) => {
  return (
    <div className="w-full px-4 mt-8">
      <div className="flex flex-wrap justify-center items-center gap-4">
        {chartData.map((entry, index) => (
          <div 
            key={`legend-${index}`} 
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            onClick={() => onSliceClick(entry, index)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-xs font-medium">
              {entry.category} ({entry.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
