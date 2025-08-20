
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { ValuationService } from '@/services/valuationService';
import type { ValuationInput, ValuationOutput } from '@/types/valuation';

export const useValuationForm = (onValuationGenerated: (valuation: ValuationOutput) => void) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ValuationInput>(() => {
    try {
      const saved = localStorage.getItem('valuation-form');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          fundraisingAmount: 0,
          tokenPrice: 0,
          fundraisingMethod: 'IDO',
          totalSupply: 0,
          tgeCirculatingSupply: 0,
          dexLiquidity: 0,
          lockupDuration: 0,
          projectCategory: 'DeFi',
          marketCondition: 'Neutral',
          initialStaking: 0,
          teamTokens: 0,
          marketingBudget: 0,
          ...parsed,
          fundingRounds: parsed.fundingRounds || [],
        } as ValuationInput;
      }
    } catch {}
    return {
      fundraisingAmount: 0,
      tokenPrice: 0,
      fundraisingMethod: 'IDO',
      totalSupply: 0,
      tgeCirculatingSupply: 0,
      dexLiquidity: 0,
      lockupDuration: 0,
      projectCategory: 'DeFi',
      marketCondition: 'Neutral',
      initialStaking: 0,
      teamTokens: 0,
      marketingBudget: 0,
      fundingRounds: [],
    };
  });

  const handleFieldChange = (field: keyof ValuationInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    try {
      localStorage.setItem('valuation-form', JSON.stringify(formData));
    } catch {}
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await ValuationService.generateValuation(formData);
      onValuationGenerated(result);
      toast.success("Valuation estimate generated!");
    } catch (error) {
      toast.error("Failed to generate valuation");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleFieldChange,
    handleSubmit
  };
};
