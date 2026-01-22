import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORT_URL = "https://neo-badak.gdn-app.com/api/engineering-report/byCollabId/1020?monthAndYear=01-2026&environmentId=2&engineeringReportStatus=1&engineeringReportStatus=2&collabId=1020";

async function captureReportScreenshot() {
  try {
    // Use Puppeteer to capture screenshot
    const puppeteer = await import('puppeteer').catch(() => null);
    
    if (!puppeteer) {
      console.log('⚠️  Puppeteer not available. Skipping screenshot capture.');
      return null;
    }
    
    console.log('📸 Capturing report screenshot...');
    
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to the report page
    await page.goto(REPORT_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for the table to load
    await page.waitForSelector('table', { timeout: 10000 });
    // Additional wait for data to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find the table element (the one with data, not the header table)
    // First, scroll the table into view to ensure it's fully visible
    await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      let dataTable = null;
      for (const table of tables) {
        const rows = table.querySelectorAll('tbody tr');
        if (rows.length > 0) {
          dataTable = table;
          break;
        }
      }
      if (dataTable) {
        dataTable.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
      }
    });
    
    // Wait a bit for scroll to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tableBox = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      // Find the table that has data rows (not just headers)
      let dataTable = null;
      for (const table of tables) {
        const rows = table.querySelectorAll('tbody tr');
        if (rows.length > 0) {
          dataTable = table;
          break;
        }
      }
      
      if (!dataTable) {
        dataTable = tables[tables.length - 1]; // Fallback to last table
      }
      
      if (!dataTable) {
        return null;
      }
      
      const rect = dataTable.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // Use reasonable padding - enough to capture the table without too much empty space
      const leftPadding = 50;   // Minimal left padding to avoid cutting off table
      const rightPadding = 50;
      const topPadding = 50;
      const bottomPadding = 80;
      
      // Calculate crop area - start from table position minus padding
      // Use a small buffer from the left edge to avoid capturing too much empty space
      let x = Math.max(0, rect.x - leftPadding);
      let y = Math.max(0, rect.y - topPadding);
      
      // Calculate width - full table width plus padding on both sides
      let width = rect.width + leftPadding + rightPadding;
      
      // If we couldn't add full left padding (table too close to left edge),
      // add that missing padding to the right side to ensure full table width
      if (rect.x - leftPadding < 0) {
        const missingLeftPadding = Math.abs(rect.x - leftPadding);
        width = width + missingLeftPadding;
      }
      
      // Don't exceed viewport width
      width = Math.min(width, viewportWidth - x);
      
      // Calculate height with padding
      let height = rect.height + topPadding + bottomPadding;
      height = Math.min(height, viewportHeight - y);
      
      return {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height)
      };
    });
    
    if (!tableBox) {
      throw new Error('Table not found');
    }
    
    // Take screenshot of the table area at full quality
    const screenshotPath = path.join(__dirname, 'report-screenshot.png');
    await page.screenshot({
      path: screenshotPath,
      clip: tableBox,
      fullPage: false
    });
    
    await browser.close();
    
    console.log(`✅ Screenshot saved to ${screenshotPath}`);
    
    // Read the screenshot and convert to base64 (no compression - full quality)
    const imageBuffer = await fs.readFile(screenshotPath);
    const base64Image = imageBuffer.toString('base64');
    const imageSize = imageBuffer.length;
    const base64Size = base64Image.length;
    
    console.log(`📷 Image size: ${Math.round(imageSize / 1024)}KB (Base64: ${Math.round(base64Size / 1024)}KB)`);
    
    return {
      path: screenshotPath,
      base64: base64Image,
      mimeType: 'image/png',
      imageName: 'report-screenshot.png'
    };
    
  } catch (error) {
    console.error('❌ Error capturing screenshot:', error.message);
    // Don't fail the whole process if screenshot fails
    return null;
  }
}

export { captureReportScreenshot };

