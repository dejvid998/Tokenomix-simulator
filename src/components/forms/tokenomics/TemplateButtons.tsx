import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TokenomicsData } from '@/types/tokenomics';

interface Props {
  onTemplateSelect: (data: TokenomicsData) => void;
}

export const TemplateButtons = ({ onTemplateSelect }: Props) => {
  return (
    <div className="flex gap-4">
      {/* Template buttons removed */}
    </div>
  );
};
