// Generate monthAndYear dynamically based on current date (format: MM-YYYY)
function getCurrentMonthYear() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}-${year}`;
}

const BASE_URL = `https://neo-badak.gdn-app.com/api/engineering-report/byCollabId/1020?monthAndYear=${getCurrentMonthYear()}&engineeringReportStatus=1&engineeringReportStatus=2&collabId=`;

export const ENVIRONMENTS = [
  { id: 2, name: 'QA2', url: `${BASE_URL}&environmentId=2` },
  { id: 5, name: 'Preprod', url: `${BASE_URL}&environmentId=5` }
];

// Keep for backward compatibility
export const API_URL = ENVIRONMENTS[0].url;

export const SERVICE_NAMES = [
  "Bliklan Campaign Management API",
  "Bliklan Tracker Aggregator API",
  "Bliklan Credit Service API",
  "Bliklan Compute Engine",
  "Bliklan Ads Engine"
];

export const DATA_DIR = "./data";

