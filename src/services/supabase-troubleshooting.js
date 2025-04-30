// Supabase troubleshooting utilities
// This file uses the existing Supabase client to avoid creating multiple instances
import supabase from './supabase';

// Log connection details for debugging (but not full credentials)
console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log(
  'Supabase Anon Key:',
  process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Key exists' : 'Key is missing!'
);

// Check if environment variables are loaded properly
if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

// Test function to verify database access works
export const testDatabaseAccess = async () => {
  try {
    console.log('Testing public database access...');

    // Test concerts table
    const { data: concerts, error: concertError } = await supabase
      .from('concerts')
      .select('*')
      .limit(3);

    if (concertError) {
      console.error('Error fetching concerts:', concertError);
    } else {
      console.log('Successfully fetched concerts:', concerts);
    }

    // Test artists table
    const { data: artists, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .limit(3);

    if (artistError) {
      console.error('Error fetching artists:', artistError);
    } else {
      console.log('Successfully fetched artists:', artists);
    }

    return {
      success: !concertError && !artistError,
      concerts,
      artists,
      errors: {
        concertError,
        artistError,
      },
    };
  } catch (error) {
    console.error('Unexpected error during database access test:', error);
    return {
      success: false,
      error,
    };
  }
};

// Export the existing supabase instance
export default supabase;
