
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, TrendingUp, List, Shield, Activity } from "lucide-react";
import type { ValuationOutput, RiskAnalysis } from "@/types/valuation";

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

  const groupRisksByCategory = (risks: RiskAnalysis[]) => {
    const categories = {
      token_allocation: { title: "Token Allocation", icon: Shield },
      supply_dynamics: { title: "Supply Dynamics", icon: Activity },
      market: { title: "Market Risks", icon: TrendingUp },
      stress_test: { title: "Stress Testing", icon: AlertTriangle }
    };

    return Object.entries(categories).map(([category, { title, icon: Icon }]) => ({
      title,
      Icon,
      risks: risks.filter(risk => risk.category === category)
    }));
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

      <Separator className="my-4" />

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

      <Separator className="my-4" />

      {groupRisksByCategory(valuation.risks).map((category, index) => (
        category.risks.length > 0 && (
          <React.Fragment key={category.title}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.Icon className="h-5 w-5" />
                  {category.title} Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.risks.map((risk, riskIndex) => (
                  <Alert key={riskIndex} variant={risk.type === 'error' ? 'destructive' : 'default'}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex flex-col gap-1">
                      <span className="font-medium">{risk.message}</span>
                      <span className="text-sm">{risk.suggestion}</span>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
            {index < groupRisksByCategory(valuation.risks).filter(c => c.risks.length > 0).length - 1 && (
              <Separator className="my-4" />
            )}
          </React.Fragment>
        )
      ))}
    </div>
  );
};
