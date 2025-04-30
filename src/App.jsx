import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import './styles/App.css';
import { AuthProvider } from './context/AuthContext';

/**
 * Main App component with AuthProvider
 * Mobile-first design with authentication state management
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
