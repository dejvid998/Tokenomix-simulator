
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";
import type { TokenAllocation } from '@/types/tokenomics';

interface Props {
  data: TokenAllocation[];
  onTemplateSelect?: (template: TokenAllocation[]) => void;
}

// Updated colors with better contrast for white background
const COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Vivid Purple
  '#14B8A6', // Teal
  '#D946EF', // Magenta Pink
  '#3B82F6', // Blue
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Card className="bg-white/90 dark:bg-zinc-900/90 p-3 border-none shadow-lg">
        <p className="font-medium text-sm">{data.category}</p>
        <p className="text-sm text-muted-foreground">
          {data.percentage.toFixed(1)}% ({(data.percentage * 1000000000 / 100).toLocaleString()} tokens)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Vesting: {data.vesting.duration} months
          {data.vesting.cliff > 0 && ` (${data.vesting.cliff} months cliff)`}
        </p>
      </Card>
    );
  }
  return null;
};

// Custom label component for pie chart sections - displaying labels repositioned
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload } = props;
  const RADIAN = Math.PI / 180;
  
  // Adjust the radius to position labels at a more central location
  // between current position and bottom of chart
  const radius = outerRadius * 1.25; // Increased from 1.15 to push labels further out
  
  // Calculate position with adjusted angle to move labels downward
  // This creates a more central position between current and bottom
  const adjustedAngle = midAngle * 0.85; // Reduce angle influence to shift toward bottom
  const x = cx + radius * Math.cos(-adjustedAngle * RADIAN);
  const y = cy + radius * Math.sin(-adjustedAngle * RADIAN) + 15; // Add offset to push down
  
  // Only show label if percentage is large enough to be visible
  if (percent < 0.04) return null;
  
  // Determine text anchor based on the position of label
  const textAnchor = x > cx ? 'start' : 'end';
  
  return (
    <text 
      x={x} 
      y={y} 
      fill={COLORS[index % COLORS.length]}
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontWeight="bold"
      fontSize={12}
    >
      {`${payload.category} (${payload.percentage}%)`}
    </text>
  );
};

export const TokenDistributionChart: React.FC<Props> = ({ data }) => {
  // Create a new data array with exact percentage values (not calculated from percent)
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      // Ensure percentage is a whole number for display
      percentage: Math.round(item.percentage)
    }));
  }, [data]);

  return (
    <div className="space-y-2 flex flex-col items-center justify-center h-full">
      <div className="w-full" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={renderCustomizedLabel}
              outerRadius={110} // Reduced radius to make room for external labels
              fill="#8884d8"
              dataKey="percentage"
              nameKey="category"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="transition-all duration-300 ease-in-out hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={36} // Reduced from 40 to minimize empty space
              layout="horizontal"
              align="center"
              wrapperStyle={{
                paddingTop: "10px", // Reduced from 20px
                fontSize: "12px",
                bottom: "0px" // Changed from -10px to reduce empty space
              }}
              formatter={(value: string, entry: any) => {
                const { payload } = entry;
                return (
                  <span className="text-xs font-medium">
                    {value} ({payload.percentage}%)
                  </span>
                );
              }}
              iconType="circle"
              iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
