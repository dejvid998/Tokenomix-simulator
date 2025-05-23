
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
    // Wait a moment for charts to render completely
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Capture charts as images with higher quality
    const distributionChart = await captureChartAsImage('token-distribution-chart');
    const unlockChart = await captureChartAsImage('token-unlock-chart');

    if (!distributionChart || !unlockChart) {
      throw new Error('Failed to capture charts. Please ensure both charts are visible.');
    }

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

    // Slide 2: Main Overview - High Quality Charts
    const overviewSlide = pptx.addSlide();
    overviewSlide.background = { fill: 'FFFFFF' };
    
    // Title matching the original
    overviewSlide.addText('Token Economics Overview', {
      x: 0.5,
      y: 0.2,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      align: 'center',
      color: '1E293B'
    });

    // Distribution chart (left side) - High resolution
    overviewSlide.addImage({
      data: distributionChart,
      x: 0.3,
      y: 1.0,
      w: 4.8,
      h: 4.2,
      sizing: {
        type: 'contain',
        w: 4.8,
        h: 4.2
      }
    });

    // Unlock chart (right side) - High resolution
    overviewSlide.addImage({
      data: unlockChart,
      x: 5.4,
      y: 1.0,
      w: 4.3,
      h: 4.2,
      sizing: {
        type: 'contain',
        w: 4.3,
        h: 4.2
      }
    });

    // Chart labels below charts
    overviewSlide.addText('Token Distribution', {
      x: 0.3,
      y: 5.3,
      w: 4.8,
      h: 0.4,
      fontSize: 16,
      bold: true,
      align: 'center',
      color: '1E293B'
    });

    overviewSlide.addText('Unlock Schedule', {
      x: 5.4,
      y: 5.3,
      w: 4.3,
      h: 0.4,
      fontSize: 16,
      bold: true,
      align: 'center',
      color: '1E293B'
    });

    // Add key metrics summary at bottom
    const totalSupplyFormatted = data.tokenomicsData.totalSupply.toLocaleString();
    overviewSlide.addText(`Total Supply: ${totalSupplyFormatted} tokens`, {
      x: 0.5,
      y: 6.0,
      w: 9,
      h: 0.3,
      fontSize: 14,
      align: 'center',
      color: '475569'
    });

    // Slide 3: Detailed Token Distribution
    const distributionSlide = pptx.addSlide();
    distributionSlide.background = { fill: 'FFFFFF' };
    
    distributionSlide.addText('Token Distribution Breakdown', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: '1E293B'
    });

    // Large distribution chart - Full page, high quality
    distributionSlide.addImage({
      data: distributionChart,
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 3.5,
      sizing: {
        type: 'contain',
        w: 9,
        h: 3.5
      }
    });

    // Detailed allocation breakdown
    let yPos = 5.2;
    distributionSlide.addText('Allocation Details:', {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: '374151'
    });

    data.tokenomicsData.allocations.forEach((allocation, index) => {
      yPos += 0.4;
      const tokenAmount = ((allocation.percentage / 100) * data.tokenomicsData.totalSupply).toLocaleString();
      distributionSlide.addText(`• ${allocation.category}: ${allocation.percentage}% (${tokenAmount} tokens)`, {
        x: 0.8,
        y: yPos,
        w: 8,
        h: 0.3,
        fontSize: 14,
        color: '4B5563'
      });
    });

    // Slide 4: Vesting Schedule Details
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

    // Large unlock chart - Full page, high quality
    vestingSlide.addImage({
      data: unlockChart,
      x: 0.3,
      y: 1.2,
      w: 9.4,
      h: 3.5,
      sizing: {
        type: 'contain',
        w: 9.4,
        h: 3.5
      }
    });

    // Vesting schedule details
    yPos = 5.2;
    vestingSlide.addText('Vesting Schedule Details:', {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: '374151'
    });

    data.tokenomicsData.allocations.forEach((allocation, index) => {
      if (allocation.vesting.cliff > 0 || allocation.vesting.duration > 0) {
        yPos += 0.4;
        const cliffText = allocation.vesting.cliff > 0 ? `${allocation.vesting.cliff}m cliff` : 'No cliff';
        const vestingText = allocation.vesting.duration > 0 ? `${allocation.vesting.duration}m vesting` : 'No vesting';
        vestingSlide.addText(
          `• ${allocation.category}: ${cliffText}, ${vestingText} (${allocation.vesting.type})`,
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

    // Slide 5: Key Token Metrics
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

    // Calculate key metrics
    const totalAllocation = data.tokenomicsData.allocations.reduce((sum, a) => sum + a.percentage, 0);
    const teamAllocation = data.tokenomicsData.allocations
      .filter(a => a.category.toLowerCase().includes('team'))
      .reduce((sum, a) => sum + a.percentage, 0);
    
    const publicAllocation = data.tokenomicsData.allocations
      .filter(a => a.category.toLowerCase().includes('public') || a.category.toLowerCase().includes('sale'))
      .reduce((sum, a) => sum + a.percentage, 0);

    const averageCliff = data.tokenomicsData.allocations.length > 0 
      ? data.tokenomicsData.allocations.reduce((sum, a) => sum + a.vesting.cliff, 0) / data.tokenomicsData.allocations.length
      : 0;

    const averageVesting = data.tokenomicsData.allocations.length > 0 
      ? data.tokenomicsData.allocations.reduce((sum, a) => sum + a.vesting.duration, 0) / data.tokenomicsData.allocations.length
      : 0;

    // Create metrics table with proper typing
    const metricsData: any[][] = [
      [
        { text: 'Metric', options: { bold: true, fontSize: 14, color: '1E293B' } },
        { text: 'Value', options: { bold: true, fontSize: 14, color: '1E293B' } }
      ],
      [
        { text: 'Total Supply', options: { fontSize: 12 } },
        { text: `${data.tokenomicsData.totalSupply.toLocaleString()} tokens`, options: { fontSize: 12 } }
      ],
      [
        { text: 'Total Allocation', options: { fontSize: 12 } },
        { text: `${totalAllocation}%`, options: { fontSize: 12 } }
      ],
      [
        { text: 'Team Allocation', options: { fontSize: 12 } },
        { text: `${teamAllocation}%`, options: { fontSize: 12 } }
      ],
      [
        { text: 'Public Allocation', options: { fontSize: 12 } },
        { text: `${publicAllocation}%`, options: { fontSize: 12 } }
      ],
      [
        { text: 'Market Condition', options: { fontSize: 12 } },
        { text: data.tokenomicsData.marketCondition, options: { fontSize: 12 } }
      ],
      [
        { text: 'Average Cliff Period', options: { fontSize: 12 } },
        { text: `${averageCliff.toFixed(1)} months`, options: { fontSize: 12 } }
      ],
      [
        { text: 'Average Vesting Period', options: { fontSize: 12 } },
        { text: `${averageVesting.toFixed(1)} months`, options: { fontSize: 12 } }
      ],
      [
        { text: 'Number of Allocations', options: { fontSize: 12 } },
        { text: data.tokenomicsData.allocations.length.toString(), options: { fontSize: 12 } }
      ]
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

    // Footer
    metricsSlide.addText(
      `Generated via Tokenomics Platform - ${new Date().toLocaleDateString()}`,
      {
        x: 0.5,
        y: 6.5,
        w: 9,
        h: 0.3,
        fontSize: 10,
        align: 'center',
        color: '9CA3AF',
        italic: true
      }
    );

    // Generate and download
    const fileName = `${data.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Tokenomics_Deck.pptx`;
    await pptx.writeFile({ fileName });
    
  } catch (error) {
    console.error('Error generating deck:', error);
    throw new Error('Failed to generate investor deck');
  }
};
