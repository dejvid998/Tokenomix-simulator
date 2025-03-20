
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Send } from 'lucide-react';
import { toast } from "sonner";
import { QuestionItem } from './QuestionItem';
import { EmailPreview } from './EmailPreview';
import { exportToDocx } from '@/utils/documentExport';
import type { QuestionnaireData } from '@/types/questionnaire';
import { questions } from '@/types/questionnaire';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const [userEmail, setUserEmail] = useState('');
  const [emailjsKey, setEmailjsKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyMe, setCopyMe] = useState(false);

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

  const handleSubmit = async () => {
    if (!emailjsKey) {
      toast.error("Please enter your EmailJS API key");
      return;
    }

    // Validate that all questions are answered
    const unansweredQuestions = Object.entries(answers).filter(([_, value]) => !value);
    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Replace the placeholder in the service with the provided key
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      document.body.appendChild(scriptElement);
      
      scriptElement.onload = async () => {
        // @ts-ignore - emailjs is loaded from CDN
        window.emailjs.init(emailjsKey);
        
        // Prepare template parameters
        const templateParams = {
          to_email: 'dejvid814@gmail.com',
          from_email: copyMe && userEmail ? userEmail : 'noreply@unlockfi.com',
          subject: 'New Web3 Launch Questionnaire Submission',
          message: JSON.stringify(answers, null, 2),
          user_email: userEmail || 'Not provided'
        };
        
        // @ts-ignore - emailjs is loaded from CDN
        await window.emailjs.send('default_service', 'template_default', templateParams);
        
        toast.success("Answers submitted successfully!");
        
        if (copyMe && userEmail) {
          toast.info("A copy has been sent to your email");
        }
        
        setIsSubmitting(false);
      };
      
      scriptElement.onerror = () => {
        toast.error("Failed to load EmailJS. Please try again.");
        setIsSubmitting(false);
      };
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Failed to send answers");
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
      
      <div className="border-t pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-email">Your Email (optional)</Label>
          <Input 
            id="user-email"
            type="email" 
            placeholder="your@email.com" 
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emailjs-key">
            EmailJS API Key (required to send emails)
          </Label>
          <Input 
            id="emailjs-key"
            type="text" 
            placeholder="Your EmailJS public key" 
            value={emailjsKey}
            onChange={(e) => setEmailjsKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Create a free account at emailjs.com, set up a service and template, and enter your public key here.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="copy-me" 
            checked={copyMe}
            onCheckedChange={(checked) => setCopyMe(checked as boolean)}
            disabled={!userEmail}
          />
          <Label htmlFor="copy-me" className="text-sm cursor-pointer">
            Send me a copy of my answers
          </Label>
        </div>
        
        <div className="flex justify-end">
          <EmailPreview answers={answers} userEmail={userEmail} />
        </div>
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
        
        <Button 
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
          disabled={isSubmitting}
        >
          <Send className="mr-2" />
          {isSubmitting ? 'Sending...' : 'Submit Answers'}
        </Button>
      </div>
    </Card>
  );
};
