require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Update an existing scraping run record
 * Used by the GitHub Actions workflow to update run status
 */
exports.handler = async function(event, context) {
  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const { id, status, error_message } = body;

    if (!id || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Prepare update data
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    // Add end time if status is completed or failed
    if (status === 'completed' || status === 'failed') {
      updateData.end_time = new Date().toISOString();
    }

    // Add error message if provided
    if (error_message) {
      updateData.error_message = error_message;
    }

    // Update the scraping run
    const { error } = await supabase
      .from('scraping_runs')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating scraping run:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update scraping run' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Scraping run updated',
        id: id,
        status: status
      })
    };
  } catch (error) {
    console.error('Error in update-scraping-run:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
