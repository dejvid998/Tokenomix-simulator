
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { renderCustomizedLabel } from './ChartLabel';
import type { TokenAllocation } from '@/types/tokenomics';

interface PieChartComponentProps {
  chartData: TokenAllocation[];
  colors: string[];
  activeIndex: number | null;
  onPieClick: (data: any, index: number) => void;
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({ 
  chartData, 
  colors, 
  activeIndex, 
  onPieClick 
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={(props) => renderCustomizedLabel(props, colors)}
          outerRadius={100} 
          innerRadius={0}
          paddingAngle={1}
          fill="#8884d8"
          dataKey="percentage"
          nameKey="category"
          onClick={onPieClick}
          className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
          activeIndex={activeIndex !== null ? [activeIndex] : []}
          activeShape={(props) => {
            const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
            return (
              <g>
                <g>
                  {renderCustomizedLabel(props, colors)}
                </g>
                <path 
                  d={`M ${cx},${cy} L ${cx + outerRadius * Math.cos(-startAngle * Math.PI / 180)},${cy + outerRadius * Math.sin(-startAngle * Math.PI / 180)} A ${outerRadius},${outerRadius} 0 ${endAngle - startAngle > 180 ? 1 : 0},0 ${cx + outerRadius * Math.cos(-endAngle * Math.PI / 180)},${cy + outerRadius * Math.sin(-endAngle * Math.PI / 180)} Z`} 
                  fill={fill}
                  stroke="#fff"
                  strokeWidth={3}
                  opacity={0.9}
                />
              </g>
            );
          }}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
              stroke="#ffffff"
              strokeWidth={2}
              className="transition-all duration-300 ease-in-out hover:opacity-80"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};
