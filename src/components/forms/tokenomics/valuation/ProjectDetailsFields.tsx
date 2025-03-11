
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ValuationInput } from "@/types/valuation";

interface ProjectDetailsFieldsProps {
  formData: ValuationInput;
  onFieldChange: (field: keyof ValuationInput, value: any) => void;
}

export const ProjectDetailsFields = ({ formData, onFieldChange }: ProjectDetailsFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fundraisingAmount">Fundraising Amount ($)</Label>
        <Input
          id="fundraisingAmount"
          type="number"
          value={formData.fundraisingAmount}
          onChange={(e) => onFieldChange('fundraisingAmount', Number(e.target.value))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tokenPrice">Token Price ($)</Label>
        <Input
          id="tokenPrice"
          type="number"
          value={formData.tokenPrice}
          onChange={(e) => onFieldChange('tokenPrice', Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Fundraising Method</Label>
        <Select
          value={formData.fundraisingMethod}
          onValueChange={(value: ValuationInput['fundraisingMethod']) => 
            onFieldChange('fundraisingMethod', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IDO">IDO</SelectItem>
            <SelectItem value="Private Sale">Private Sale</SelectItem>
            <SelectItem value="Fair Launch">Fair Launch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tgeCirculatingSupply">TGE Circulating Supply (%)</Label>
        <Input
          id="tgeCirculatingSupply"
          type="number"
          value={formData.tgeCirculatingSupply}
          onChange={(e) => onFieldChange('tgeCirculatingSupply', Number(e.target.value))}
          required
        />
      </div>
    </>
  );
};
