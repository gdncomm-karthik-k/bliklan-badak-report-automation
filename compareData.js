import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { DATA_DIR, SERVICE_NAMES } from './config.js';
import { getDateString, getYesterdayDateString } from './fetchData.js';
import { generateHTML } from './generateHTML.js';
import { extractTableHTML } from './powerAutomate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadDataFile(dateString) {
  const dataPath = path.join(__dirname, DATA_DIR);
  const fileName = `data-${dateString}.json`;
  const filePath = path.join(dataPath, fileName);
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

function getDateStringForDaysAgo(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function findMostRecentDataFile(maxDaysBack = 30) {
  // Start from yesterday and go backwards
  for (let daysAgo = 1; daysAgo <= maxDaysBack; daysAgo++) {
    const dateString = getDateStringForDaysAgo(daysAgo);
    const data = await loadDataFile(dateString);
    if (data) {
      return { data, dateString, daysAgo };
    }
  }
  return null;
}

function getStatusText(pass, failed, total) {
  if (total === 0) return 'N/A';
  if (failed === 0 && pass === total) return `${total} Pass`;
  if (pass === 0 && failed > 0) return '0 Pass';
  return `${pass} Pass`;
}

function calculateComparison(todayData, yesterdayData) {
  const results = [];
  
  // Filter services to only include those in SERVICE_NAMES config
  const filteredTodayData = todayData.filter(service => 
    SERVICE_NAMES.includes(service.name)
  );
  
  for (const service of filteredTodayData) {
    const yesterdayService = yesterdayData?.find(s => s.id === service.id) || null;
    
    // Regression calculations
    const todayRegPass = service.totalRegressionPass || 0;
    const todayRegFailed = service.totalRegressionFailed || 0;
    const todayRegTotal = todayRegPass + todayRegFailed;
    const todayRegPassRate = todayRegTotal > 0 ? ((todayRegPass / todayRegTotal) * 100) : 0;
    
    const yesterdayRegPass = yesterdayService?.totalRegressionPass || 0;
    const yesterdayRegFailed = yesterdayService?.totalRegressionFailed || 0;
    const yesterdayRegTotal = yesterdayRegPass + yesterdayRegFailed;
    const yesterdayRegPassRate = yesterdayRegTotal > 0 ? ((yesterdayRegPass / yesterdayRegTotal) * 100) : 0;
    
    const regPassRateChange = todayRegPassRate - yesterdayRegPassRate;
    
    // Sanity calculations
    const todaySanityPass = service.totalSanityPass || 0;
    const todaySanityFailed = service.totalSanityFailed || 0;
    const todaySanityTotal = todaySanityPass + todaySanityFailed;
    const todaySanityStatus = getStatusText(todaySanityPass, todaySanityFailed, todaySanityTotal);
    
    const yesterdaySanityPass = yesterdayService?.totalSanityPass || 0;
    const yesterdaySanityFailed = yesterdayService?.totalSanityFailed || 0;
    const yesterdaySanityTotal = yesterdaySanityPass + yesterdaySanityFailed;
    const yesterdaySanityStatus = getStatusText(yesterdaySanityPass, yesterdaySanityFailed, yesterdaySanityTotal);
    
    const todaySanityPassRate = todaySanityTotal > 0 ? ((todaySanityPass / todaySanityTotal) * 100) : 0;
    const yesterdaySanityPassRate = yesterdaySanityTotal > 0 ? ((yesterdaySanityPass / yesterdaySanityTotal) * 100) : 0;
    const sanityPassRateChange = todaySanityPassRate - yesterdaySanityPassRate;
    const sanityChanged = todaySanityStatus !== yesterdaySanityStatus || Math.abs(sanityPassRateChange) > 0.01;
    
    // Integration calculations
    const todayIntPass = service.totalIntegrationPass ?? 0;
    const todayIntFailed = service.totalIntegrationFailed ?? 0;
    const todayIntTotal = todayIntPass + todayIntFailed;
    const todayIntStatus = getStatusText(todayIntPass, todayIntFailed, todayIntTotal);
    
    const yesterdayIntPass = yesterdayService?.totalIntegrationPass ?? 0;
    const yesterdayIntFailed = yesterdayService?.totalIntegrationFailed ?? 0;
    const yesterdayIntTotal = yesterdayIntPass + yesterdayIntFailed;
    const yesterdayIntStatus = getStatusText(yesterdayIntPass, yesterdayIntFailed, yesterdayIntTotal);
    
    const todayIntPassRate = todayIntTotal > 0 ? ((todayIntPass / todayIntTotal) * 100) : 0;
    const yesterdayIntPassRate = yesterdayIntTotal > 0 ? ((yesterdayIntPass / yesterdayIntTotal) * 100) : 0;
    const intPassRateChange = todayIntPassRate - yesterdayIntPassRate;
    const intChanged = todayIntStatus !== yesterdayIntStatus || Math.abs(intPassRateChange) > 0.01;
    
    results.push({
      id: service.id,
      name: service.name,
      // Regression
      todayRegPassRate: parseFloat(todayRegPassRate.toFixed(2)),
      yesterdayRegPassRate: parseFloat(yesterdayRegPassRate.toFixed(2)),
      regPassRateChange: parseFloat(regPassRateChange.toFixed(2)),
      // Sanity
      todaySanityPassRate: parseFloat(todaySanityPassRate.toFixed(2)),
      yesterdaySanityPassRate: parseFloat(yesterdaySanityPassRate.toFixed(2)),
      sanityPassRateChange: parseFloat(sanityPassRateChange.toFixed(2)),
      sanityChanged,
      // Integration
      todayIntPassRate: parseFloat(todayIntPassRate.toFixed(2)),
      yesterdayIntPassRate: parseFloat(yesterdayIntPassRate.toFixed(2)),
      intPassRateChange: parseFloat(intPassRateChange.toFixed(2)),
      intChanged
    });
  }
  
  return results;
}

async function compareData(todayData) {
  const todayDateString = getDateString();
  const yesterdayDateString = getYesterdayDateString();
  
  console.log(`Comparing data: Today (${todayDateString}) vs Previous available date`);
  
  // Try to find the most recent available data file
  const previousDataResult = await findMostRecentDataFile();
  
  if (!previousDataResult) {
    console.log(`⚠️  No previous data file found. Showing today's data only.`);
    const comparison = calculateComparison(todayData.data, []);
    const htmlContent = generateHTML(comparison, todayDateString, yesterdayDateString, false);
    const outputPath = path.join(__dirname, 'comparison-report.html');
    await fs.writeFile(outputPath, htmlContent);
    console.log(`✅ Comparison report generated: ${outputPath}`);
    
    const tableHTML = extractTableHTML(htmlContent);
    return {
      comparison,
      htmlPath: outputPath,
      tableHTML: tableHTML || htmlContent
    };
  }
  
  const previousData = previousDataResult.data;
  const previousDateString = previousDataResult.dateString;
  const daysAgo = previousDataResult.daysAgo;
  
  if (previousDateString === yesterdayDateString) {
    console.log(`✅ Found data file for yesterday: ${previousDateString}`);
  } else {
    console.log(`ℹ️  No data file found for yesterday (${yesterdayDateString}). Using most recent available: ${previousDateString} (${daysAgo} day${daysAgo > 1 ? 's' : ''} ago)`);
  }
  
  const comparison = calculateComparison(todayData.data, previousData.data || []);
  
  const htmlContent = generateHTML(comparison, todayDateString, previousDateString, true);
  
  const outputPath = path.join(__dirname, 'comparison-report.html');
  await fs.writeFile(outputPath, htmlContent);
  
  console.log(`✅ Comparison report generated: ${outputPath}`);
  
  // Extract table HTML for Teams posting
  const tableHTML = extractTableHTML(htmlContent);
  
  return {
    comparison,
    htmlPath: outputPath,
    tableHTML: tableHTML || htmlContent
  };
}

export { compareData };

