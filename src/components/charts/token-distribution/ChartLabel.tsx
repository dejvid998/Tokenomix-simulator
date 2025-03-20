
import React from 'react';

interface ChartLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  index: number;
  payload: {
    category: string;
    percentage: number;
  };
  colors: string[];
}

export const ChartLabel: React.FC<ChartLabelProps> = ({ 
  cx, 
  cy, 
  midAngle, 
  outerRadius, 
  percent, 
  index, 
  payload,
  colors
}) => {
  const RADIAN = Math.PI / 180;
  
  // Increase radius to position labels further from pie
  const radius = outerRadius * 1.4;
  
  // Calculate position with angle
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Only show label if percentage is large enough to be visible
  if (percent < 0.04) return null;
  
  // Determine text anchor based on the position of label
  const textAnchor = x > cx ? 'start' : 'end';
  
  return (
    <text 
      x={x} 
      y={y} 
      fill={colors[index % colors.length]}
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontWeight="bold"
      fontSize={12}
    >
      {`${payload.category} (${payload.percentage}%)`}
    </text>
  );
};

export const renderCustomizedLabel = (props: any, colors: string[]) => {
  return <ChartLabel {...props} colors={colors} />;
};
