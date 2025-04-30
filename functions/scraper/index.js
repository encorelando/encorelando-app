require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Main scraper function triggered by GitHub Actions
 * This is the entry point for the data scraping pipeline
 */
exports.handler = async function(event, context) {
  // Parse request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  // Extract parameters
  const runId = body.runId;
  const type = body.type || 'all';
  const forceUpdate = body.forceUpdate || false;

  console.log(`Starting scraping run ${runId} for type: ${type}, forceUpdate: ${forceUpdate}`);

  try {
    // Validate the scraping run exists
    const { data: run, error: runError } = await supabase
      .from('scraping_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (runError || !run) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Scraping run not found' })
      };
    }

    // Get active data sources based on type
    let sourcesQuery = supabase
      .from('data_sources')
      .select('*')
      .eq('active', true);

    // Filter by type if not 'all'
    if (type !== 'all') {
      sourcesQuery = sourcesQuery.or(`type.eq.${type},type.eq.multiple`);
    }

    // Get data sources
    const { data: sources, error: sourcesError } = await sourcesQuery;

    if (sourcesError) {
      throw sourcesError;
    }

    console.log(`Found ${sources.length} active data sources to scrape`);

    // Check if sources should be updated based on last_scraped timestamp
    const sourcesToScrape = forceUpdate 
      ? sources 
      : sources.filter(source => {
          // Skip if scraped within the frequency period
          if (!source.last_scraped) return true;
          
          const lastScraped = new Date(source.last_scraped);
          const now = new Date();
          
          // Calculate difference in days
          const diffDays = Math.floor((now - lastScraped) / (1000 * 60 * 60 * 24));
          
          switch (source.scraping_frequency) {
            case 'daily':
              return diffDays >= 1;
            case 'weekly':
              return diffDays >= 7;
            case 'monthly':
              return diffDays >= 30;
            default:
              return diffDays >= 7; // Default to weekly
          }
        });

    console.log(`${sourcesToScrape.length} sources need to be scraped`);

    // Update the scraping run with source count
    await supabase
      .from('scraping_runs')
      .update({
        source_count: sourcesToScrape.length,
        status: 'processing'
      })
      .eq('id', runId);

    // Import scrapers here - these will be implemented later
    /*
    const parkScraper = require('./scrapers/parkScraper');
    const venueScraper = require('./scrapers/venueScraper');
    const artistScraper = require('./scrapers/artistScraper');
    const festivalScraper = require('./scrapers/festivalScraper');
    const concertScraper = require('./scrapers/concertScraper');

    // Run scrapers based on type
    const results = {};

    if (type === 'all' || type === 'parks') {
      console.log('Running park scraper');
      results.parks = await parkScraper.scrape(
        sourcesToScrape.filter(s => s.type === 'park' || s.type === 'multiple')
      );
    }

    if (type === 'all' || type === 'venues') {
      console.log('Running venue scraper');
      results.venues = await venueScraper.scrape(
        sourcesToScrape.filter(s => s.type === 'venue' || s.type === 'multiple')
      );
    }

    if (type === 'all' || type === 'artists') {
      console.log('Running artist scraper');
      results.artists = await artistScraper.scrape(
        sourcesToScrape.filter(s => s.type === 'artist' || s.type === 'multiple')
      );
    }

    if (type === 'all' || type === 'festivals') {
      console.log('Running festival scraper');
      results.festivals = await festivalScraper.scrape(
        sourcesToScrape.filter(s => s.type === 'festival' || s.type === 'multiple')
      );
    }

    if (type === 'all' || type === 'concerts') {
      console.log('Running concert scraper');
      results.concerts = await concertScraper.scrape(
        sourcesToScrape.filter(s => s.type === 'concert' || s.type === 'multiple')
      );
    }
    */

    // Placeholder for scraping results until scrapers are implemented
    const results = {
      parks: [],
      venues: [],
      artists: [],
      festivals: [],
      concerts: []
    };

    // Update scraping run with results
    await supabase
      .from('scraping_runs')
      .update({
        status: 'completed',
        end_time: new Date().toISOString(),
        parks_found: results.parks?.length || 0,
        venues_found: results.venues?.length || 0,
        artists_found: results.artists?.length || 0,
        festivals_found: results.festivals?.length || 0,
        concerts_found: results.concerts?.length || 0
      })
      .eq('id', runId);

    // Update last_scraped timestamp for sources
    for (const source of sourcesToScrape) {
      await supabase
        .from('data_sources')
        .update({ last_scraped: new Date().toISOString() })
        .eq('id', source.id);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Scraping completed successfully',
        runId: runId,
        results: {
          sources: sourcesToScrape.length,
          parks: results.parks?.length || 0,
          venues: results.venues?.length || 0,
          artists: results.artists?.length || 0,
          festivals: results.festivals?.length || 0,
          concerts: results.concerts?.length || 0
        }
      })
    };
  } catch (error) {
    console.error('Scraping error:', error);

    // Update scraping run with error
    await supabase
      .from('scraping_runs')
      .update({
        status: 'failed',
        end_time: new Date().toISOString(),
        error_message: error.message
      })
      .eq('id', runId);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Scraping failed', details: error.message })
    };
  }
};
