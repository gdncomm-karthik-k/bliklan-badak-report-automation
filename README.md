# Engineering Report Comparison Tool

This tool fetches engineering report data from an API, saves it daily, and compares it with the previous day's data.

## Features

- Fetches data from the engineering report API
- Saves daily data as JSON files with date stamps
- Compares today's data with yesterday's data
- Generates an HTML report with comparison results
- Shows regression test pass/fail statistics and percentage changes

## Installation

```bash
npm install
```

## Usage

Run the main script to fetch data and generate comparison:

```bash
npm start
```

Or run individual commands:

```bash
# Fetch and save today's data
npm run fetch

# Compare today vs yesterday (requires fetch to be run first)
npm run compare
```

## Output

- **Data files**: Saved in `./data/` directory as `data-YYYY-MM-DD.json`
- **HTML Report**: Generated as `comparison-report.html` in the project root

## Configuration

Edit `config.js` to modify:
- API URL
- Service names
- Data directory

## Project Structure

```
.
├── index.js           # Main entry point
├── fetchData.js       # Fetch and save API data
├── compareData.js     # Compare today vs yesterday
├── generateHTML.js    # Generate HTML report
├── config.js          # Configuration
└── data/              # Daily data files (created automatically)
```

