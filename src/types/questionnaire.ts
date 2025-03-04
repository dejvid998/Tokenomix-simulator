
export interface QuestionnaireData {
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

export interface Question {
  id: keyof QuestionnaireData;
  question: string;
  options: string[];
}

export const questions: Question[] = [
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
