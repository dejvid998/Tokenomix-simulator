
import { Button } from "@/components/ui/button";
import { ProjectDetailsFields } from "./valuation/ProjectDetailsFields";
import { MarketDetailsFields } from "./valuation/MarketDetailsFields";
import { useValuationForm } from "@/hooks/useValuationForm";
import type { ValuationOutput } from "@/types/valuation";

interface ValuationFormProps {
  onValuationGenerated: (valuation: ValuationOutput) => void;
}

export const ValuationForm = ({ onValuationGenerated }: ValuationFormProps) => {
  const { formData, loading, handleFieldChange, handleSubmit } = useValuationForm(onValuationGenerated);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProjectDetailsFields 
          formData={formData}
          onFieldChange={handleFieldChange}
        />
        <MarketDetailsFields 
          formData={formData}
          onFieldChange={handleFieldChange}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" 
        disabled={loading}
      >
        {loading ? "Calculating..." : "Generate Valuation Estimate"}
      </Button>
    </form>
  );
};
