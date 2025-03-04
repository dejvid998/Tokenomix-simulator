
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from '@/types/questionnaire';

interface QuestionItemProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export const QuestionItem = ({ question, value, onChange }: QuestionItemProps) => {
  return (
    <div>
      <Label className="text-base">{question.question}</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="mt-2"
      >
        {question.options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.toLowerCase()} 
              id={`${question.id}-${option}`}
            />
            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
