const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const { cleanText, deduplicateItems } = require('../utils/dataUtils');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Scrape artist data from a single URL
 * @param {string} url - URL to scrape
 * @param {Object} config - Scraper configuration
 * @returns {Promise<Object|null>} Artist data or null if scraping failed
 */
async function scrapeArtist(url, config) {
  try {
    console.log(`Scraping artist from ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract artist data based on selectors
    const name = cleanText($(config.selectors.name).first().text());

    // Skip if no valid name found
    if (!name) {
      console.warn(`No valid artist name found at ${url}`);
      return null;
    }

    const description = cleanText($(config.selectors.description).first().text());

    // Get image URL
    let imageUrl = null;
    if (config.selectors.image) {
      const imgElement = $(config.selectors.image).first();
      imageUrl = imgElement.attr('src') || imgElement.attr('data-src');

      // Convert relative URL to absolute if needed
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = new URL(imageUrl, url).href;
      }
    }

    // Get website URL
    let websiteUrl = null;
    if (config.selectors.website) {
      const linkElement = $(config.selectors.website).first();
      websiteUrl = linkElement.attr('href');

      // Convert relative URL to absolute if needed
      if (websiteUrl && !websiteUrl.startsWith('http')) {
        websiteUrl = new URL(websiteUrl, url).href;
      }
    }

    // Extract genres
    const genres = [];
    if (config.selectors.genres) {
      $(config.selectors.genres).each((_, el) => {
        const genre = cleanText($(el).text());
        if (genre) genres.push(genre);
      });
    }

    // Extract social media links
    const social = {};
    if (config.selectors.social) {
      for (const [platform, selector] of Object.entries(config.selectors.social)) {
        const linkElement = $(selector).first();
        const link = linkElement.attr('href');
        if (link) social[platform] = link;
      }
    }

    // Return structured artist data
    return {
      name,
      description: description || null,
      image_url: imageUrl,
      website_url: websiteUrl,
      genres: genres.length > 0 ? genres : null,
      social: Object.keys(social).length > 0 ? social : null,
      source_url: url,
    };
  } catch (error) {
    console.error(`Error scraping artist from ${url}:`, error);
    return null;
  }
}

/**
 * Main scraping function for artists
 * @param {Array} sources - Data sources to scrape
 * @returns {Promise<Array>} Scraped artist data
 */
async function scrape(sources) {
  console.log(`Running artist scraper on ${sources.length} sources`);
  const artists = [];

  for (const source of sources) {
    try {
      // Skip if no scraper config is defined
      if (!source.scraper_config || !source.scraper_config.artists) {
        console.log(`Skipping source ${source.name} - no artist scraper config`);
        continue;
      }

      const config = source.scraper_config.artists;
      console.log(`Processing source: ${source.name}`);

      // Different scraping strategies based on source type
      if (config.type === 'directList') {
        // Direct list of artist URLs
        for (const url of config.urls) {
          const artist = await scrapeArtist(url, config);
          if (artist) artists.push(artist);
        }
      } else if (config.type === 'listPage') {
        // Scrape a list page first, then each artist
        const listPageUrl = config.listPageUrl;
        console.log(`Scraping list page: ${listPageUrl}`);

        const response = await axios.get(listPageUrl);
        const $ = cheerio.load(response.data);

        // Extract artist URLs from the list page
        const artistUrls = [];
        $(config.listItemSelector).each((_, el) => {
          const relativeUrl = $(el).attr('href');
          if (relativeUrl) {
            // Convert relative to absolute URL if needed
            const artistUrl = relativeUrl.startsWith('http')
              ? relativeUrl
              : new URL(relativeUrl, listPageUrl).href;
            artistUrls.push(artistUrl);
          }
        });

        console.log(`Found ${artistUrls.length} artist URLs to scrape`);

        // Scrape each artist URL (with rate limiting)
        for (let i = 0; i < artistUrls.length; i++) {
          const url = artistUrls[i];
          const artist = await scrapeArtist(url, config);
          if (artist) artists.push(artist);

          // Simple rate limiting to avoid overwhelming the server
          if (i < artistUrls.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
          }
        }
      } else if (config.type === 'apiEndpoint') {
        // Scrape from an API endpoint
        console.log(`Fetching from API: ${source.url}`);

        const response = await axios.get(source.url, {
          headers: config.headers || {},
        });

        if (response.data) {
          // Extract artists from API response using JSONPath
          const rawArtists = config.jsonPath
            ? getValueByPath(response.data, config.jsonPath)
            : response.data;

          if (Array.isArray(rawArtists)) {
            // Map API data to our schema
            for (const rawArtist of rawArtists) {
              const artist = {
                name: getValueByPath(rawArtist, config.mapping.name),
                description: getValueByPath(rawArtist, config.mapping.description),
                image_url: getValueByPath(rawArtist, config.mapping.image_url),
                website_url: getValueByPath(rawArtist, config.mapping.website_url),
                genres: getValueByPath(rawArtist, config.mapping.genres),
                social: getValueByPath(rawArtist, config.mapping.social),
                source_url: source.url,
              };

              if (artist.name) {
                artists.push(artist);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error processing source ${source.name}:`, error);
    }
  }

  // Deduplicate artists by name
  const uniqueArtists = deduplicateItems(artists, 'name');
  console.log(`Found ${uniqueArtists.length} unique artists from ${artists.length} total`);

  // Store in staging table
  if (uniqueArtists.length > 0) {
    try {
      console.log(`Storing ${uniqueArtists.length} artists in staging table`);

      // Insert in batches to avoid exceeding request size limits
      const batchSize = 25;
      for (let i = 0; i < uniqueArtists.length; i += batchSize) {
        const batch = uniqueArtists.slice(i, i + batchSize);
        const { error } = await supabase.from('staged_artists').insert(batch);

        if (error) {
          console.error('Error storing artists batch in staging table:', error);
        }
      }
    } catch (error) {
      console.error('Error storing artists in staging table:', error);
    }
  }

  return uniqueArtists;
}

/**
 * Helper function to get a value from an object by path
 * @param {Object} obj - Object to get value from
 * @param {string} path - Path to value (e.g., "data.items[0].name")
 * @returns {any} Value at path or null
 */
function getValueByPath(obj, path) {
  if (!obj || !path) return null;

  try {
    const parts = path.replace(/\[(\w+)\]/g, '.$1').split('.');
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) return null;
      current = current[part];
    }

    return current;
  } catch (error) {
    console.error(`Error getting value by path "${path}":`, error);
    return null;
  }
}

module.exports = { scrape };
