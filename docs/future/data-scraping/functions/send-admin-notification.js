require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Send notification to admin users
 * Used to alert administrators about scraping failures or data requiring review
 */
exports.handler = async function(event, context) {
  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const { type, runId, message } = body;

    if (!type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing notification type' })
      };
    }

    // Get scraping run details if runId is provided
    let runDetails = null;
    if (runId) {
      const { data, error } = await supabase
        .from('scraping_runs')
        .select('*')
        .eq('id', runId)
        .single();

      if (!error && data) {
        runDetails = data;
      }
    }

    // In a real implementation, this would send an email or other notification
    // For now, we'll just log the notification
    console.log('Admin notification:', {
      type,
      runId,
      runDetails,
      message: message || `Notification of type: ${type}`,
      timestamp: new Date().toISOString()
    });

    // Here you would typically integrate with a notification service
    // Such as SendGrid, AWS SES, or a custom notification system
    
    /*
    // Example email notification using a hypothetical email service
    if (type === 'scraping_failure') {
      await emailService.sendEmail({
        to: 'admin@encorelando.com',
        subject: 'EncoreLando Scraping Failure',
        body: `
          Scraping run ${runId} has failed.
          Time: ${runDetails?.start_time}
          Error: ${runDetails?.error_message || 'Unknown error'}
          
          Please check the admin dashboard for more details.
        `
      });
    } else if (type === 'data_review_required') {
      await emailService.sendEmail({
        to: 'admin@encorelando.com',
        subject: 'EncoreLando Data Review Required',
        body: `
          New scraped data is available for review.
          Scraping run: ${runId}
          Time: ${runDetails?.end_time}
          
          Please visit the admin dashboard to review and approve the data.
        `
      });
    }
    */

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Notification sent',
        type: type
      })
    };
  } catch (error) {
    console.error('Error in send-admin-notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
