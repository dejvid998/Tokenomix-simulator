
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ValuationInput } from "@/types/valuation";

interface MarketDetailsFieldsProps {
  formData: ValuationInput;
  onFieldChange: (field: keyof ValuationInput, value: any) => void;
}

export const MarketDetailsFields = ({ formData, onFieldChange }: MarketDetailsFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Project Category</Label>
        <Select
          value={formData.projectCategory}
          onValueChange={(value: ValuationInput['projectCategory']) => 
            onFieldChange('projectCategory', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DeFi">DeFi</SelectItem>
            <SelectItem value="GameFi">GameFi</SelectItem>
            <SelectItem value="NFT">NFT</SelectItem>
            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            <SelectItem value="DAO">DAO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Market Condition</Label>
        <Select
          value={formData.marketCondition}
          onValueChange={(value: ValuationInput['marketCondition']) => 
            onFieldChange('marketCondition', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bull">Bull Market</SelectItem>
            <SelectItem value="Bear">Bear Market</SelectItem>
            <SelectItem value="Neutral">Neutral Market</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
