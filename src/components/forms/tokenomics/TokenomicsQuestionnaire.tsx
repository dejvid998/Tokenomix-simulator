
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from 'lucide-react';
import { toast } from "sonner";
import { QuestionItem } from './QuestionItem';
import { exportToDocx } from '@/utils/documentExport';
import type { QuestionnaireData } from '@/types/questionnaire';
import { questions } from '@/types/questionnaire';

export const TokenomicsQuestionnaire = () => {
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

  const handleExportDOCX = async () => {
    try {
      await exportToDocx(questions, answers);
      toast.success("DOCX exported successfully!");
    } catch (error) {
      toast.error("Failed to export DOCX");
    }
  };

  return (
    <Card className="p-6 space-y-6">
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
      
      <div className="flex gap-2 pt-4">
        <Button 
          variant="outline"
          onClick={handleExportDOCX}
          className="w-full"
        >
          <Download className="mr-2" />
          Export DOCX
        </Button>
      </div>
    </Card>
  );
};
