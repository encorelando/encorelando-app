# EncoreLando Data Scraping System (Future Feature)

This directory contains plans and implementation files for a future data scraping automation system for EncoreLando. The feature has been postponed to prioritize the core application launch.

## Overview

The data scraping system is designed to automatically collect information about artists, festivals, concerts, venues, and parks from various online sources. The system will run on a schedule, process the data, and store it in a staging area for admin review before publishing to the production database.

## Directory Structure

- `github-workflows/` - GitHub Actions workflow files
- `functions/` - Netlify Functions for the data scraping pipeline
  - `scraper/` - Main scraper implementation
    - `scrapers/` - Individual scrapers for each data type
    - `utils/` - Utility functions for data processing
- `scripts/` - Utility scripts for source identification and testing

## Implementation Plan

See `data-scraping-automation-plan.md` for the detailed implementation plan.

## Staging Tables

The following staging tables have been created in Supabase:

- `staged_parks`
- `staged_venues` 
- `staged_artists`
- `staged_festivals`
- `staged_concerts`
- `scraping_runs`
- `data_sources`

## How to Resume Development

When development of this feature resumes:

1. Copy the files from this directory to their appropriate locations:
   - GitHub workflow files to `.github/workflows/`
   - Netlify functions to `functions/`
   - Utility scripts to `scripts/`

2. Update the `package.json` with the necessary scripts and dependencies:
   ```json
   {
     "scripts": {
       "identify-sources": "node ./scripts/identify-data-sources.js",
       "scraper:test": "netlify functions:invoke --name scraper --no-identity --payload '{\"runId\": \"test\", \"type\": \"all\", \"forceUpdate\": true}'",
       "create-run": "netlify functions:invoke --name create-scraping-run --no-identity",
       "test-connection": "netlify functions:invoke --name test-connection --no-identity"
     },
     "dependencies": {
       "axios": "^1.6.5",
       "cheerio": "^1.0.0-rc.12"
     }
   }
   ```

3. Configure environment variables as specified in `.env.scraper`

4. Complete the implementation of any missing scrapers

## Next Steps

1. Implement individual scrapers for festivals, concerts, venues, and parks
2. Create the admin interface for reviewing scraped data
3. Set up notifications for admins
4. Test the complete pipeline
5. Deploy to production