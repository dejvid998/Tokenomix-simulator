
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Download } from 'lucide-react';
import { toast } from "sonner";
import { generateInvestorDeck } from '@/utils/deckExport';
import { logger } from '@/lib/logger';
import type { TokenomicsData } from '@/types/tokenomics';

interface ExportDeckButtonProps {
  tokenomicsData: TokenomicsData;
  projectName?: string;
}

export const ExportDeckButton: React.FC<ExportDeckButtonProps> = ({ 
  tokenomicsData, 
  projectName = "Token Project" 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportDeck = async () => {
    try {
      setIsExporting(true);
      toast.info("Generating investor deck...");

      // Validate that charts are present
      const distributionChart = document.getElementById('token-distribution-chart');
      const unlockChart = document.getElementById('token-unlock-chart');
      
      if (!distributionChart || !unlockChart) {
        toast.error("Charts not found. Please ensure both charts are visible before exporting.");
        return;
      }

      // Validate data completeness
      const totalPercentage = tokenomicsData.allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
      if (totalPercentage !== 100) {
        toast.error("Total allocation must equal 100% before exporting deck.");
        return;
      }

      if (tokenomicsData.totalSupply <= 0) {
        toast.error("Please set a valid total supply before exporting deck.");
        return;
      }

      // Generate the deck
      await generateInvestorDeck({
        projectName,
        tokenomicsData,
        additionalInfo: {
          launchDate: new Date().toLocaleDateString(),
          description: "Professional tokenomics overview for investors"
        }
      });

      toast.success("Investor deck downloaded successfully!");
      
    } catch (error) {
      logger.error("Export deck error:", error);
      toast.error("Failed to generate investor deck. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExportDeck}
      disabled={isExporting}
      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
    >
      {isExporting ? (
        <>
          <Download className="mr-2 h-4 w-4 animate-spin" />
          Generating Deck...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Export Investor Deck
        </>
      )}
    </Button>
  );
};
