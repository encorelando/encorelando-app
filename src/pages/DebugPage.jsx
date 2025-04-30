import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatabaseTester from '../components/debug/DatabaseTester';
import supabase from '../services/supabase';

/**
 * DebugPage Component
 *
 * A temporary debug page for testing database connectivity and authentication.
 * This page should only be used during development.
 */
const DebugPage = () => {
  const [logOutput, setLogOutput] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    setLogOutput(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
  };

  const testPublicApi = async () => {
    setLoading(true);
    addLog('Testing public API access...', 'info');

    try {
      // First test - fetch using Supabase client
      addLog('Method 1: Using Supabase client...', 'info');
      const { data, error } = await supabase.from('concerts').select('*').limit(1);

      if (error) {
        addLog(`Supabase client error: ${error.message}`, 'error');
        console.error('Supabase error details:', error);
      } else {
        addLog(`Supabase client success! Retrieved ${data?.length || 0} concerts`, 'success');
        if (data && data.length > 0) {
          console.log('Concert data:', data);
        } else {
          addLog('Warning: Received empty data array', 'warning');
        }
      }

      // Second test - direct API call with timeout
      addLog('Method 2: Using direct fetch with timeout...', 'info');

      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
        const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          addLog('Error: Missing Supabase environment variables', 'error');
          return;
        }

        addLog(`URL: ${supabaseUrl}/rest/v1/concerts?select=*&limit=1`, 'info');

        const response = await fetch(`${supabaseUrl}/rest/v1/concerts?select=*&limit=1`, {
          method: 'GET',
          headers: {
            apikey: supabaseKey,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          addLog(`Fetch API error: ${response.status} ${errorText}`, 'error');
        } else {
          const fetchData = await response.json();
          addLog(`Fetch API success! Retrieved ${fetchData?.length || 0} concerts`, 'success');
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          addLog('Fetch request timed out after 5 seconds', 'error');
        } else {
          addLog(`Fetch API error: ${fetchError.message}`, 'error');
          console.error('Fetch error details:', fetchError);
        }
      }
    } catch (error) {
      addLog(`Exception: ${error.message}`, 'error');
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    setLoading(true);
    addLog('Checking current session...', 'info');

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        addLog(`Session error: ${error.message}`, 'error');
      } else if (data?.session) {
        addLog(`Session found. User: ${data.session.user.email}`, 'success');
        console.log('Session data:', data.session);
      } else {
        addLog('No active session found', 'warning');
      }
    } catch (error) {
      addLog(`Exception: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogOutput([]);
  };

  // Explicitly set text colors for all elements to ensure visibility
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '1.5rem 1rem',
      color: '#1f2937', // Dark gray text
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      color: '#111827', // Nearly black text
    },
    heading: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827',
    },
    paragraph: {
      color: '#4b5563', // Medium gray
      marginBottom: '1rem',
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      backgroundColor: '#3b82f6', // Blue
      color: 'white',
      fontWeight: '500',
      marginRight: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      minHeight: '44px',
    },
    buttonDisabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
    buttonGray: {
      backgroundColor: '#6b7280', // Gray
    },
    logContainer: {
      backgroundColor: '#111827', // Dark background
      borderRadius: '0.5rem',
      padding: '1rem',
      marginTop: '0.5rem',
      maxHeight: '15rem',
      overflowY: 'auto',
      color: '#f3f4f6', // Light gray text
    },
    logEntry: {
      marginBottom: '0.25rem',
      fontSize: '0.875rem',
    },
    logTime: {
      color: '#9ca3af', // Gray
      marginRight: '0.5rem',
      fontSize: '0.75rem',
    },
    logInfo: {
      color: '#d1d5db', // Light gray
    },
    logSuccess: {
      color: '#34d399', // Green
    },
    logWarning: {
      color: '#fbbf24', // Yellow
    },
    logError: {
      color: '#f87171', // Red
    },
    link: {
      color: '#3b82f6', // Blue
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <div style={styles.card}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h1 style={styles.heading}>EncoreLando Debug Page</h1>
            <Link to="/" style={styles.link}>
              Back to Home
            </Link>
          </div>

          <p style={styles.paragraph}>
            This page is for debugging database and authentication issues.
          </p>

          <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
            <button
              onClick={testPublicApi}
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              Test Public API
            </button>

            <button
              onClick={checkSession}
              disabled={loading}
              style={{
                ...styles.button,
                backgroundColor: '#10b981', // Green
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              Check Session
            </button>

            <button
              onClick={clearLogs}
              style={{
                ...styles.button,
                ...styles.buttonGray,
              }}
            >
              Clear Logs
            </button>
          </div>

          {/* Log output */}
          {logOutput.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ ...styles.heading, fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                Log Output
              </h3>
              <div style={styles.logContainer}>
                {logOutput.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.logEntry,
                      color:
                        log.type === 'error'
                          ? styles.logError.color
                          : log.type === 'success'
                          ? styles.logSuccess.color
                          : log.type === 'warning'
                          ? styles.logWarning.color
                          : styles.logInfo.color,
                    }}
                  >
                    <span style={styles.logTime}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Database Tester Component */}
        <DatabaseTester />
      </div>
    </div>
  );
};

export default DebugPage;
