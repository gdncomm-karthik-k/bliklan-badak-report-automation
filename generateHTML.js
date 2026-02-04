export function generateHTML(comparisonResults, todayDate, yesterdayDate, hasYesterdayData) {
  const rows = comparisonResults.map(result => {
    // Regression change indicator
    const regChangeSign = result.regPassRateChange > 0 ? '+' : '';
    let regChangeDisplay;
    if (hasYesterdayData && Math.abs(result.regPassRateChange) > 0.01) {
      const regColor = result.regPassRateChange > 0 ? '#28a745' : '#dc3545';
      regChangeDisplay = `<span style="color: ${regColor}; font-weight: 600;"><span style="color: ${regColor}; margin-right: 5px;">●</span>${regChangeSign}${result.regPassRateChange}%</span>`;
    } else {
      regChangeDisplay = '<span style="color: #6c757d;">No change</span>';
    }
    
    // Sanity change indicator
    const sanityChangeSign = result.sanityPassRateChange > 0 ? '+' : '';
    let sanityChangeDisplay;
    if (hasYesterdayData && result.sanityChanged && Math.abs(result.sanityPassRateChange) > 0.01) {
      const sanityColor = result.sanityPassRateChange > 0 ? '#28a745' : '#dc3545';
      sanityChangeDisplay = `<span style="color: ${sanityColor}; font-weight: 600;"><span style="color: ${sanityColor}; margin-right: 5px;">●</span>${sanityChangeSign}${result.sanityPassRateChange}%</span>`;
    } else {
      sanityChangeDisplay = '<span style="color: #6c757d;">No change</span>';
    }
    
    // Integration change indicator
    const intChangeSign = result.intPassRateChange > 0 ? '+' : '';
    let intChangeDisplay;
    if (hasYesterdayData && result.intChanged && Math.abs(result.intPassRateChange) > 0.01) {
      const intColor = result.intPassRateChange > 0 ? '#28a745' : '#dc3545';
      intChangeDisplay = `<span style="color: ${intColor}; font-weight: 600;"><span style="color: ${intColor}; margin-right: 5px;">●</span>${intChangeSign}${result.intPassRateChange}%</span>`;
    } else {
      intChangeDisplay = '<span style="color: #6c757d;">No change</span>';
    }
    
    const regressionDisplay = hasYesterdayData 
      ? `${result.yesterdayRegPassRate}% → ${result.todayRegPassRate}%`
      : `${result.todayRegPassRate}%`;
    
    const sanityDisplay = hasYesterdayData
      ? `${result.yesterdaySanityPassRate}% → ${result.todaySanityPassRate}%`
      : `${result.todaySanityPassRate}%`;
    
    const integrationDisplay = hasYesterdayData
      ? `${result.yesterdayIntPassRate}% → ${result.todayIntPassRate}%`
      : `${result.todayIntPassRate}%`;
    
    return `
      <tr>
        <td>${result.name}</td>
        <td>${regressionDisplay}</td>
        <td>${regChangeDisplay}</td>
        <td>${sanityDisplay}</td>
        <td>${sanityChangeDisplay}</td>
        <td>${integrationDisplay}</td>
        <td>${intChangeDisplay}</td>
      </tr>
    `;
  }).join('');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    table {
      border-collapse: collapse;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      width: 100%;
    }
    
    th {
      padding: 10px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }
    
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        <th>Service</th>
        <th>Regression</th>
        <th>Change (Regression)</th>
        <th>Sanity</th>
        <th>Change (Sanity)</th>
        <th>Integration</th>
        <th>Change (Integration)</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;
}

function generateTableRows(comparisonResults, hasYesterdayData) {
  return comparisonResults.map(result => {
    // Regression change indicator
    const regChangeSign = result.regPassRateChange > 0 ? '+' : '';
    let regChangeDisplay;
    if (hasYesterdayData && Math.abs(result.regPassRateChange) > 0.01) {
      const regColor = result.regPassRateChange > 0 ? '#28a745' : '#dc3545';
      regChangeDisplay = `<span style="color: ${regColor}; font-weight: 600;"><span style="color: ${regColor}; margin-right: 5px;">●</span>${regChangeSign}${result.regPassRateChange}%</span>`;
    } else {
      regChangeDisplay = '<span style="color: #6c757d;">No change</span>';
    }
    
    // Sanity change indicator
    const sanityChangeSign = result.sanityPassRateChange > 0 ? '+' : '';
    let sanityChangeDisplay;
    if (hasYesterdayData && result.sanityChanged && Math.abs(result.sanityPassRateChange) > 0.01) {
      const sanityColor = result.sanityPassRateChange > 0 ? '#28a745' : '#dc3545';
      sanityChangeDisplay = `<span style="color: ${sanityColor}; font-weight: 600;"><span style="color: ${sanityColor}; margin-right: 5px;">●</span>${sanityChangeSign}${result.sanityPassRateChange}%</span>`;
    } else {
      sanityChangeDisplay = '<span style="color: #6c757d;">No change</span>';
    }
    
    // Integration change indicator
    const intChangeSign = result.intPassRateChange > 0 ? '+' : '';
    let intChangeDisplay;
    if (hasYesterdayData && result.intChanged && Math.abs(result.intPassRateChange) > 0.01) {
      const intColor = result.intPassRateChange > 0 ? '#28a745' : '#dc3545';
      intChangeDisplay = `<span style="color: ${intColor}; font-weight: 600;"><span style="color: ${intColor}; margin-right: 5px;">●</span>${intChangeSign}${result.intPassRateChange}%</span>`;
    } else {
      intChangeDisplay = '<span style="color: #6c757d;">No change</span>';
    }
    
    const regressionDisplay = hasYesterdayData 
      ? `${result.yesterdayRegPassRate}% → ${result.todayRegPassRate}%`
      : `${result.todayRegPassRate}%`;
    
    const sanityDisplay = hasYesterdayData
      ? `${result.yesterdaySanityPassRate}% → ${result.todaySanityPassRate}%`
      : `${result.todaySanityPassRate}%`;
    
    const integrationDisplay = hasYesterdayData
      ? `${result.yesterdayIntPassRate}% → ${result.todayIntPassRate}%`
      : `${result.todayIntPassRate}%`;
    
    return `
      <tr>
        <td>${result.name}</td>
        <td>${regressionDisplay}</td>
        <td>${regChangeDisplay}</td>
        <td>${sanityDisplay}</td>
        <td>${sanityChangeDisplay}</td>
        <td>${integrationDisplay}</td>
        <td>${intChangeDisplay}</td>
      </tr>
    `;
  }).join('');
}

export function generateMultiEnvHTML(envResults) {
  const envSections = envResults.map(envResult => {
    const rows = generateTableRows(envResult.comparison, envResult.hasYesterdayData);
    
    return `
    <div style="margin-bottom: 30px;">
      <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #007bff; padding-bottom: 8px;">
        ${envResult.envName}:
      </h2>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Regression</th>
            <th>Change (Regression)</th>
            <th>Sanity</th>
            <th>Change (Sanity)</th>
            <th>Integration</th>
            <th>Change (Integration)</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
    }
    
    table {
      border-collapse: collapse;
      font-size: 14px;
      width: 100%;
    }
    
    th {
      padding: 10px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }
    
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    
  </style>
</head>
<body>
  ${envSections}
</body>
</html>`;
}

