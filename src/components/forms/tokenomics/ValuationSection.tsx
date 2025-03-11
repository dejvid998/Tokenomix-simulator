
import { Card } from "@/components/ui/card";
import { ValuationForm } from "./ValuationForm";
import { Button } from "@/components/ui/button";
import { BarChart, Download } from "lucide-react";
import { useState } from "react";
import type { ValuationOutput } from "@/types/valuation";

export const ValuationSection = () => {
  const [valuation, setValuation] = useState<ValuationOutput | null>(null);

  const handleDownloadReport = () => {
    // TODO: Implement report download functionality
    console.log("Downloading report...");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Token Valuation Estimate</h3>
                <p className="text-sm text-muted-foreground">
                  Input your token details to receive an AI-powered valuation estimate
                </p>
              </div>
              {valuation && (
                <Button variant="outline" onClick={handleDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              )}
            </div>
            
            <ValuationForm 
              onValuationGenerated={setValuation}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
