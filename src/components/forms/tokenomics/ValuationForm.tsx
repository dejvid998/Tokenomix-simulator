import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ValuationService } from '@/services/valuationService';
import type { ValuationInput, ValuationOutput } from '@/types/valuation';

export const ValuationForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [valuation, setValuation] = React.useState<ValuationOutput | null>(null);
  const [formData, setFormData] = React.useState<ValuationInput>({
    fundraisingAmount: 0,
    tokenPrice: 0,
    fundraisingMethod: 'IDO',
    totalSupply: 0,
    tgeCirculatingSupply: 0,
    dexLiquidity: 0,
    lockupDuration: 0,
    projectCategory: 'DeFi',
    marketCondition: 'Neutral'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await ValuationService.generateValuation(formData);
      setValuation(result);
      toast.success("Valuation estimate generated!");
    } catch (error) {
      toast.error("Failed to generate valuation");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fundraisingAmount">Fundraising Amount ($)</Label>
            <Input
              id="fundraisingAmount"
              type="number"
              value={formData.fundraisingAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, fundraisingAmount: Number(e.target.value) }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tokenPrice">Token Price ($)</Label>
            <Input
              id="tokenPrice"
              type="number"
              value={formData.tokenPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, tokenPrice: Number(e.target.value) }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Fundraising Method</Label>
            <Select
              value={formData.fundraisingMethod}
              onValueChange={(value: ValuationInput['fundraisingMethod']) => 
                setFormData(prev => ({ ...prev, fundraisingMethod: value }))
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
              onChange={(e) => setFormData(prev => ({ ...prev, tgeCirculatingSupply: Number(e.target.value) }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Project Category</Label>
            <Select
              value={formData.projectCategory}
              onValueChange={(value: ValuationInput['projectCategory']) => 
                setFormData(prev => ({ ...prev, projectCategory: value }))
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
                setFormData(prev => ({ ...prev, marketCondition: value }))
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
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Calculating..." : "Generate Valuation Estimate"}
        </Button>
      </form>

      {valuation && (
        <div className="space-y-4 pt-6 border-t">
          <div className="space-y-2">
            <h3 className="font-semibold">Estimated Valuation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <div className="text-sm text-zinc-500">FDV Range</div>
                <div className="font-semibold">
                  {formatCurrency(valuation.fdvRange.min)} - {formatCurrency(valuation.fdvRange.max)}
                </div>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <div className="text-sm text-zinc-500">Initial Market Cap</div>
                <div className="font-semibold">
                  {formatCurrency(valuation.initialMarketCapRange.min)} - {formatCurrency(valuation.initialMarketCapRange.max)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Comparable Projects</h3>
            <div className="space-y-2">
              {valuation.comparables.map((comparable, index) => (
                <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                  <div className="font-medium">{comparable.name}</div>
                  <div className="text-sm text-zinc-500">
                    FDV: {formatCurrency(comparable.fdv)} | 
                    MCap: {formatCurrency(comparable.mcap)} | 
                    Performance: {comparable.performance}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Risk Analysis</h3>
            <div className="space-y-2">
              {valuation.risks.map((risk, index) => (
                <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="font-medium">{risk.message}</div>
                  <div className="text-sm text-zinc-500 mt-1">
                    Suggestion: {risk.suggestion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
