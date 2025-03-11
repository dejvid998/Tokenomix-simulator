
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
        <Label htmlFor="totalSupply">Total Supply</Label>
        <Input
          id="totalSupply"
          type="number"
          value={formData.totalSupply}
          onChange={(e) => onFieldChange('totalSupply', Number(e.target.value))}
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

      <div className="space-y-2">
        <Label htmlFor="dexLiquidity">Initial DEX Liquidity ($)</Label>
        <Input
          id="dexLiquidity"
          type="number"
          value={formData.dexLiquidity}
          onChange={(e) => onFieldChange('dexLiquidity', Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="initialStaking">Initial Staking APY (%)</Label>
        <Input
          id="initialStaking"
          type="number"
          value={formData.initialStaking}
          onChange={(e) => onFieldChange('initialStaking', Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="teamTokens">Team & Advisor Tokens (%)</Label>
        <Input
          id="teamTokens"
          type="number"
          value={formData.teamTokens}
          onChange={(e) => onFieldChange('teamTokens', Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="marketingBudget">Marketing Budget ($)</Label>
        <Input
          id="marketingBudget"
          type="number"
          value={formData.marketingBudget}
          onChange={(e) => onFieldChange('marketingBudget', Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lockupDuration">Lockup Duration (months)</Label>
        <Input
          id="lockupDuration"
          type="number"
          value={formData.lockupDuration}
          onChange={(e) => onFieldChange('lockupDuration', Number(e.target.value))}
          required
        />
      </div>
    </>
  );
};
