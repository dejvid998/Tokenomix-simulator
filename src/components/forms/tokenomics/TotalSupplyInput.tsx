
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TotalSupplyInput: React.FC<Props> = ({ value, onChange }) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="totalSupply">Total Token Supply</Label>
      <Input
        id="totalSupply"
        type="text"
        value={formatNumber(value)}
        onChange={onChange}
        className="font-mono"
      />
    </div>
  );
};
