const POWER_AUTOMATE_API_URL = "https://defaultf0d6e2fef00540468dc116668be1de.52.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3acef0b87b844ce2a9f7090daa6c77a5/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=aXWlFV0DCDqoGAXu3G6jtb-04_LNDBw98S8waLg9yLY";

function extractTableHTML(fullHTML) {
  // Extract just the table element with its styles
  const tableMatch = fullHTML.match(/<table[\s\S]*?<\/table>/i);
  if (tableMatch) {
    // Also extract the style tag
    const styleMatch = fullHTML.match(/<style[\s\S]*?<\/style>/i);
    const tableHTML = tableMatch[0];
    const styleHTML = styleMatch ? styleMatch[0] : '';
    
    // Return table with styles
    return styleHTML + tableHTML;
  }
  return null;
}

async function postToTeams(htmlTableContent) {
  try {
    const payload = {
      title: "Hi Everyone - Please find today's Automation run report comparison",
      message: htmlTableContent
    };
    
    console.log('📤 Posting to Microsoft Teams via Power Automate...');
    
    const response = await fetch(POWER_AUTOMATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Power Automate API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json().catch(() => ({}));
    console.log('✅ Successfully posted to Microsoft Teams!');
    
    return {
      success: true,
      response: result
    };
  } catch (error) {
    console.error('❌ Error posting to Teams:', error.message);
    throw error;
  }
}

export { postToTeams, extractTableHTML };

