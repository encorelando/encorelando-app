import { Link } from 'react-router-dom';
import PageLayout from '../components/templates/PageLayout';
import Typography from '../components/atoms/Typography';
import BrandHeading from '../components/atoms/BrandHeading';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

/**
 * NotFoundPage component with the new EncoreLando branding
 * Mobile-optimized with dark theme and helpful navigation
 */
const NotFoundPage = () => {
  return (
    <PageLayout showNavigation={false} className="bg-background">
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-md py-xl text-white">
        {/* Updated icon with brand colors */}
        <Icon name="info" size="xl" color="sunset-orange" className="mb-md" />

        {/* Updated typography to match branding */}
        <BrandHeading level={1} gradient className="mb-sm">
          Page Not Found
        </BrandHeading>

        <Typography variant="body1" color="medium-gray" className="mb-lg max-w-md mx-auto">
          We couldn&apos;t find the page you&apos;re looking for. It might have been removed,
          renamed, or temporarily unavailable.
        </Typography>

        <div className="space-y-md w-full max-w-md">
          <Link to="/">
            <Button variant="gradient" fullWidth>
              Go to Home Page
            </Button>
          </Link>

          <Link to="/calendar">
            <Button variant="secondary" fullWidth>
              View Concert Calendar
            </Button>
          </Link>

          <Link to="/search">
            <Button variant="secondary" fullWidth>
              Search for Concerts
            </Button>
          </Link>

          <Button variant="ghost" fullWidth onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;
