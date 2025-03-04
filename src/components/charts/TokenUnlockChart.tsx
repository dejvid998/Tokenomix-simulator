
import React from 'react';
import type { TokenAllocation } from '@/types/tokenomics';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  data: TokenAllocation[];
  totalSupply: number;
}

export const TokenUnlockChart: React.FC<Props> = ({ data, totalSupply }) => {
  // Calculate unlocks for each category and month (1-12)
  const calculateUnlocks = () => {
    return data.map(allocation => {
      const { category, percentage, vesting } = allocation;
      const tokens = (percentage / 100) * totalSupply;
      
      // Calculate unlock values for each month
      const monthlyUnlocks = Array.from({ length: 12 }, (_, month) => {
        const currentMonth = month + 1; // 1-based month number
        
        if (currentMonth < vesting.cliff) return 0;
        
        if (vesting.type === 'cliff') {
          return currentMonth >= vesting.cliff ? tokens : 0;
        }
        
        // Linear vesting after cliff
        const vestingMonths = vesting.duration - vesting.cliff;
        if (vestingMonths <= 0) return tokens;
        
        const monthsVested = Math.max(0, currentMonth - vesting.cliff);
        const vestingProgress = Math.min(monthsVested / vestingMonths, 1);
        
        return tokens * vestingProgress;
      });

      return {
        category,
        totalAllocation: tokens,
        monthlyUnlocks
      };
    });
  };

  const unlockData = calculateUnlocks();
  
  // Calculate totals for each month
  const monthlyTotals = Array.from({ length: 12 }, (_, month) => {
    return unlockData.reduce((sum, row) => sum + row.monthlyUnlocks[month], 0);
  });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Unlock Value</TableHead>
            {Array.from({ length: 12 }, (_, i) => (
              <TableHead key={i + 1} className="text-right">
                {i + 1}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {unlockData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium bg-muted/50">
                {row.category} ({((row.totalAllocation / totalSupply) * 100).toFixed(1)}%)
              </TableCell>
              {row.monthlyUnlocks.map((value, month) => (
                <TableCell key={month} className="text-right">
                  {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow className="font-bold">
            <TableCell>Total</TableCell>
            {monthlyTotals.map((total, month) => (
              <TableCell key={month} className="text-right">
                {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
