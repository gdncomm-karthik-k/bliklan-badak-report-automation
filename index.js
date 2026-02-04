import { fetchAllEnvironments } from './fetchData.js';
import { compareAllEnvironments } from './compareData.js';
import { postToTeams } from './powerAutomate.js';

async function main() {
  try {
    console.log('🚀 Starting Engineering Report Comparison Tool\n');
    
    // Step 1: Fetch data from all environments (QA2, Preprod)
    const allEnvData = await fetchAllEnvironments();
    
    // Check if any environment failed
    const failedEnvs = Object.entries(allEnvData).filter(([, data]) => !data.success);
    if (failedEnvs.length === Object.keys(allEnvData).length) {
      console.error('Failed to fetch data from all environments');
      process.exit(1);
    }
    
    // Step 2: Compare with previous data for all environments
    const compareResult = await compareAllEnvironments(allEnvData);
    
    // Step 3: Post to Microsoft Teams via Power Automate
    console.log('\n📤 Sending report to Microsoft Teams...');
    try {
      await postToTeams(compareResult.tableHTML);
      console.log('✅ Report successfully posted to Microsoft Teams!');
    } catch (teamsError) {
      console.error('⚠️  Failed to post to Teams:', teamsError.message);
      console.log('📄 You can still view the report locally in comparison-report.html');
    }
    
    console.log('\n✅ Process completed successfully!');
    console.log('📄 Open comparison-report.html in your browser to view the results.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

