import React from 'react';
import PropTypes from 'prop-types';
import PageLayout from './PageLayout';
import Typography from '../atoms/Typography';
import SearchInput from '../molecules/SearchInput';
import { useNavigate } from 'react-router-dom';

/**
 * HomePageLayout component for the home page
 * Mobile-optimized with sections for featured content
 */
const HomePageLayout = ({
  headerTitle = 'EncoreLando',
  headerSubtitle = 'Discover live music at Orlando theme parks',
  sections = [],
  className = '',
}) => {
  const navigate = useNavigate();
  
  // Handle search navigation
  const handleSearch = (searchValue) => {
    navigate(`/search?q=${encodeURIComponent(searchValue)}`);
  };

  return (
    <PageLayout className={className}>
      {/* Header section */}
      <div className="relative bg-primary text-white p-md pb-lg">
        <div className="pt-md pb-lg">
          <Typography variant="h1" color="white" className="mb-xs">
            {headerTitle}
          </Typography>
          
          <Typography variant="body1" color="white">
            {headerSubtitle}
          </Typography>
        </div>
        
        {/* Search input with background that extends below header */}
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-md">
          <div className="bg-white rounded-lg shadow-lg p-md">
            <SearchInput
              value=""
              onChange={(e) => {}}
              onSubmit={handleSearch}
              placeholder="Search concerts, artists, venues..."
            />
          </div>
        </div>
      </div>
      
      {/* Spacing for search bar overflow */}
      <div className="h-xl"></div>
      
      {/* Content sections */}
      <div className="space-y-xl mt-lg">
        {sections.map((section, index) => (
          <section key={index} className="mb-lg">
            {/* Section header */}
            {section.title && (
              <div className="px-md mb-md">
                <div className="flex items-center justify-between">
                  <Typography variant="h2">{section.title}</Typography>
                  
                  {/* Optional action link */}
                  {section.action && (
                    <div>{section.action}</div>
                  )}
                </div>
                
                {/* Optional subtitle */}
                {section.subtitle && (
                  <Typography variant="body2" color="medium-gray" className="mt-xxs">
                    {section.subtitle}
                  </Typography>
                )}
              </div>
            )}
            
            {/* Section content */}
            <div>{section.content}</div>
          </section>
        ))}
      </div>
    </PageLayout>
  );
};

// Define section shape
const sectionShape = PropTypes.shape({
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.node.isRequired,
  action: PropTypes.node,
});

HomePageLayout.propTypes = {
  headerTitle: PropTypes.string,
  headerSubtitle: PropTypes.string,
  sections: PropTypes.arrayOf(sectionShape),
  className: PropTypes.string,
};

export default HomePageLayout;