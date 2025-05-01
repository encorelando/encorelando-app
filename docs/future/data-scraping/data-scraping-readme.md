# EncoreLando Data Scraping System

This document provides an overview of the automated data scraping system for EncoreLando.

## Overview

The data scraping system automatically collects information about artists, festivals, concerts, venues, and parks from various online sources. The system is designed to run on a schedule, process the data, and store it in a staging area for admin review before publishing to the production database.

## Architecture

The system follows a serverless, event-driven architecture with the following components:

1. **GitHub Actions Workflow**: Triggers the scraping process on a schedule (weekly by default) or on-demand
2. **Netlify Functions**: Run the actual scraping, processing, and database operations
3. **Supabase Database**: Stores both staging and production data
4. **Admin Interface**: Web UI for reviewing and approving scraped data

## Data Flow

```
[GitHub Actions Scheduler]
        ↓
[Scraper Service (Netlify Function)]
        ↓
[Data Processor (Netlify Function)]
        ↓
[Staging Tables in Supabase]
        ↓
[Admin Review via Web Interface]
        ↓
[Data Merger (Netlify Function)]
        ↓
[Production Tables in Supabase]
```

## Setup Instructions

### 1. Prerequisites

- Supabase project with staging tables created
- Netlify site linked to the repository
- GitHub repository with Actions enabled

### 2. Environment Variables

Create a `.env` file based on the `.env.scraper.example` template and add your credentials:

```bash
cp .env.scraper.example .env
```

Then add the following secrets to GitHub Actions:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `SCRAPER_API_KEY`

### 3. Database Setup

The staging tables should already be created in your Supabase database. If not, run the following SQL:

```sql
-- See schema in docs/dev/data-scraping-automation-plan.md
```

### 4. Deploy Netlify Functions

Deploy the Netlify functions to your site:

```bash
npm run netlify:dev
netlify deploy --prod
```

## Usage

### Running the Scraper Manually

You can manually trigger the scraper through GitHub Actions:

1. Go to the GitHub repository
2. Navigate to Actions → "Data Scraping Pipeline"
3. Click "Run workflow"
4. (Optional) Specify scrape type and force update parameters
5. Click "Run workflow" button

Alternatively, you can run the scraper locally for testing:

```bash
npm run scraper:test
```

### Identifying Data Sources

To identify new data sources using an LLM:

```bash
npm run identify-sources
```

This will create a `data-sources.json` file in the `scripts/data` directory and optionally insert the sources into the Supabase database.

### Reviewing Scraped Data

1. Log in to the EncoreLando admin interface
2. Navigate to the "Data Review" section
3. Review pending items by category (artists, festivals, etc.)
4. Approve or reject each item

## Data Source Management

Data sources are stored in the `data_sources` table in Supabase. Each source has the following configuration:

- **name**: Name of the source
- **url**: Base URL of the source
- **type**: Type of data (artist, festival, concert, venue, park, or multiple)
- **active**: Whether the source is active
- **scraper_config**: Configuration for the scraper (JSON)
- **last_scraped**: When the source was last scraped
- **scraping_frequency**: How often to scrape the source (daily, weekly, monthly)
- **notes**: Additional notes about the source

### Scraper Configuration

Each data source has a `scraper_config` JSON object with specific configuration for scraping:

```json
{
  "type": "listPage",  // scraping strategy (listPage, directList, apiEndpoint)
  "selectors": {
    "name": ".artist-name",
    "description": ".artist-bio",
    "image": ".artist-image img",
    // ... other selectors
  },
  "listPageUrl": "https://example.com/artists",
  "listItemSelector": ".artist-item a",
  "dateFormat": "MM/DD/YYYY",  // for festivals
  "dateTimeFormat": "MM/DD/YYYY hh:mm a",  // for concerts
  "recurring": false  // for festivals
}
```

## Component Details

### GitHub Actions Workflow

Located at `.github/workflows/data-scraping-pipeline.yml`, this workflow:
- Runs on a schedule (Monday at 2 AM UTC)
- Can be manually triggered with parameters
- Creates a scraping run record
- Triggers the scraper function
- Updates the run status
- Sends notifications on failure

### Netlify Functions

Several functions are used in the pipeline:

- `create-scraping-run.js`: Creates a record for a new scraping run
- `scraper/index.js`: Main scraper controller that orchestrates the process
- `scraper/scrapers/<type>Scraper.js`: Individual scrapers for each data type
- `update-scraping-run.js`: Updates the status of a scraping run
- `send-admin-notification.js`: Sends notifications to admins

### Supabase Database

The system uses both the production tables and staging tables in Supabase:

- `staged_artists`, `staged_festivals`, etc.: Temporary storage for scraped data
- `scraping_runs`: Records of scraping operations
- `data_sources`: Configuration for data sources

### Admin Interface

The admin interface is built as part of the main EncoreLando web application and includes:

- Data review dashboard
- Approval/rejection workflow
- Data source management

## Maintenance

### Adding New Data Sources

1. Run the source identification tool:
   ```bash
   npm run identify-sources
   ```

2. Review the generated sources in `scripts/data/data-sources.json`

3. Manually add or update sources in the Supabase `data_sources` table

### Troubleshooting

Common issues and solutions:

- **Scraper timeout**: Increase the `SCRAPER_TIMEOUT_MS` value in environment variables
- **Rate limiting**: Add delays between requests in the scraper configuration
- **Selector changes**: Update selectors in the data source configuration if a website changes its structure
- **Authentication issues**: Check Supabase credentials and ensure proper permissions

### Monitoring

Monitor the system using:

- `scraping_runs` table in Supabase
- GitHub Actions run history
- Netlify Function logs

## Customization

### Adding a New Scraper

To add a scraper for a new data type:

1. Create a new file at `functions/scraper/scrapers/newTypeScraper.js`
2. Implement the `scrape` function
3. Update the `scraper/index.js` file to include the new scraper
4. Add appropriate staging tables in Supabase

### Modifying the Schedule

To change the scraping schedule:

1. Edit the cron expression in `.github/workflows/data-scraping-pipeline.yml`
2. For individual sources, update the `scraping_frequency` field in the `data_sources` table

## Security Considerations

- The system uses a service role key for Supabase operations
- API endpoints are protected with the `SCRAPER_API_KEY`
- Admin interfaces require authentication with admin privileges
- Rate limiting is implemented to avoid overloading source websites

## Best Practices

- Respect robots.txt directives when scraping
- Add appropriate delays between requests
- Include user-agent information identifying your scraper
- Store only the necessary data
- Update sources regularly to ensure selector accuracy
