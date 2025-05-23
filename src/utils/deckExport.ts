
import PptxGenJS from 'pptxgenjs';
import { captureChartAsImage } from './chartExport';
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
    console.log('Starting deck generation with data:', data);
    
    // Wait for charts to be fully rendered
    console.log('Waiting for charts to render...');
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
    
    console.log('Chart elements found, proceeding with capture...');
    
    // Capture charts with better error handling
    const [distributionChart, unlockChart] = await Promise.all([
      captureChartAsImage('token-distribution-chart'),
      captureChartAsImage('token-unlock-chart')
    ]);

    console.log('Chart capture completed:', {
      distributionChart: distributionChart ? `${distributionChart.length} chars` : 'null',
      unlockChart: unlockChart ? `${unlockChart.length} chars` : 'null'
    });

    if (!distributionChart) {
      throw new Error('Failed to capture distribution chart. Please ensure the chart is fully loaded and visible.');
    }
    
    if (!unlockChart) {
      throw new Error('Failed to capture unlock chart. Please ensure the chart is fully loaded and visible.');
    }

    console.log('Creating PowerPoint presentation...');
    
    // Create new presentation
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'Tokenomics Platform';
    pptx.company = data.projectName;
    pptx.title = `${data.projectName} - Token Economics`;
    pptx.subject = 'Investor Presentation';

    console.log('Adding slides to presentation...');

    // Slide 1: Title Slide
    const titleSlide = pptx.addSlide();
    titleSlide.background = { fill: 'F8FAFC' };
    
    titleSlide.addText(data.projectName, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1.2,
      fontSize: 36,
      bold: true,
      align: 'center',
      color: '1E293B'
    });
    
    titleSlide.addText('Token Economics Overview', {
      x: 0.5,
      y: 2.8,
      w: 9,
      h: 0.8,
      fontSize: 24,
      align: 'center',
      color: '475569'
    });

    titleSlide.addText(`Generated on ${new Date().toLocaleDateString()}`, {
      x: 0.5,
      y: 5.5,
      w: 9,
      h: 0.4,
      fontSize: 12,
      align: 'center',
      color: '94A3B8',
      italic: true
    });

    // Slide 2: Token Distribution
    const distributionSlide = pptx.addSlide();
    distributionSlide.background = { fill: 'FFFFFF' };
    
    distributionSlide.addText('Token Distribution', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: '1E293B'
    });

    console.log('Adding distribution chart to slide...');
    
    // Add distribution chart - use the data URL directly
    distributionSlide.addImage({
      data: distributionChart.replace(/^data:image\/[a-z]+;base64,/, ''),
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 4.5,
      sizing: {
        type: 'contain',
        w: 9,
        h: 4.5
      }
    });

    // Add allocation breakdown
    let yPos = 5.8;
    data.tokenomicsData.allocations.forEach((allocation) => {
      const tokenAmount = ((allocation.percentage / 100) * data.tokenomicsData.totalSupply).toLocaleString();
      distributionSlide.addText(`${allocation.category}: ${allocation.percentage}% (${tokenAmount} tokens)`, {
        x: 0.8,
        y: yPos,
        w: 8,
        h: 0.3,
        fontSize: 12,
        color: '4B5563'
      });
      yPos += 0.3;
    });

    // Slide 3: Token Unlock Schedule
    const unlockSlide = pptx.addSlide();
    unlockSlide.background = { fill: 'FFFFFF' };
    
    unlockSlide.addText('Token Unlock Schedule', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: '1E293B'
    });

    console.log('Adding unlock chart to slide...');
    
    // Add unlock chart
    unlockSlide.addImage({
      data: unlockChart.replace(/^data:image\/[a-z]+;base64,/, ''),
      x: 0.3,
      y: 1.2,
      w: 9.4,
      h: 4.5,
      sizing: {
        type: 'contain',
        w: 9.4,
        h: 4.5
      }
    });

    // Slide 4: Key Metrics
    const metricsSlide = pptx.addSlide();
    metricsSlide.background = { fill: 'FFFFFF' };
    
    metricsSlide.addText('Key Token Metrics', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: '1E293B'
    });

    // Calculate metrics
    const totalAllocation = data.tokenomicsData.allocations.reduce((sum, a) => sum + a.percentage, 0);
    const averageCliff = data.tokenomicsData.allocations.length > 0 
      ? data.tokenomicsData.allocations.reduce((sum, a) => sum + a.vesting.cliff, 0) / data.tokenomicsData.allocations.length
      : 0;

    const averageVesting = data.tokenomicsData.allocations.length > 0 
      ? data.tokenomicsData.allocations.reduce((sum, a) => sum + a.vesting.duration, 0) / data.tokenomicsData.allocations.length
      : 0;

    // Create metrics table
    const metricsData = [
      ['Metric', 'Value'],
      ['Total Supply', `${data.tokenomicsData.totalSupply.toLocaleString()} tokens`],
      ['Total Allocation', `${totalAllocation}%`],
      ['Market Condition', data.tokenomicsData.marketCondition],
      ['Average Cliff Period', `${averageCliff.toFixed(1)} months`],
      ['Average Vesting Period', `${averageVesting.toFixed(1)} months`],
      ['Number of Allocations', data.tokenomicsData.allocations.length.toString()]
    ];

    metricsSlide.addTable(metricsData, {
      x: 1.5,
      y: 1.5,
      w: 7,
      colW: [3.5, 3.5],
      rowH: 0.4,
      border: { pt: 1, color: 'E5E7EB' },
      fill: { color: 'F9FAFB' },
      fontSize: 12,
      color: '374151'
    });

    console.log('Generating and downloading presentation...');

    // Generate and download
    const fileName = `${data.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Tokenomics_Deck.pptx`;
    await pptx.writeFile({ fileName });
    
    console.log('Deck generated successfully!');
    
  } catch (error) {
    console.error('Error generating deck:', error);
    throw new Error(`Failed to generate investor deck: ${error.message}`);
  }
};
