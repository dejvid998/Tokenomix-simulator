
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TokenomicsData } from '@/types/tokenomics';
import { TEMPLATES } from './tokenomics-templates';
import { Separator } from "@/components/ui/separator";

interface Props {
  onTemplateSelect: (data: TokenomicsData) => void;
}

export const TemplateButtons = ({ onTemplateSelect }: Props) => {
  const handleTemplateSelect = (templateKey: string) => {
    try {
      const template = TEMPLATES[templateKey];
      if (template) {
        onTemplateSelect(template);
        toast.success(`${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} template applied`);
      }
    } catch (error) {
      toast.error("Failed to load template");
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
        Tokenomics Templates
      </h4>
      <div className="flex gap-4 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTemplateSelect('dao')}
        >
          DAO Structure
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTemplateSelect('defi')}
        >
          DeFi Protocol
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTemplateSelect('makerdao')}
        >
          MakerDAO Original
        </Button>
      </div>
      <Separator className="my-2" />
    </div>
  );
};
