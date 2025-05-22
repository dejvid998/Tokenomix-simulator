
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Send } from 'lucide-react';
import { toast } from "sonner";
import { QuestionItem } from './QuestionItem';
// Removed EmailPreview import
import { exportToDocx } from '@/utils/documentExport';
import type { QuestionnaireData } from '@/types/questionnaire';
import { questions } from '@/types/questionnaire';
// Removed Input, Checkbox, Label imports as they are no longer directly used here

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
  // Removed userEmail, emailjsKey, and copyMe states
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (question: keyof QuestionnaireData, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleExportDOCX = async () => {
    try {
      // Validate that all questions are answered before exporting
      const unansweredQuestions = Object.entries(answers).filter(([_, value]) => !value);
      if (unansweredQuestions.length > 0) {
        toast.error("Please answer all questions before exporting.");
        return;
      }
      await exportToDocx(questions, answers);
      toast.success("DOCX exported successfully!");
    } catch (error) {
      toast.error("Failed to export DOCX");
    }
  };

  const handleSubmit = async () => {
    // Validate that all questions are answered
    const unansweredQuestions = Object.entries(answers).filter(([_, value]) => !value);
    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    
    // Simulating a submission process as email sending is removed
    // In a real scenario, this might save to local storage or a backend if one exists
    // For now, it just confirms answers are complete.
    try {
      // Simulate a short delay for "processing"
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Answers validated. You can now export your document.");
      
    } catch (error) {
      // This catch block might not be strictly necessary anymore without network calls
      // but kept for consistency if any other async operations were added.
      console.error('Error during submission:', error);
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
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
      
      {/* Removed the entire border-t div containing email, emailjs key, copy me checkbox, and email preview */}
      
      <div className="flex gap-2 pt-4 border-t mt-6"> {/* Added border-t here and mt-6 for spacing */}
        <Button 
          variant="outline"
          onClick={handleExportDOCX}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" /> {/* Ensured icon size consistency */}
          Export DOCX
        </Button>
        
        <Button 
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
          disabled={isSubmitting}
        >
          <Send className="mr-2 h-4 w-4" /> {/* Ensured icon size consistency */}
          {isSubmitting ? 'Processing...' : 'Submit Answers'}
        </Button>
      </div>
    </Card>
  );
};

