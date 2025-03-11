
import { Card } from "@/components/ui/card";
import { ValuationForm } from "./ValuationForm";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import type { ValuationOutput } from "@/types/valuation";
import type { QuestionnaireData } from "@/types/questionnaire";
import { ValuationResults } from "./valuation/ValuationResults";
import { QuestionItem } from "./QuestionItem";
import { questions } from "@/types/questionnaire";

export const ValuationSection = () => {
  const [valuation, setValuation] = useState<ValuationOutput | null>(null);
  const [answers, setAnswers] = useState<QuestionnaireData>({
    launchingToken: '',
    projectGoal: '',
    fundraisingMethod: '',
    vcConnections: '',
    capitalNeeded: '',
    launchpadListing: '',
    dexLiquidity: '',
    stakingRewards: '',
    legalSupport: '',
    aiOptimization: ''
  });

  const handleAnswerChange = (question: keyof QuestionnaireData, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

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
                <h3 className="text-lg font-semibold">Token Launch Questionnaire</h3>
                <p className="text-sm text-muted-foreground">
                  Help us understand your project better to provide more accurate valuation estimates
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {questions.map((q) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  value={answers[q.id]}
                  onChange={(value) => handleAnswerChange(q.id, value)}
                />
              ))}
            </div>
          </div>
        </Card>

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
            
            <ValuationForm onValuationGenerated={setValuation} />
            
            {valuation && <ValuationResults valuation={valuation} />}
          </div>
        </Card>
      </div>
    </div>
  );
};
