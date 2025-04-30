# EncoreLando Data Scraping Automation Plan

## 1. Overview and Objectives

Based on my analysis of the EncoreLando project, we need to create a robust and reliable system to automatically scrape event, artist, and festival data from various sources. The system should:

1. Run on a regular schedule (weekly or daily)
2. Find and extract relevant data from reliable sources
3. Process and validate the data before adding it to the database
4. Implement a verification/staging process for quality control
5. Leverage existing infrastructure (GitHub Actions, Netlify, or Supabase)
6. Require minimal maintenance once established

## 2. Technical Approach

### 2.1 High-Level Architecture

I recommend implementing a serverless, event-driven architecture with the following components:

1. **Scraper Service**: Scheduled functions that extract data from identified sources
2. **Data Processor**: Functions that clean, validate, and normalize the scraped data
3. **Staging Database**: Temporary storage for unverified data awaiting approval
4. **Admin Verification Interface**: UI component for admins to review and approve data
5. **Data Merger**: Process to move approved data from staging to production

### 2.2 Infrastructure Choice

After analyzing the existing project setup, I recommend using **GitHub Actions + Netlify Functions** for the following reasons:

1. **GitHub Actions**:
   - Already configured in the project (CI/CD workflows exist)
   - Provides excellent scheduling capabilities via cron expressions
   - Can be triggered manually or on schedule
   - Free tier offers 2,000 minutes/month of runtime (sufficient for weekly scraping)

2. **Netlify Functions**:
   - Already configured in the project (functions directory exists)
   - Serverless architecture aligns with the project's current approach
   - Can be used for both scheduled tasks and API endpoints for admin verification
   - Integrates well with the existing deployment pipeline

3. **Supabase Database**:
   - Already used as the main database
   - Can host both production and staging tables
   - Row-level security policies already implemented for admin-only access

This approach avoids introducing additional services to the tech stack while leveraging the strengths of each existing component.

## 3. Data Pipeline Design

I propose the following data pipeline:

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

### 3.1 Data Flow Details

1. **Scheduled Trigger**: GitHub Actions workflow runs on schedule (weekly or daily)

2. **Scraping Phase**:
   - Netlify function is triggered to run scraper scripts
   - Scraper identifies and extracts data from sources
   - Initial validation performs basic checks on data format and completeness

3. **Processing Phase**:
   - Raw data is cleaned and normalized
   - Entity relationships are established
   - Data is enriched with additional metadata
   - Duplicate detection is performed

4. **Staging Phase**:
   - Processed data is stored in staging tables
   - Notifications are sent to admins for review
   - Data is marked with status flags (new, updated, duplicate, etc.)

5. **Review Phase**:
   - Admins access a secure interface
   - Data is presented with highlights for changes
   - Admins can approve, reject, or edit entries
   - Bulk and individual actions are supported

6. **Publication Phase**:
   - Approved data is migrated to production tables
   - Data integrity is verified post-migration
   - Old or superseded data is archived or updated

## 4. Database Schema Modifications

To support the data scraping pipeline, we need to add the following tables to the Supabase database:

```sql
-- Tables for staging scraped data (mirrors production tables with additional fields)
CREATE TABLE staged_parks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  image_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  source_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE staged_venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  park_id UUID,
  description TEXT,
  location_details TEXT,
  image_url TEXT,
  capacity INTEGER,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  source_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE staged_artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  website_url TEXT,
  genres TEXT[],
  social JSONB,
  source_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE staged_festivals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  park_id UUID,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  website_url TEXT,
  image_url TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  source_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_festival_dates CHECK (end_date >= start_date)
);

CREATE TABLE staged_concerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID,
  venue_id UUID,
  festival_id UUID,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  ticket_required BOOLEAN DEFAULT FALSE,
  source_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for scraping runs and statistics
CREATE TABLE scraping_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'running', -- running, completed, failed
  source_count INTEGER DEFAULT 0,
  parks_found INTEGER DEFAULT 0,
  venues_found INTEGER DEFAULT 0,
  artists_found INTEGER DEFAULT 0,
  festivals_found INTEGER DEFAULT 0,
  concerts_found INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for data sources configuration
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- park, venue, artist, festival, concert, or multiple
  active BOOLEAN DEFAULT TRUE,
  scraper_config JSONB, -- Configuration for the scraper
  last_scraped TIMESTAMP WITH TIME ZONE,
  scraping_frequency TEXT DEFAULT 'weekly', -- daily, weekly, monthly
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Row Level Security for staging tables
ALTER TABLE staged_parks ENABLE ROW LEVEL SECURITY;
ALTER TABLE staged_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE staged_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE staged_festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE staged_concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for all staging tables
CREATE POLICY "Only admins can view staged_parks" ON staged_parks
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can insert staged_parks" ON staged_parks
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update staged_parks" ON staged_parks
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete staged_parks" ON staged_parks
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- (Repeat similar policies for other staging tables)
```

## 5. Implementation Plan

I recommend breaking down the implementation into the following phases:

### Phase 1: Infrastructure Setup (Week 1)

1. Set up staging tables in Supabase database
2. Create GitHub Actions workflow for scheduled triggering
3. Set up basic Netlify functions for the pipeline
4. Implement authentication for admin access

### Phase 2: Core Scraping Logic (Week 2)

1. Research and identify reliable data sources with an LLM
2. Create modular scraper functions for different source types
3. Implement data extraction and initial validation
4. Add error handling and logging

### Phase 3: Data Processing and Storage (Week 3)

1. Implement data cleaning and normalization
2. Build entity relationship mapper
3. Create duplicate detection algorithm
4. Set up staging database operations

### Phase 4: Admin Interface (Week 4)

1. Build admin dashboard for reviewing scraped data
2. Implement approve/reject functionality
3. Create batch operations for efficiency
4. Add notifications for new data

### Phase 5: Testing and Refinement (Week 5)

1. Test the full pipeline with real data sources
2. Measure performance and optimize bottlenecks
3. Implement additional validation rules
4. Document the system and create maintenance guides

## 6. Technical Components

### 6.1 GitHub Actions Workflow

```yaml
name: Data Scraping Pipeline

on:
  schedule:
    # Run every Monday at 2 AM UTC
    - cron: '0 2 * * 1'
  workflow_dispatch:
    # Allow manual triggering

jobs:
  trigger-scraping:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Trigger scraping function
        run: |
          curl -X POST ${{ secrets.NETLIFY_SCRAPER_WEBHOOK_URL }} \
          -H "Content-Type: application/json" \
          -d '{"key": "${{ secrets.SCRAPER_API_KEY }}"}'
```

### 6.2 Netlify Function: Scraper Controller

```javascript
// functions/scraper/index.js
const { createClient } = require('@supabase/supabase-js');
const parkScraper = require('./scrapers/parkScraper');
const venueScraper = require('./scrapers/venueScraper');
const artistScraper = require('./scrapers/artistScraper');
const festivalScraper = require('./scrapers/festivalScraper');
const concertScraper = require('./scrapers/concertScraper');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async function(event, context) {
  // Verify API key for security
  const requestBody = JSON.parse(event.body);
  if (requestBody.key !== process.env.SCRAPER_API_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    // Create a new scraping run record
    const { data: run, error: runError } = await supabase
      .from('scraping_runs')
      .insert([{ status: 'running' }])
      .select()
      .single();

    if (runError) throw runError;

    // Get active data sources
    const { data: sources, error: sourcesError } = await supabase
      .from('data_sources')
      .select('*')
      .eq('active', true);

    if (sourcesError) throw sourcesError;

    // Run all scrapers
    const results = {
      parks: await parkScraper.scrape(sources.filter(s => s.type === 'park' || s.type === 'multiple')),
      venues: await venueScraper.scrape(sources.filter(s => s.type === 'venue' || s.type === 'multiple')),
      artists: await artistScraper.scrape(sources.filter(s => s.type === 'artist' || s.type === 'multiple')),
      festivals: await festivalScraper.scrape(sources.filter(s => s.type === 'festival' || s.type === 'multiple')),
      concerts: await concertScraper.scrape(sources.filter(s => s.type === 'concert' || s.type === 'multiple')),
    };

    // Update scraping run with results
    await supabase
      .from('scraping_runs')
      .update({
        status: 'completed',
        end_time: new Date().toISOString(),
        parks_found: results.parks.length,
        venues_found: results.venues.length,
        artists_found: results.artists.length,
        festivals_found: results.festivals.length,
        concerts_found: results.concerts.length,
        source_count: sources.length
      })
      .eq('id', run.id);

    // Update last_scraped timestamp for data sources
    for (const source of sources) {
      await supabase
        .from('data_sources')
        .update({ last_scraped: new Date().toISOString() })
        .eq('id', source.id);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Scraping completed successfully',
        runId: run.id,
        results: {
          parks: results.parks.length,
          venues: results.venues.length,
          artists: results.artists.length,
          festivals: results.festivals.length,
          concerts: results.concerts.length
        }
      })
    };
  } catch (error) {
    console.error('Scraping error:', error);

    // Update scraping run with error
    if (run && run.id) {
      await supabase
        .from('scraping_runs')
        .update({
          status: 'failed',
          end_time: new Date().toISOString(),
          error_message: error.message
        })
        .eq('id', run.id);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Scraping failed', details: error.message })
    };
  }
};
```

### 6.3 Example Scraper Module

```javascript
// functions/scraper/scrapers/artistScraper.js
const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper for extracting data from HTML elements
const extractText = ($, selector) => $(selector).first().text().trim();

async function scrapeArtist(url, config) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract artist data based on the config selectors
    const name = extractText($, config.selectors.name);
    const description = extractText($, config.selectors.description);
    const imageUrl = $(config.selectors.image).first().attr('src');
    const websiteUrl = $(config.selectors.website).first().attr('href');
    
    // Extract genres
    const genres = [];
    $(config.selectors.genres).each((_, el) => {
      genres.push($(el).text().trim());
    });
    
    // Extract social media links
    const social = {};
    if (config.selectors.social) {
      for (const [platform, selector] of Object.entries(config.selectors.social)) {
        const link = $(selector).first().attr('href');
        if (link) social[platform] = link;
      }
    }
    
    // Return structured artist data
    return {
      name,
      description,
      image_url: imageUrl,
      website_url: websiteUrl,
      genres,
      social,
      source_url: url
    };
  } catch (error) {
    console.error(`Error scraping artist from ${url}:`, error);
    return null;
  }
}

async function scrape(sources) {
  const artists = [];
  
  for (const source of sources) {
    try {
      // Skip if no scraper config is defined
      if (!source.scraper_config || !source.scraper_config.artists) continue;
      
      const config = source.scraper_config.artists;
      
      // Handle different scraping strategies
      if (config.type === 'directList') {
        // Direct list of artist URLs
        for (const url of config.urls) {
          const artist = await scrapeArtist(url, config);
          if (artist) artists.push(artist);
        }
      } else if (config.type === 'listPage') {
        // Scrape a list page first, then each artist
        const listPageUrl = config.listPageUrl;
        const response = await axios.get(listPageUrl);
        const $ = cheerio.load(response.data);
        
        // Extract artist URLs from the list page
        const artistUrls = [];
        $(config.listItemSelector).each((_, el) => {
          const relativeUrl = $(el).attr('href');
          if (relativeUrl) {
            // Convert relative to absolute URL if needed
            const artistUrl = new URL(relativeUrl, listPageUrl).href;
            artistUrls.push(artistUrl);
          }
        });
        
        // Scrape each artist URL
        for (const url of artistUrls) {
          const artist = await scrapeArtist(url, config);
          if (artist) artists.push(artist);
        }
      }
    } catch (error) {
      console.error(`Error processing source ${source.name}:`, error);
    }
  }
  
  // Store in staging table
  if (artists.length > 0) {
    const { data, error } = await supabase
      .from('staged_artists')
      .insert(artists);
      
    if (error) {
      console.error('Error storing artists in staging table:', error);
    }
  }
  
  return artists;
}

module.exports = { scrape };
```

### 6.4 Admin Review API

```javascript
// functions/api/admin/reviewData.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async function(event, context) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  // Get request body
  const requestBody = JSON.parse(event.body);
  
  // Verify JWT token
  try {
    // Extract token from authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token and check if user is admin
    const { data: user, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }
    
    // Check if user has admin role
    const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
    
    if (!isAdmin) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };
    }
    
    // Process the review action
    const { table, id, action, notes } = requestBody;
    
    // Validate input
    if (!table || !id || !action || !['approve', 'reject'].includes(action)) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Invalid request parameters' }) 
      };
    }
    
    // Update staging record status
    const { error: updateError } = await supabase
      .from(`staged_${table}`)
      .update({ 
        status: action === 'approve' ? 'approved' : 'rejected',
        review_notes: notes || null
      })
      .eq('id', id);
    
    if (updateError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to update record', details: updateError }) 
      };
    }
    
    // If approved, insert or update in production table
    if (action === 'approve') {
      // Get the staged record
      const { data: stagedRecord, error: fetchError } = await supabase
        .from(`staged_${table}`)
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        return { 
          statusCode: 500, 
          body: JSON.stringify({ error: 'Failed to fetch staged record', details: fetchError }) 
        };
      }
      
      // Prepare record for production by removing staging-specific fields
      const productionRecord = { ...stagedRecord };
      delete productionRecord.id;
      delete productionRecord.status;
      delete productionRecord.review_notes;
      delete productionRecord.source_url;
      
      // Insert into production table
      const { error: insertError } = await supabase
        .from(table)
        .insert([productionRecord]);
      
      if (insertError) {
        return { 
          statusCode: 500, 
          body: JSON.stringify({ error: 'Failed to insert into production', details: insertError }) 
        };
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `Record ${action === 'approve' ? 'approved and published' : 'rejected'}` 
      })
    };
    
  } catch (error) {
    console.error('Error processing review:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};
```

## 7. Admin Interface Design

For the admin verification interface, we'll need to add a new UI component to the existing React application. Here's a simplified design proposal:

### 7.1 Admin Dashboard Component

```jsx
// src/components/pages/AdminDataReviewPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import {
  TabNav,
  DataTable,
  Spinner,
  Button,
  Alert,
  Modal,
  TextField
} from '../atoms';

const AdminDataReviewPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('artists');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionType, setActionType] = useState('');

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
      
      if (!isAdmin) {
        navigate('/');
      }
    };
    
    checkAdmin();
  }, [navigate]);

  // Load data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from(`staged_${activeTab}`)
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setData(data);
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  const handleReview = async (action) => {
    try {
      const response = await fetch('/.netlify/functions/api/admin/reviewData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
        },
        body: JSON.stringify({
          table: activeTab,
          id: selectedItem.id,
          action,
          notes: reviewNotes
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process review');
      }
      
      // Remove the item from the list
      setData(data.filter(item => item.id !== selectedItem.id));
      setShowModal(false);
      setSelectedItem(null);
      setReviewNotes('');
    } catch (err) {
      console.error('Review error:', err);
      setError(err.message);
    }
  };

  const openModal = (item, action) => {
    setSelectedItem(item);
    setActionType(action);
    setShowModal(true);
  };

  // Render appropriate data table based on active tab
  const renderDataTable = () => {
    if (loading) return <Spinner />;
    if (error) return <Alert type="error" message={error} />;
    if (data.length === 0) return <Alert type="info" message={`No pending ${activeTab} to review`} />;

    // Different columns based on data type
    const getColumns = () => {
      switch (activeTab) {
        case 'artists':
          return [
            { header: 'Name', accessor: 'name' },
            { header: 'Genres', accessor: row => row.genres?.join(', ') || 'N/A' },
            { header: 'Source', accessor: 'source_url', isLink: true },
            { header: 'Created', accessor: row => new Date(row.created_at).toLocaleString() },
            { 
              header: 'Actions', 
              accessor: row => (
                <div className="flex space-x-2">
                  <Button variant="success" onClick={() => openModal(row, 'approve')}>Approve</Button>
                  <Button variant="danger" onClick={() => openModal(row, 'reject')}>Reject</Button>
                </div>
              )
            }
          ];
        case 'festivals':
          return [
            { header: 'Name', accessor: 'name' },
            { header: 'Dates', accessor: row => `${row.start_date} to ${row.end_date}` },
            { header: 'Source', accessor: 'source_url', isLink: true },
            { header: 'Created', accessor: row => new Date(row.created_at).toLocaleString() },
            { 
              header: 'Actions', 
              accessor: row => (
                <div className="flex space-x-2">
                  <Button variant="success" onClick={() => openModal(row, 'approve')}>Approve</Button>
                  <Button variant="danger" onClick={() => openModal(row, 'reject')}>Reject</Button>
                </div>
              )
            }
          ];
        // Similar patterns for concerts, venues, parks
        default:
          return [];
      }
    };

    return (
      <DataTable
        columns={getColumns()}
        data={data}
        keyField="id"
      />
    );
  };

  return (
    <div className="admin-review-page p-4">
      <h1 className="text-2xl font-bold mb-4">Data Review Dashboard</h1>
      
      <TabNav
        tabs={[
          { id: 'artists', label: 'Artists' },
          { id: 'festivals', label: 'Festivals' },
          { id: 'concerts', label: 'Concerts' },
          { id: 'venues', label: 'Venues' },
          { id: 'parks', label: 'Parks' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="mt-4">
        {renderDataTable()}
      </div>
      
      {/* Review Modal */}
      {showModal && selectedItem && (
        <Modal
          title={`${actionType === 'approve' ? 'Approve' : 'Reject'} ${activeTab.slice(0, -1)}`}
          onClose={() => setShowModal(false)}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold">{selectedItem.name}</h2>
            
            <div className="my-4">
              <TextField
                label="Review Notes"
                placeholder="Add optional notes about this review decision"
                multiline
                rows={4}
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button 
                variant={actionType === 'approve' ? 'success' : 'danger'}
                onClick={() => handleReview(actionType)}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDataReviewPage;
```

## 8. Scraper Modules Implementation

### 8.1 Core Scraper Structure

We'll need to create modular scrapers for each entity type. Here's a template for the festival scraper:

```javascript
// functions/scraper/scrapers/festivalScraper.js
const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const { cleanText, validateDate } = require('../utils/dataUtils');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to scrape festival data from HTML page
async function scrapeFestivalPage(url, config) {
  try {
    console.log(`Scraping festival data from: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract festival details based on selectors in config
    const name = cleanText($(config.selectors.name).first().text());
    const description = cleanText($(config.selectors.description).first().text());
    const imageUrl = $(config.selectors.image).first().attr('src');
    const websiteUrl = $(config.selectors.website).first().attr('href');
    
    // Extract dates with validation
    let startDate = cleanText($(config.selectors.startDate).first().text());
    let endDate = cleanText($(config.selectors.endDate).first().text());
    
    // Validate and format dates (YYYY-MM-DD)
    startDate = validateDate(startDate, config.dateFormat);
    endDate = validateDate(endDate, config.dateFormat);
    
    // Check if we have valid dates
    if (!startDate || !endDate) {
      console.warn(`Invalid dates found for festival at ${url}`);
      return null;
    }
    
    // Extract park information if available
    let parkId = null;
    const parkName = config.selectors.parkName ? 
      cleanText($(config.selectors.parkName).first().text()) : null;
    
    if (parkName) {
      // Look up park by name
      const { data: park } = await supabase
        .from('parks')
        .select('id')
        .ilike('name', parkName)
        .maybeSingle();
      
      if (park) {
        parkId = park.id;
      }
    }
    
    return {
      name,
      description,
      park_id: parkId,
      start_date: startDate,
      end_date: endDate,
      website_url: websiteUrl,
      image_url: imageUrl,
      recurring: config.recurring || false,
      source_url: url
    };
  } catch (error) {
    console.error(`Error scraping festival from ${url}:`, error);
    return null;
  }
}

// Main scraping function
async function scrape(sources) {
  console.log(`Running festival scraper on ${sources.length} sources`);
  const festivals = [];
  
  for (const source of sources) {
    try {
      if (!source.scraper_config || !source.scraper_config.festivals) {
        continue;
      }
      
      const config = source.scraper_config.festivals;
      
      // Different scraping strategies based on source configuration
      if (config.type === 'directList') {
        // Direct list of festival URLs
        for (const url of config.urls) {
          const festival = await scrapeFestivalPage(url, config);
          if (festival) festivals.push(festival);
        }
      } else if (config.type === 'listPage') {
        // Festival list page that needs to be scraped for festival URLs
        const response = await axios.get(config.listUrl);
        const $ = cheerio.load(response.data);
        
        // Extract festival URLs
        const festivalUrls = [];
        $(config.listItemSelector).each((_, el) => {
          const href = $(el).attr('href');
          if (href) {
            // Convert relative URL to absolute if needed
            const fullUrl = href.startsWith('http') ? 
              href : new URL(href, config.listUrl).href;
            festivalUrls.push(fullUrl);
          }
        });
        
        // Scrape each festival page
        for (const url of festivalUrls) {
          const festival = await scrapeFestivalPage(url, config);
          if (festival) festivals.push(festival);
        }
      }
    } catch (error) {
      console.error(`Error processing source ${source.name}:`, error);
    }
  }
  
  // Store festivals in staging table
  if (festivals.length > 0) {
    console.log(`Storing ${festivals.length} festivals in staging table`);
    
    // Insert in batches to handle large datasets
    const batchSize = 50;
    for (let i = 0; i < festivals.length; i += batchSize) {
      const batch = festivals.slice(i, i + batchSize);
      const { error } = await supabase
        .from('staged_festivals')
        .insert(batch);
        
      if (error) {
        console.error('Error storing festivals in staging table:', error);
      }
    }
  }
  
  return festivals;
}

module.exports = { scrape };
```

### 8.2 Data Processing Utilities

```javascript
// functions/scraper/utils/dataUtils.js

// Clean text by removing extra whitespace, newlines, etc.
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/[\r\n\t]+/g, ' ')  // Replace newlines and tabs with spaces
    .replace(/\s{2,}/g, ' ')     // Collapse multiple spaces into one
    .trim();                     // Remove leading/trailing whitespace
}

// Validate and standardize date format (YYYY-MM-DD)
function validateDate(dateStr, format = 'MM/DD/YYYY') {
  if (!dateStr) return null;
  
  // Remove any extraneous text (e.g., "Date: 05/15/2023")
  dateStr = dateStr.replace(/^.*?(\d)/, '$1');
  
  // Try parsing with luxon or other date library
  let parsedDate;
  
  try {
    // This is a simplified example - in production, use a robust date library
    const parts = dateStr.match(/(\d{1,4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,4})/);
    
    if (!parts) return null;
    
    // Parse based on expected format
    let year, month, day;
    
    if (format === 'MM/DD/YYYY') {
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
      year = parseInt(parts[3], 10);
    } else if (format === 'YYYY-MM-DD') {
      year = parseInt(parts[1], 10);
      month = parseInt(parts[2], 10);
      day = parseInt(parts[3], 10);
    } else {
      // Default to MM/DD/YYYY
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
      year = parseInt(parts[3], 10);
    }
    
    // Handle 2-digit years
    if (year < 100) {
      year += year < 50 ? 2000 : 1900;
    }
    
    // Validate date components
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    if (year < 2000 || year > 2100) return null;
    
    // Format as YYYY-MM-DD
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error(`Error parsing date "${dateStr}":`, error);
    return null;
  }
}

// Deduplicate items based on a key
function deduplicateItems(items, key = 'name') {
  const seen = new Set();
  return items.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

// Find matching entity in database
async function findMatchingEntity(supabase, table, item, fields = ['name']) {
  try {
    let query = supabase.from(table).select('id');
    
    // Add filters for each field
    for (const field of fields) {
      if (item[field]) {
        query = query.eq(field, item[field]);
      }
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) throw error;
    return data ? data.id : null;
  } catch (error) {
    console.error(`Error finding matching ${table}:`, error);
    return null;
  }
}

module.exports = {
  cleanText,
  validateDate,
  deduplicateItems,
  findMatchingEntity
};
```

## 9. Netlify Function Configuration

We need to update `netlify.toml` to configure our Netlify Functions with appropriate environment variables and schedule:

```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "functions"

# Production context
[context.production]
  environment = { NODE_ENV = "production" }

# Deploy Preview context
[context.deploy-preview]
  environment = { NODE_ENV = "production" }

# Branch Deploy context
[context.branch-deploy]
  environment = { NODE_ENV = "production" }

# Dev context
[context.develop]
  environment = { NODE_ENV = "development" }

# Redirects for SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Enable larger payload size for functions
[functions]
  node_bundler = "esbuild"
  included_files = ["functions/scraper/scrapers/**", "functions/scraper/utils/**"]

# Admin API endpoints
[[redirects]]
  from = "/api/admin/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
  force = true
  conditions = {Role = ["admin"]}

# Scheduled function (alternative to GitHub Actions)
# Note: This is a Netlify Pro/Enterprise feature
# [scheduled-functions.scraper]
#   handler = "functions/scraper/index.js"
#   schedule = "@weekly"
```

## 10. LLM-Assisted Data Source Identification

We'll create a separate script to use an LLM to identify reliable data sources:

```javascript
// scripts/identify-data-sources.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// LLM API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = 'gpt-4';

async function queryLLM(prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw error;
  }
}

async function findArtistDataSources() {
  const prompt = `
  I need to find reliable websites to scrape data about music artists performing at theme parks in Orlando, Florida.

  Please identify 5-10 websites that:
  1. Contain up-to-date information about artists performing at Disney World, Universal Studios, SeaWorld, and other Orlando theme parks
  2. Have well-structured HTML that would be suitable for web scraping
  3. Update regularly with new performance schedules
  4. Include artist details like bio, image, genres, etc.
  
  For each website, provide:
  - Website URL
  - Description of what information is available
  - How frequently it appears to update
  - What HTML selectors might be useful for scraping (e.g., CSS classes for artist names, dates, etc.)
  - Any potential challenges with scraping this source
  
  Format your response as a JSON array with one object per source.
  `;
  
  const result = await queryLLM(prompt);
  let sources;
  
  try {
    sources = JSON.parse(result);
  } catch (error) {
    console.error('Error parsing LLM response as JSON:', error);
    console.log('Raw LLM response:', result);
    return [];
  }
  
  return sources;
}

async function findFestivalDataSources() {
  // Similar implementation for festivals
  // ...
}

async function main() {
  try {
    console.log('Finding artist data sources...');
    const artistSources = await findArtistDataSources();
    
    console.log('Finding festival data sources...');
    const festivalSources = await findFestivalDataSources();
    
    // More entity types...
    
    // Combine all sources
    const allSources = [
      ...artistSources.map(s => ({ ...s, type: 'artist' })),
      ...festivalSources.map(s => ({ ...s, type: 'festival' })),
      // ...
    ];
    
    // Save to JSON file
    fs.writeFileSync(
      path.join(__dirname, 'data-sources.json'),
      JSON.stringify(allSources, null, 2)
    );
    
    console.log(`Saved ${allSources.length} data sources to data-sources.json`);
    
    // Optionally insert into database
    for (const source of allSources) {
      const { error } = await supabase
        .from('data_sources')
        .insert({
          name: source.name,
          url: source.url,
          type: source.type,
          scraper_config: {
            selectors: source.selectors,
            updateFrequency: source.updateFrequency
          },
          notes: source.description
        });
        
      if (error) {
        console.error(`Error inserting source ${source.name}:`, error);
      }
    }
    
    console.log('Data sources added to database');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main();
```

## 11. Integration with Mobile-First Design

Since mobile-first design is a priority for the EncoreLando project, we need to ensure that our data scraping implementation aligns with this approach:

1. **Admin Interface Mobile Optimization**
   - The admin dashboard will use responsive design principles
   - Touch-friendly UI elements for approving/rejecting data
   - Bottom navigation for key actions on mobile
   - Collapsible sections for data review on smaller screens

2. **Performance Considerations**
   - Scraping runs will be scheduled during off-peak hours
   - Data processing will be optimized to minimize database load
   - Admin interface will implement lazy loading and pagination

3. **Progressive Enhancement**
   - Basic functionality will work on all devices
   - Additional features (like bulk operations) on larger screens
   - Notifications will be designed for mobile viewing

## 12. Deployment Strategy

We'll implement a phased deployment approach:

1. **Phase 1: Infrastructure Setup**
   - Deploy database schema changes
   - Configure Netlify Functions
   - Set up GitHub Actions workflow

2. **Phase 2: Initial Scraping Test**
   - Implement and deploy one scraper (e.g., for artists)
   - Run manually and verify results
   - Refine based on findings

3. **Phase 3: Admin Interface**
   - Deploy the admin review interface
   - Test approval/rejection workflow
   - Implement feedback loop

4. **Phase 4: Full Deployment**
   - Deploy all scrapers
   - Enable scheduled runs
   - Monitor and optimize

## 13. Monitoring and Maintenance

To ensure long-term sustainability, we'll implement:

1. **Logging and Alerting**
   - Detailed logs for each scraping run
   - Error notifications via email
   - Performance metrics

2. **Source Health Checks**
   - Automated checks for data source availability
   - Alerts when sources change structure
   - Periodic source validation

3. **Documentation**
   - Comprehensive system documentation
   - Troubleshooting guide
   - Source addition guide

## 14. Conclusion and Next Steps

Based on my analysis of the EncoreLando project and your requirements, I've outlined a comprehensive plan for implementing automated data scraping that aligns with your existing infrastructure and mobile-first approach.

### Immediate Next Steps:

1. **Validate Database Schema Changes**
   - Review the proposed staging tables
   - Implement them in Supabase

2. **Create GitHub Actions Workflow**
   - Set up the scheduled trigger
   - Configure environment variables

3. **Implement Core Scraper Logic**
   - Start with a single entity type (e.g., artists or festivals)
   - Use the LLM-based source identification
   - Create data extraction and validation

4. **Build Admin Review Interface**
   - Implement the staging data review component
   - Test the approval/rejection workflow

Is there a specific aspect of this plan you'd like to focus on first? Or would you like me to make adjustments to any part of the proposed implementation?