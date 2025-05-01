require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Create a new scraping run record
 * Used by the GitHub Actions workflow to initialize a run
 */
// eslint-disable-next-line no-unused-vars
exports.handler = async function (event, context) {
  try {
    // Create a new scraping run record
    const { data, error } = await supabase
      .from('scraping_runs')
      .insert([
        {
          status: 'initializing',
          start_time: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating scraping run:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create scraping run' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Scraping run created',
        id: data.id,
      }),
    };
  } catch (error) {
    console.error('Error in create-scraping-run:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
