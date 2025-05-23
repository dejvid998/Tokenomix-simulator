
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, FileSpreadsheet } from 'lucide-react';
import { ExportDeckButton } from './ExportDeckButton';
import type { TokenomicsData } from '@/types/tokenomics';

interface ActionButtonsProps {
  onSave: () => void;
  onExport: () => void;
  tokenomicsData?: TokenomicsData;
  projectName?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSave, 
  onExport, 
  tokenomicsData,
  projectName 
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onSave}
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
        
        <Button
          variant="outline"
          onClick={onExport}
          className="w-full"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export XLSX
        </Button>
      </div>
      
      {tokenomicsData && (
        <ExportDeckButton 
          tokenomicsData={tokenomicsData}
          projectName={projectName}
        />
      )}
    </div>
  );
};
