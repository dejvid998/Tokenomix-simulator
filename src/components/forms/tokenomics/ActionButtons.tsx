
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Save } from 'lucide-react';

interface Props {
  onSave: () => void;
  onExport: () => void;
}

export const ActionButtons: React.FC<Props> = ({ onSave, onExport }) => {
  return (
    <div className="flex gap-4">
      <Button className="flex-1" onClick={onSave}>
        <Save className="mr-2" />
        Save Configuration
      </Button>
      <Button 
        variant="outline"
        onClick={onExport}
        className="flex-1"
      >
        <Download className="mr-2" />
        Export XLSX
      </Button>
    </div>
  );
};
