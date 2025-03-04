
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TokenomicsData } from '@/types/tokenomics';
import { TEMPLATES } from './tokenomics-templates';

interface Props {
  onTemplateSelect: (data: TokenomicsData) => void;
}

export const TemplateButtons = ({ onTemplateSelect }: Props) => {
  const handleTemplateSelect = (templateKey: "dao" | "defi") => {
    const selectedTemplate = { ...TEMPLATES[templateKey] };
    onTemplateSelect(selectedTemplate);
    toast.success("Template applied successfully!");
  };

  return (
    <div className="flex gap-4">
      <Button 
        variant="outline" 
        onClick={() => handleTemplateSelect("dao")}
        className="flex-1"
      >
        Load DAO Template
      </Button>
      <Button 
        variant="outline" 
        onClick={() => handleTemplateSelect("defi")}
        className="flex-1"
      >
        Load DeFi Template
      </Button>
    </div>
  );
};
