
import { logger } from '@/lib/logger';

/**
 * Captures a chart element as an image and returns it as a base64 string
 * @param elementId The ID of the element to capture
 * @returns A Promise that resolves to a base64 encoded image string
 */
export const captureChartAsImage = async (elementId: string): Promise<string | null> => {
  try {
    logger.log(`Attempting to capture chart with ID: ${elementId}`);
    
    const element = document.getElementById(elementId);
    if (!element) {
      logger.error(`Element with ID "${elementId}" not found`);
      return null;
    }

    logger.debug(`Element found:`, element);
    logger.debug(`Element dimensions:`, {
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight
    });

    // Check if element is visible
    const rect = element.getBoundingClientRect();
    logger.debug(`Element position:`, rect);
    
    if (rect.width === 0 || rect.height === 0) {
      logger.error(`Element "${elementId}" has zero dimensions`);
      return null;
    }

    // Wait for any animations or transitions to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Force a repaint
    element.style.transform = 'translateZ(0)';
    await new Promise(resolve => setTimeout(resolve, 100));

    logger.log(`Starting html2canvas capture for ${elementId}`);
    const { default: html2canvas } = await import('html2canvas');
    
    const canvas = await html2canvas(element, {
      scale: 3, // High quality but not excessive
      backgroundColor: '#ffffff',
      logging: true, // Enable logging for debugging
      useCORS: true,
      allowTaint: true,
      height: Math.max(element.offsetHeight, 400),
      width: Math.max(element.offsetWidth, 600),
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false, // Disable for better compatibility
      ignoreElements: (element) => {
        // Ignore any overlay elements that might interfere
        return element.classList.contains('tooltip') || 
               element.classList.contains('overlay') ||
               element.tagName === 'BUTTON';
      },
      onclone: (clonedDoc) => {
        console.log(`Cloned document for ${elementId}`);
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Ensure visibility in cloned document
          clonedElement.style.visibility = 'visible';
          clonedElement.style.display = 'block';
          clonedElement.style.opacity = '1';
          
          // Force all SVG elements to be visible
          const svgElements = clonedElement.querySelectorAll('svg');
          svgElements.forEach(svg => {
            svg.style.visibility = 'visible';
            svg.style.display = 'block';
          });
        }
      }
    });
    
    logger.debug(`Canvas created:`, {
      width: canvas.width,
      height: canvas.height
    });
    
    const dataURL = canvas.toDataURL('image/png', 1.0);
    logger.log(`Image captured successfully for ${elementId}. Data URL length: ${dataURL.length}`);
    
    return dataURL;
  } catch (error) {
    logger.error(`Error capturing chart ${elementId}:`, error);
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
  logger.log('Starting chart preparation for export');
  
  // Check if charts exist
  const distributionElement = document.getElementById('token-distribution-chart');
  const unlockElement = document.getElementById('token-unlock-chart');
  
  logger.debug('Chart elements found:', {
    distribution: !!distributionElement,
    unlock: !!unlockElement
  });
  
  const unlockChart = await captureChartAsImage('token-unlock-chart');
  const distributionChart = await captureChartAsImage('token-distribution-chart');
  
  logger.log('Chart capture results:', {
    unlockChart: unlockChart ? 'SUCCESS' : 'FAILED',
    distributionChart: distributionChart ? 'SUCCESS' : 'FAILED'
  });
  
  return {
    unlockChart,
    distributionChart
  };
};
