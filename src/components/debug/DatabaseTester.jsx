import { useState, useEffect } from 'react';
import { testDatabaseAccess } from '../../services/supabase-troubleshooting';
import supabase from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

const DatabaseTester = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authState, setAuthState] = useState(null);
  const { user } = useAuth();

  const runTest = async () => {
    setLoading(true);
    setTestResults(null); // Clear previous results

    // Add a timeout to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database test timed out after 10 seconds')), 10000);
    });

    try {
      // Race the database test against the timeout
      const results = await Promise.race([testDatabaseAccess(), timeoutPromise]);

      setTestResults(results);
      console.log('Test completed successfully:', results);
    } catch (error) {
      console.error('Error running test:', error);
      setTestResults({
        success: false,
        error: error.message,
        errorDetails: JSON.stringify(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAuthState = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      setAuthState({
        hasSession: !!data?.session,
        error: error?.message,
      });
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        hasSession: false,
        error: error.message,
      });
    }
  };

  useEffect(() => {
    checkAuthState();
  }, [user]);

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Database Access Tester</h2>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Authentication Status:</h3>
        {user ? (
          <div className="text-green-600">✅ Logged in as: {user.email}</div>
        ) : (
          <div className="text-yellow-600">⚠️ Not logged in</div>
        )}

        {authState && (
          <div className="mt-2">
            <div>Session exists: {authState.hasSession ? '✅ Yes' : '❌ No'}</div>
            {authState.error && <div className="text-red-600">Error: {authState.error}</div>}
          </div>
        )}
      </div>

      <button
        onClick={runTest}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Test Database Access'}
      </button>

      {testResults && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <div className={`p-2 rounded ${testResults.success ? 'bg-green-100' : 'bg-red-100'}`}>
            Status: {testResults.success ? '✅ Success' : '❌ Failed'}
          </div>

          {testResults.error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              <strong>Error:</strong> {testResults.error}
            </div>
          )}

          {testResults.concerts && (
            <div className="mt-2">
              <h4 className="font-medium">Concerts Test:</h4>
              <div className="text-sm mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {testResults.concerts.length > 0 ? (
                  <pre>{JSON.stringify(testResults.concerts, null, 2)}</pre>
                ) : (
                  'No concert data returned'
                )}
              </div>
            </div>
          )}

          {testResults.artists && (
            <div className="mt-2">
              <h4 className="font-medium">Artists Test:</h4>
              <div className="text-sm mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {testResults.artists.length > 0 ? (
                  <pre>{JSON.stringify(testResults.artists, null, 2)}</pre>
                ) : (
                  'No artist data returned'
                )}
              </div>
            </div>
          )}

          {testResults.errors &&
            (testResults.errors.concertError || testResults.errors.artistError) && (
              <div className="mt-2">
                <h4 className="font-medium text-red-600">Errors:</h4>
                {testResults.errors.concertError && (
                  <div className="text-sm mt-1 bg-red-50 p-2 rounded">
                    Concert Error: {testResults.errors.concertError.message}
                  </div>
                )}
                {testResults.errors.artistError && (
                  <div className="text-sm mt-1 bg-red-50 p-2 rounded">
                    Artist Error: {testResults.errors.artistError.message}
                  </div>
                )}
              </div>
            )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>This component is for debugging purposes only.</p>
      </div>
    </div>
  );
};

export default DatabaseTester;
