import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { API_URL, DATA_DIR } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDataDir() {
  const dataPath = path.join(__dirname, DATA_DIR);
  try {
    await fs.access(dataPath);
  } catch {
    await fs.mkdir(dataPath, { recursive: true });
  }
  return dataPath;
}

function getDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchData() {
  try {
    console.log('Fetching data from API...');
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.status === 'OK') {
      const dataPath = await ensureDataDir();
      const dateString = getDateString();
      const fileName = `data-${dateString}.json`;
      const filePath = path.join(dataPath, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Data saved successfully to ${filePath}`);
      
      return {
        success: true,
        data: data,
        filePath: filePath,
        dateString: dateString
      };
    } else {
      throw new Error(`API returned error: ${data.status}`);
    }
  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
    throw error;
  }
}

export { fetchData, getDateString, getYesterdayDateString };

