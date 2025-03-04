
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

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

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base">Are you launching a token for your project?</Label>
          <RadioGroup
            value={answers.launchingToken}
            onValueChange={(value) => handleAnswerChange('launchingToken', value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="launchingToken-yes" />
              <Label htmlFor="launchingToken-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="launchingToken-no" />
              <Label htmlFor="launchingToken-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base">What is your project's primary goal?</Label>
          <RadioGroup
            value={answers.projectGoal}
            onValueChange={(value) => handleAnswerChange('projectGoal', value)}
            className="mt-2"
          >
            {['DeFi', 'DAO', 'GameFi', 'NFT', 'Infrastructure'].map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <RadioGroupItem value={goal.toLowerCase()} id={`goal-${goal}`} />
                <Label htmlFor={`goal-${goal}`}>{goal}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base">Which fundraising method are you considering?</Label>
          <RadioGroup
            value={answers.fundraisingMethod}
            onValueChange={(value) => handleAnswerChange('fundraisingMethod', value)}
            className="mt-2"
          >
            {['IDO', 'Private Sale', 'Launchpad', 'Fair Launch'].map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <RadioGroupItem value={method.toLowerCase()} id={`method-${method}`} />
                <Label htmlFor={`method-${method}`}>{method}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* ... More questions following the same pattern */}
      </div>
    </Card>
  );
};
