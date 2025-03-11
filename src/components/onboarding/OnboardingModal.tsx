
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { QuestionItem } from '../forms/tokenomics/QuestionItem';
import { questions } from '@/types/questionnaire';
import type { QuestionnaireData } from '@/types/questionnaire';

export const OnboardingModal = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
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

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);

  const handleAnswerChange = (question: keyof QuestionnaireData, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    toast.success("Onboarding completed!");
    setOpen(false);
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="space-y-6">
          <div className="relative h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <Card className="p-6">
            {currentQuestion && (
              <QuestionItem
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              />
            )}
          </Card>

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion?.id]}
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              {currentStep === questions.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
