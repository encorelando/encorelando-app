require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Simple function to test Supabase connection
 */
exports.handler = async function(event, context) {
  console.log('Testing Supabase connection...');
  console.log('SUPABASE_URL:', supabaseUrl ? 'Configured' : 'Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Configured' : 'Missing');
  
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials in environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test a simple query
    const { data, error } = await supabase
      .from('scraping_runs')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Supabase connection successful',
        dataFound: data && data.length > 0,
        environment: {
          supabaseUrl: supabaseUrl ? 'Configured ✓' : 'Missing ✗',
          supabaseKey: supabaseServiceKey ? 'Configured ✓' : 'Missing ✗',
          nodeEnv: process.env.NODE_ENV
        }
      })
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Connection test failed',
        details: error.message,
        environment: {
          supabaseUrl: supabaseUrl ? 'Configured ✓' : 'Missing ✗',
          supabaseKey: supabaseServiceKey ? 'Configured ✓' : 'Missing ✗',
          nodeEnv: process.env.NODE_ENV
        }
      })
    };
  }
};
