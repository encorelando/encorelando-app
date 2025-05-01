require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// LLM API configuration - update with your preferred LLM provider
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4'; // Or other model as appropriate

/**
 * Query LLM for data source recommendations
 * @param {string} prompt - Prompt for the LLM
 * @returns {Promise<string>} LLM response
 */
async function queryLLM(prompt) {
  try {
    console.log('Querying LLM...');

    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('Invalid response from LLM API');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling LLM API:', error.message);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    throw error;
  }
}

/**
 * Find artist data sources using LLM
 * @returns {Promise<Array>} Array of artist data sources
 */
async function findArtistDataSources() {
  console.log('Finding artist data sources...');

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
  
  Format your response as a JSON array with one object per source, using this exact structure:
  [
    {
      "name": "Website Name",
      "url": "https://example.com",
      "description": "Description of the website and its content",
      "updateFrequency": "daily/weekly/monthly",
      "selectors": {
        "name": ".artist-name",
        "description": ".artist-bio",
        "image": ".artist-image img",
        "website": ".artist-website a",
        "genres": ".artist-genre",
        "social": {
          "instagram": ".social-instagram a",
          "twitter": ".social-twitter a",
          "facebook": ".social-facebook a"
        }
      },
      "scrapeStrategy": "listPage",
      "listPageUrl": "https://example.com/artists",
      "listItemSelector": ".artist-item a",
      "challenges": "Potential rate limiting, dynamic content loading with JavaScript"
    }
  ]
  `;

  const result = await queryLLM(prompt);
  let sources;

  try {
    // Extract JSON from response (in case there's explanatory text)
    const jsonMatch = result.match(/\[\s*\{[\s\S]*\}\s*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : result;
    sources = JSON.parse(jsonStr);

    console.log(`Found ${sources.length} artist data sources`);
    return sources;
  } catch (error) {
    console.error('Error parsing LLM response as JSON:', error);
    console.log('Raw LLM response:', result);
    return [];
  }
}

/**
 * Find festival data sources using LLM
 * @returns {Promise<Array>} Array of festival data sources
 */
async function findFestivalDataSources() {
  console.log('Finding festival data sources...');

  const prompt = `
  I need to find reliable websites to scrape data about music festivals and special events at theme parks in Orlando, Florida.

  Please identify 5-10 websites that:
  1. Contain up-to-date information about festivals and special events at Disney World, Universal Studios, SeaWorld, and other Orlando theme parks
  2. Have well-structured HTML that would be suitable for web scraping
  3. Update regularly with new festival schedules
  4. Include festival details like dates, description, images, etc.
  
  For each website, provide:
  - Website URL
  - Description of what information is available
  - How frequently it appears to update
  - What HTML selectors might be useful for scraping (e.g., CSS classes for festival names, dates, etc.)
  - Any potential challenges with scraping this source
  
  Format your response as a JSON array with one object per source, using this exact structure:
  [
    {
      "name": "Website Name",
      "url": "https://example.com",
      "description": "Description of the website and its content",
      "updateFrequency": "daily/weekly/monthly",
      "selectors": {
        "name": ".festival-name",
        "description": ".festival-description",
        "image": ".festival-image img",
        "website": ".festival-website a",
        "startDate": ".festival-start-date",
        "endDate": ".festival-end-date",
        "parkName": ".venue-name"
      },
      "dateFormat": "MM/DD/YYYY",
      "recurring": false,
      "scrapeStrategy": "listPage",
      "listPageUrl": "https://example.com/festivals",
      "listItemSelector": ".festival-item a",
      "challenges": "Seasonal information may be limited, JavaScript rendering required"
    }
  ]
  `;

  const result = await queryLLM(prompt);
  let sources;

  try {
    // Extract JSON from response (in case there's explanatory text)
    const jsonMatch = result.match(/\[\s*\{[\s\S]*\}\s*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : result;
    sources = JSON.parse(jsonStr);

    console.log(`Found ${sources.length} festival data sources`);
    return sources;
  } catch (error) {
    console.error('Error parsing LLM response as JSON:', error);
    console.log('Raw LLM response:', result);
    return [];
  }
}

/**
 * Find concert data sources using LLM
 * @returns {Promise<Array>} Array of concert data sources
 */
async function findConcertDataSources() {
  console.log('Finding concert data sources...');

  const prompt = `
  I need to find reliable websites to scrape data about concerts and performances at theme parks in Orlando, Florida.

  Please identify 5-10 websites that:
  1. Contain up-to-date information about performance schedules at Disney World, Universal Studios, SeaWorld, and other Orlando theme parks
  2. Have well-structured HTML that would be suitable for web scraping
  3. Update regularly with new concert schedules
  4. Include concert details like artist, venue, time, etc.
  
  For each website, provide:
  - Website URL
  - Description of what information is available
  - How frequently it appears to update
  - What HTML selectors might be useful for scraping (e.g., CSS classes for concert names, times, etc.)
  - Any potential challenges with scraping this source
  
  Format your response as a JSON array with one object per source, using this exact structure:
  [
    {
      "name": "Website Name",
      "url": "https://example.com",
      "description": "Description of the website and its content",
      "updateFrequency": "daily/weekly/monthly",
      "selectors": {
        "artist": ".concert-artist",
        "venue": ".concert-venue",
        "startTime": ".concert-start-time",
        "endTime": ".concert-end-time",
        "notes": ".concert-notes",
        "festival": ".concert-festival",
        "ticketRequired": ".ticket-info"
      },
      "dateTimeFormat": "MM/DD/YYYY hh:mm a",
      "scrapeStrategy": "listPage",
      "listPageUrl": "https://example.com/concerts",
      "listItemSelector": ".concert-item",
      "challenges": "Need to match concerts with existing artists and venues in database"
    }
  ]
  `;

  const result = await queryLLM(prompt);
  let sources;

  try {
    // Extract JSON from response (in case there's explanatory text)
    const jsonMatch = result.match(/\[\s*\{[\s\S]*\}\s*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : result;
    sources = JSON.parse(jsonStr);

    console.log(`Found ${sources.length} concert data sources`);
    return sources;
  } catch (error) {
    console.error('Error parsing LLM response as JSON:', error);
    console.log('Raw LLM response:', result);
    return [];
  }
}

/**
 * Main function to run the data source identification
 */
async function main() {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Find data sources for each entity type
    const artistSources = await findArtistDataSources();
    const festivalSources = await findFestivalDataSources();
    const concertSources = await findConcertDataSources();

    // Combine all sources
    const allSources = [
      ...artistSources.map(s => ({ ...s, type: 'artist' })),
      ...festivalSources.map(s => ({ ...s, type: 'festival' })),
      ...concertSources.map(s => ({ ...s, type: 'concert' })),
    ];

    // Save to JSON file
    const outputPath = path.join(outputDir, 'data-sources.json');
    fs.writeFileSync(outputPath, JSON.stringify(allSources, null, 2));

    console.log(`Saved ${allSources.length} data sources to ${outputPath}`);

    // Check if we have Supabase credentials
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Supabase credentials not found. Skipping database insertion.');
      return;
    }

    // Ask for confirmation before inserting into database
    console.log(`Ready to insert ${allSources.length} data sources into Supabase.`);
    // In a real implementation, you would prompt for confirmation here

    // Insert data sources into Supabase
    console.log('Inserting data sources into Supabase...');
    let successCount = 0;

    for (const source of allSources) {
      // Convert source to database format
      const dbSource = {
        name: source.name,
        url: source.url,
        type: source.type,
        active: true,
        scraper_config: {
          type: source.scrapeStrategy || 'listPage',
          selectors: source.selectors,
          listPageUrl: source.listPageUrl,
          listItemSelector: source.listItemSelector,
          dateFormat: source.dateFormat,
          dateTimeFormat: source.dateTimeFormat,
          recurring: source.recurring || false,
          challenges: source.challenges,
          urls: source.urls,
        },
        scraping_frequency: source.updateFrequency || 'weekly',
        notes: source.description,
      };

      // Insert into database
      const { error } = await supabase.from('data_sources').insert(dbSource);

      if (error) {
        console.error(`Error inserting source "${source.name}":`, error);
      } else {
        successCount++;
      }
    }

    console.log(
      `Successfully inserted ${successCount} of ${allSources.length} data sources into Supabase`
    );
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
}

module.exports = {
  findArtistDataSources,
  findFestivalDataSources,
  findConcertDataSources,
};
