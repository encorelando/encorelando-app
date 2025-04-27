import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/templates/PageLayout';
import Typography from '../components/atoms/Typography';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

/**
 * NotFoundPage component for 404 errors
 * Mobile-optimized with helpful navigation
 */
const NotFoundPage = () => {
  return (
    <PageLayout showNavigation={false}>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-md py-xl">
        <Icon name="info" size="xl" color="primary" className="mb-md" />
        
        <Typography variant="h1" className="mb-sm">
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="medium-gray" className="mb-lg max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been removed, 
          renamed, or temporarily unavailable.
        </Typography>
        
        <div className="space-y-md w-full max-w-md">
          <Link to="/">
            <Button variant="primary" fullWidth>
              Go to Home Page
            </Button>
          </Link>
          
          <Link to="/calendar">
            <Button variant="outline" fullWidth>
              View Concert Calendar
            </Button>
          </Link>
          
          <Link to="/search">
            <Button variant="outline" fullWidth>
              Search for Concerts
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            fullWidth
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;