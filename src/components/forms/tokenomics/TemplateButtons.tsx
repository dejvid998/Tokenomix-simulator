
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChartPie } from 'lucide-react';
import { toast } from "sonner";
import type { TokenomicsData } from '@/types/tokenomics';
import { TEMPLATES } from '@/components/forms/tokenomics/tokenomics-templates';

interface Props {
  onTemplateSelect: (data: TokenomicsData) => void;
}

export const TemplateButtons: React.FC<Props> = ({ onTemplateSelect }) => {
  const handleTemplateSelect = (templateKey: string) => {
    if (TEMPLATES[templateKey]) {
      onTemplateSelect(TEMPLATES[templateKey]);
      toast.success(`${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} template loaded! Customize your allocations.`);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h4 className="font-medium text-lg">Tokenomics Configuration</h4>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <ChartPie className="h-4 w-4" />
            <span>Load Template</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Select a Template</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleTemplateSelect('dao')}>
            MakerDAO
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleTemplateSelect('defi')}>
            Raydium (DeFi)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleTemplateSelect('makerdao')}>
            Custom Template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
