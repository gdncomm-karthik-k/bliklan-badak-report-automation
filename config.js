// Generate monthAndYear dynamically based on current date (format: MM-YYYY)
function getCurrentMonthYear() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}-${year}`;
}

export const API_URL = `https://neo-badak.gdn-app.com/api/engineering-report/byCollabId/1020?monthAndYear=${getCurrentMonthYear()}&environmentId=2&engineeringReportStatus=1&engineeringReportStatus=2&collabId=`;
console.log(API_URL)
export const SERVICE_NAMES = [
  "Bliklan Campaign Management API",
  "Bliklan Tracker Aggregator API",
  "Bliklan Credit Service API",
  "Bliklan Compute Engine",
  "Bliklan Ads Engine"
];

export const DATA_DIR = "./data";

