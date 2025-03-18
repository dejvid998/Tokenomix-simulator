
import type { TokenomicsData } from '@/types/tokenomics';

interface Props {
  onTemplateSelect: (data: TokenomicsData) => void;
}

export const TemplateButtons = ({ onTemplateSelect }: Props) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
        Tokenomics Configuration
      </h4>
    </div>
  );
};
