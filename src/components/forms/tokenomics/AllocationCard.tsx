import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import type { TokenAllocation, VestingType } from '@/types/tokenomics';

interface Props {
  allocation: TokenAllocation;
  index: number;
  onCategoryChange: (index: number, value: string) => void;
  onAllocationChange: (index: number, value: number) => void;
  onVestingChange: (index: number, field: keyof TokenAllocation['vesting'], value: any) => void;
  onRemove: (index: number) => void;
}

export const AllocationCard = ({
  allocation,
  index,
  onCategoryChange,
  onAllocationChange,
  onVestingChange,
  onRemove
}: Props) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Input
            value={allocation.category}
            onChange={(e) => onCategoryChange(index, e.target.value)}
            className="mb-2"
            placeholder="Team Name"
            autoFocus={false}
          />
          <span className="text-sm text-zinc-500">
            {allocation.percentage}%
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Slider
        value={[allocation.percentage]}
        min={0}
        max={100}
        step={1}
        onValueChange={(values) => onAllocationChange(index, values[0])}
        className="cursor-pointer"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Cliff (months)</Label>
          <Input
            type="number"
            value={allocation.vesting.cliff}
            onChange={(e) => onVestingChange(index, "cliff", Number(e.target.value))}
            min={0}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Period before tokens begin unlocking
          </p>
        </div>
        <div>
          <Label>Duration (months)</Label>
          <Input
            type="number"
            value={allocation.vesting.duration}
            onChange={(e) => onVestingChange(index, "duration", Number(e.target.value))}
            min={0}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Period over which tokens gradually unlock
          </p>
        </div>
      </div>

      <div>
        <Label>Vesting Type</Label>
        <Select
          value={allocation.vesting.type}
          onValueChange={(value: VestingType) => onVestingChange(index, "type", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="cliff">Cliff</SelectItem>
            <SelectItem value="exponential">Exponential</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
