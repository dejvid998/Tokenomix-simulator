import { captureChartAsImage } from './chartExport';
import { logger } from '@/lib/logger';
// Worker via Comlink (dynamic import at call-site keeps it out of main bundle until needed)
import type { TokenomicsData } from '@/types/tokenomics';

export interface DeckExportData {
  projectName: string;
  tokenomicsData: TokenomicsData;
  additionalInfo?: {
    marketCap?: number;
    launchDate?: string;
    description?: string;
  };
}

export const generateInvestorDeck = async (data: DeckExportData): Promise<void> => {
  try {
    logger.log('Starting deck generation with data:', data);
    
    // Wait for charts to be fully rendered
    logger.log('Waiting for charts to render...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if chart elements exist and are visible
    const distributionElement = document.getElementById('token-distribution-chart');
    const unlockElement = document.getElementById('token-unlock-chart');
    
    if (!distributionElement) {
      throw new Error('Token distribution chart element not found. Make sure the chart is visible on the page.');
    }
    
    if (!unlockElement) {
      throw new Error('Token unlock chart element not found. Make sure the chart is visible on the page.');
    }
    
    logger.log('Chart elements found, proceeding with capture...');
    
    // Capture charts with better error handling
    const [distributionChart, unlockChart] = await Promise.all([
      captureChartAsImage('token-distribution-chart'),
      captureChartAsImage('token-unlock-chart')
    ]);

    logger.log('Chart capture completed:', {
      distributionChart: distributionChart ? `${distributionChart.length} chars` : 'null',
      unlockChart: unlockChart ? `${unlockChart.length} chars` : 'null'
    });

    if (!distributionChart) {
      throw new Error('Failed to capture distribution chart. Please ensure the chart is fully loaded and visible.');
    }
    
    if (!unlockChart) {
      throw new Error('Failed to capture unlock chart. Please ensure the chart is fully loaded and visible.');
    }

    logger.log('Creating PowerPoint presentation...');
    
    // Offload PPTX generation to a Web Worker
    const workerModule = await import('./deckWorker?worker');
    const { wrap } = await import('comlink');
    const worker: Worker = new workerModule.default();
    const api = wrap<any>(worker);
    
    // Set presentation properties
    pptx.author = 'Tokenomics Platform';
    pptx.company = data.projectName;
    pptx.title = `${data.projectName} - Token Economics`;
    pptx.subject = 'Investor Presentation';

    logger.log('Adding slides to presentation...');

    logger.log('Dispatching PPTX generation to worker...');
    const base64: string = await api.generatePptx({
      projectName: data.projectName,
      tokenomicsData: data.tokenomicsData,
      distributionChart,
      unlockChart,
    });
    worker.terminate && worker.terminate();
    // Download on main thread
    const fileName = `${data.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Tokenomics_Deck.pptx`;
    const blob = base64ToBlob(base64, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    logger.log('Deck generated successfully!', fileName);
    
  } catch (error) {
    logger.error('Error generating deck:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate investor deck: ${error.message}`);
    } else {
      throw new Error(`Failed to generate investor deck: An unknown error occurred`);
    }
  }
};

function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}
