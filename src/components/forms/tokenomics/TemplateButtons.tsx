
import type { TokenomicsData } from '@/types/tokenomics';

interface Props {
  onTemplateSelect: (data: TokenomicsData) => void;
}

export const TemplateButtons = ({ onTemplateSelect }: Props) => {
  return (
    <div className="space-y-4">
      {/* Removed the "Tokenomics Configuration" heading as requested */}
    </div>
  );
};
