import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Download } from 'lucide-react';
import { toast } from "sonner";
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface QuestionnaireData {
  launchingToken: string;
  projectGoal: string;
  fundraisingMethod: string;
  vcConnections: string;
  capitalNeeded: string;
  launchpadListing: string;
  dexLiquidity: string;
  stakingRewards: string;
  legalSupport: string;
  aiOptimization: string;
}

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

  const questions = [
    {
      id: 'launchingToken',
      question: 'Are you launching a token for your project?',
      options: ['Yes', 'No']
    },
    {
      id: 'projectGoal',
      question: 'What is your project\'s primary goal?',
      options: ['DeFi', 'DAO', 'GameFi', 'NFT', 'Infrastructure']
    },
    {
      id: 'fundraisingMethod',
      question: 'Which fundraising method are you considering?',
      options: ['IDO', 'Private Sale', 'Launchpad', 'Fair Launch']
    },
    {
      id: 'vcConnections',
      question: 'Do you have connections with VCs or launchpads?',
      options: ['Yes', 'No', 'Need Help']
    },
    {
      id: 'capitalNeeded',
      question: 'How much capital do you need to raise?',
      options: ['<$100K', '$100K-$500K', '$500K-$1M+']
    },
    {
      id: 'launchpadListing',
      question: 'Are you looking for a launchpad listing?',
      options: ['Yes', 'No']
    },
    {
      id: 'dexLiquidity',
      question: 'Do you plan to provide liquidity on a DEX?',
      options: ['Yes', 'No', 'Not Sure']
    },
    {
      id: 'stakingRewards',
      question: 'Do you want staking and rewards for your token?',
      options: ['Yes', 'No']
    },
    {
      id: 'legalSupport',
      question: 'Do you need legal & compliance support?',
      options: ['Yes', 'No', 'Need Guidance']
    },
    {
      id: 'aiOptimization',
      question: 'Would you like to integrate UnlockFi\'s AI-based tokenomics optimization?',
      options: ['Yes', 'No']
    }
  ];

  const handleExportDOCX = () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Tokenomics Questionnaire Responses",
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({
              text: "",
            }),
            ...questions.map((q) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: q.question,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: answers[q.id as keyof QuestionnaireData] || 'Not answered',
                  }),
                ],
              }),
              new Paragraph({ text: "" }), // Spacing between QA pairs
            ]).flat(),
          ],
        }],
      });

      Packer.toBlob(doc).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tokenomics-questionnaire.docx";
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("DOCX exported successfully!");
      });
    } catch (error) {
      toast.error("Failed to export DOCX");
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id}>
            <Label className="text-base">{q.question}</Label>
            <RadioGroup
              value={answers[q.id as keyof QuestionnaireData]}
              onValueChange={(value) => handleAnswerChange(q.id as keyof QuestionnaireData, value)}
              className="mt-2"
            >
              {q.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.toLowerCase()} 
                    id={`${q.id}-${option}`}
                  />
                  <Label htmlFor={`${q.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
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
