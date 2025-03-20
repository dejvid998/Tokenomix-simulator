
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import type { QuestionnaireData } from '@/types/questionnaire';
import { questions } from '@/types/questionnaire';

interface EmailPreviewProps {
  answers: QuestionnaireData;
  userEmail: string;
}

export const EmailPreview = ({ answers, userEmail }: EmailPreviewProps) => {
  // Find the corresponding question text for each answer
  const getQuestionText = (id: string) => {
    const question = questions.find(q => q.id === id);
    return question ? question.question : id;
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>Preview Email</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
        </DialogHeader>
        <div className="border rounded-md p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-1 border-b pb-2">
            <p><strong>To:</strong> dejvid814@gmail.com</p>
            <p><strong>From:</strong> {userEmail || 'noreply@unlockfi.com'}</p>
            <p><strong>Subject:</strong> New Web3 Launch Questionnaire Submission</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold">New Questionnaire Submission</h2>
            
            <div className="space-y-2">
              {Object.entries(answers).map(([key, value]) => value && (
                <div key={key} className="border-b pb-2">
                  <p className="font-medium">{getQuestionText(key)}</p>
                  <p>{value}</p>
                </div>
              ))}
            </div>
            
            {userEmail && (
              <p><strong>Respondent email:</strong> {userEmail}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
