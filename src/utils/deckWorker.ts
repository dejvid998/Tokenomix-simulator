import { expose } from 'comlink';

async function generatePptx({ projectName, tokenomicsData, distributionChart, unlockChart }: any): Promise<string> {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.author = 'Tokenomics Platform';
  pptx.company = projectName;
  pptx.title = `${projectName} - Token Economics`;
  pptx.subject = 'Investor Presentation';

  const titleSlide = pptx.addSlide();
  titleSlide.background = { fill: 'F8FAFC' } as any;
  titleSlide.addText(projectName, { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 36, bold: true, align: 'center', color: '1E293B' } as any);
  titleSlide.addText('Token Economics Overview', { x: 0.5, y: 2.8, w: 9, h: 0.8, fontSize: 24, align: 'center', color: '475569' } as any);
  titleSlide.addText(`Generated on ${new Date().toLocaleDateString()}`, { x: 0.5, y: 5.5, w: 9, h: 0.4, fontSize: 12, align: 'center', color: '94A3B8', italic: true } as any);

  const distributionSlide = pptx.addSlide();
  distributionSlide.background = { fill: 'FFFFFF' } as any;
  distributionSlide.addText('Token Distribution', { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, bold: true, color: '1E293B' } as any);
  distributionSlide.addImage({ data: distributionChart, x: 0.5, y: 1.2, w: 9, h: 5.5, sizing: { type: 'contain', w: 9, h: 5.5 } } as any);

  const allocationsSlide = pptx.addSlide();
  allocationsSlide.background = { fill: 'FFFFFF' } as any;
  allocationsSlide.addText('Stakeholder Allocations', { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, bold: true, color: '1E293B' } as any);
  const allocationsTableData = ([['Stakeholder Category', 'Allocation (%)', 'Token Amount'], ...tokenomicsData.allocations.map((a: any) => [a.category, a.percentage.toFixed(2), ((a.percentage / 100) * tokenomicsData.totalSupply).toLocaleString()])]).map((row: string[], i: number) => row.map((cell: string) => ({ text: cell, options: i === 0 ? { bold: true, fill: { color: 'E5E7EB' }, color: '1E293B', align: 'center' } : { fill: { color: 'F9FAFB' }, color: '374151' } })));
  allocationsSlide.addTable(allocationsTableData as any, { x: 0.5, y: 1.5, w: 9, colW: [4, 2, 3], rowH: 0.4, border: { pt: 1, color: 'CCCCCC' }, fontSize: 12, valign: 'middle' } as any);

  const unlockSlide = pptx.addSlide();
  unlockSlide.background = { fill: 'FFFFFF' } as any;
  unlockSlide.addText('Token Unlock Schedule', { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, bold: true, color: '1E293B' } as any);
  unlockSlide.addImage({ data: unlockChart, x: 0.3, y: 1.2, w: 9.4, h: 4.5, sizing: { type: 'contain', w: 9.4, h: 4.5 } } as any);

  const totalAllocation = tokenomicsData.allocations.reduce((sum: number, a: any) => sum + a.percentage, 0);
  const averageCliff = tokenomicsData.allocations.length > 0 ? tokenomicsData.allocations.reduce((sum: number, a: any) => sum + a.vesting.cliff, 0) / tokenomicsData.allocations.length : 0;
  const averageVesting = tokenomicsData.allocations.length > 0 ? tokenomicsData.allocations.reduce((sum: number, a: any) => sum + a.vesting.duration, 0) / tokenomicsData.allocations.length : 0;

  const metricsSlide = pptx.addSlide();
  metricsSlide.background = { fill: 'FFFFFF' } as any;
  metricsSlide.addText('Key Token Metrics', { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, bold: true, color: '1E293B' } as any);
  const metricsData = ([
    ['Metric', 'Value'],
    ['Total Supply', `${tokenomicsData.totalSupply.toLocaleString()} tokens`],
    ['Total Allocation', `${totalAllocation}%`],
    ['Market Condition', tokenomicsData.marketCondition],
    ['Average Cliff Period', `${averageCliff.toFixed(1)} months`],
    ['Average Vesting Period', `${averageVesting.toFixed(1)} months`],
    ['Number of Allocations', tokenomicsData.allocations.length.toString()],
  ]).map((row: string[], i: number) => row.map((cell: string) => ({ text: cell, options: i === 0 ? { bold: true, fill: { color: 'E5E7EB' } } : { fill: { color: 'F9FAFB' } } })));
  metricsSlide.addTable(metricsData as any, { x: 1.5, y: 1.5, w: 7, colW: [3.5, 3.5], rowH: 0.4, border: { pt: 1, color: 'CCCCCC' }, fontSize: 12, color: '374151' } as any);

  // Return a base64 string instead of writing to file; caller decides to save
  const base64: string = await pptx.write('base64');
  return base64;
}

expose({ generatePptx });


