
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
    // Capture charts as images
    const distributionChart = await captureChartAsImage('token-distribution-chart');
    const unlockChart = await captureChartAsImage('token-unlock-chart');

    // Create new presentation
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'Tokenomics Platform';
    pptx.company = data.projectName;
    pptx.title = `${data.projectName} - Token Economics`;
    pptx.subject = 'Investor Presentation';

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

    titleSlide.addText('Investor Presentation', {
      x: 0.5,
      y: 3.8,
      w: 9,
      h: 0.6,
      fontSize: 18,
      align: 'center',
      color: '64748B'
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

    if (distributionChart) {
      distributionSlide.addImage({
        data: distributionChart.split(',')[1],
        x: 1,
        y: 1.2,
        w: 8,
        h: 4.5
      });
    }

    // Add allocation details
    let yPos = 6;
    distributionSlide.addText('Allocation Breakdown:', {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: '374151'
    });

    data.tokenomicsData.allocations.forEach((allocation, index) => {
      yPos += 0.4;
      distributionSlide.addText(`• ${allocation.category}: ${allocation.percentage}%`, {
        x: 0.8,
        y: yPos,
        w: 8,
        h: 0.3,
        fontSize: 14,
        color: '4B5563'
      });
    });

    // Slide 3: Vesting Schedule
    const vestingSlide = pptx.addSlide();
    vestingSlide.background = { fill: 'FFFFFF' };
    
    vestingSlide.addText('Token Unlock Schedule', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: '1E293B'
    });

    if (unlockChart) {
      vestingSlide.addImage({
        data: unlockChart.split(',')[1],
        x: 0.5,
        y: 1.2,
        w: 9,
        h: 4.5
      });
    }

    // Add vesting details
    yPos = 6;
    vestingSlide.addText('Vesting Details:', {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: '374151'
    });

    data.tokenomicsData.allocations.forEach((allocation, index) => {
      if (allocation.vesting.cliff > 0 || allocation.vesting.duration > 0) {
        yPos += 0.4;
        vestingSlide.addText(
          `• ${allocation.category}: ${allocation.vesting.cliff}m cliff, ${allocation.vesting.duration}m vesting (${allocation.vesting.type})`,
          {
            x: 0.8,
            y: yPos,
            w: 8.5,
            h: 0.3,
            fontSize: 12,
            color: '4B5563'
          }
        );
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

    const totalAllocation = data.tokenomicsData.allocations.reduce((sum, a) => sum + a.percentage, 0);
    const teamAllocation = data.tokenomicsData.allocations
      .filter(a => a.category.toLowerCase().includes('team'))
      .reduce((sum, a) => sum + a.percentage, 0);
    
    const metrics = [
      { label: 'Total Supply', value: data.tokenomicsData.totalSupply.toLocaleString() + ' tokens' },
      { label: 'Total Allocation', value: totalAllocation + '%' },
      { label: 'Team Allocation', value: teamAllocation + '%' },
      { label: 'Market Condition', value: data.tokenomicsData.marketCondition },
      { label: 'Number of Allocations', value: data.tokenomicsData.allocations.length.toString() }
    ];

    yPos = 1.5;
    metrics.forEach((metric, index) => {
      metricsSlide.addText(metric.label + ':', {
        x: 1,
        y: yPos,
        w: 4,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: '374151'
      });
      
      metricsSlide.addText(metric.value, {
        x: 5,
        y: yPos,
        w: 4,
        h: 0.5,
        fontSize: 18,
        color: '6366F1'
      });
      
      yPos += 0.7;
    });

    // Generate and download
    const fileName = `${data.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Tokenomics_Deck.pptx`;
    await pptx.writeFile({ fileName });
    
  } catch (error) {
    console.error('Error generating deck:', error);
    throw new Error('Failed to generate investor deck');
  }
};
