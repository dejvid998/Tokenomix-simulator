
import html2canvas from 'html2canvas';

/**
 * Captures a chart element as an image and returns it as a base64 string
 * @param elementId The ID of the element to capture
 * @returns A Promise that resolves to a base64 encoded image string
 */
export const captureChartAsImage = async (elementId: string): Promise<string | null> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID "${elementId}" not found`);
      return null;
    }

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      backgroundColor: null, // Transparent background
      logging: false,
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing chart:', error);
    return null;
  }
};

/**
 * Prepares charts for export by capturing them as images
 * @returns A Promise that resolves to an object containing the chart images
 */
export const prepareChartsForExport = async (): Promise<{
  unlockChart: string | null;
  distributionChart: string | null;
}> => {
  const unlockChart = await captureChartAsImage('token-unlock-chart');
  const distributionChart = await captureChartAsImage('token-distribution-chart');
  
  return {
    unlockChart,
    distributionChart
  };
};
