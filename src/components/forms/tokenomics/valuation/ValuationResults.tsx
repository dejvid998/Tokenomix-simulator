
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, TrendingUp, List } from "lucide-react";
import type { ValuationOutput } from "@/types/valuation";

interface ValuationResultsProps {
  valuation: ValuationOutput;
}

export const ValuationResults = ({ valuation }: ValuationResultsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estimated Valuation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">FDV Range</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(valuation.fdvRange.min)} - {formatCurrency(valuation.fdvRange.max)}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Initial Market Cap</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(valuation.initialMarketCapRange.min)} - {formatCurrency(valuation.initialMarketCapRange.max)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Comparable Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {valuation.comparables.map((project, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      FDV: {formatCurrency(project.fdv)} | MCAP: {formatCurrency(project.mcap)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${project.performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {project.performance >= 0 ? '+' : ''}{project.performance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {valuation.risks.map((risk, index) => (
          <Alert key={index} variant={risk.type === 'error' ? 'destructive' : 'default'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-1">
              <span className="font-medium">{risk.message}</span>
              <span className="text-sm">{risk.suggestion}</span>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};
