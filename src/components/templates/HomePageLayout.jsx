import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';
import Typography from '../atoms/Typography';
import BrandHeading from '../atoms/BrandHeading';
import BrandLogo from '../atoms/branding/BrandLogo';
import SearchInput from '../molecules/SearchInput';
import { useNavigate } from 'react-router-dom';
import BrandName from '../atoms/branding/BrandName';
import Icon from '../atoms/Icon';

/**
 * HomePageLayout component with the new EncoreLando branding
 * Mobile-optimized with dark background and gradient accents
 */
const HomePageLayout = ({ headerSubtitle = '', sections = [], className = '' }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  // Handle search input changes
  const handleSearchChange = e => {
    setSearchValue(e.target.value);
  };

  // Handle search navigation
  const handleSearch = searchValue => {
    navigate(`/search?q=${encodeURIComponent(searchValue)}`);
  };

  // Handle search clear
  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <PageLayout className={`${className} bg-background`}>
      {/* Header section with updated branding */}
      <div className="relative bg-background text-white p-md pb-lg">
        <div className="pt-md pb-lg">
          {/* Logo instead of text title */}
          <div className="flex items-center justify-between w-full">
            {/* Left: Logo Container */}
            <div className="w-16 flex items-center justify-start">
              <BrandLogo variant="gradient" size="md" className="h-16" />
            </div>

            {/* Center: Brand Name */}
            <div className="flex-1 text-center">
              <BrandName variant="gradient" size="2xl" className="inline-block" />
            </div>

            {/* Right: Login Icon with matching width */}
            <div className="w-16 flex items-center justify-end">
              <Link to="/admin/login">
                <button className="p-2 rounded-md bg-white bg-opacity-10 hover:bg-opacity-20 transition">
                  <Icon name="log-in" size="md" color="white" />
                </button>
              </Link>
            </div>
          </div>
          <Typography variant="body1" color="medium-gray" className="mt-sm">
            {headerSubtitle}
          </Typography>
        </div>

        {/* Search input with updated styling for dark theme */}
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-md">
          <div className="sticky top-0 bg-background z-10 shadow-md border-b border-white border-opacity-10">
            <SearchInput
              value={searchValue}
              onChange={handleSearchChange}
              onSubmit={() => handleSearch(searchValue)}
              onClear={handleClear}
              placeholder="Search concerts, artists, venues..."
              darkMode
            />
          </div>
        </div>
      </div>

      {/* Spacing for search bar overflow */}
      <div className="h-xl"></div>

      {/* Content sections */}
      <div className="space-y-lg mt-lg">
        {sections.map((section, index) => (
          <section key={index} className="mb-lg">
            {/* Section header */}
            <div className="px-md mb-md">
              <div className="text-center sm:text-left">
                {/* Use custom title component if provided, otherwise default to standard title */}
                {section.titleComponent ||
                  (section.title && (
                    <BrandHeading level={2} gradient>
                      {section.title}
                    </BrandHeading>
                  ))}
              </div>

              {/* Optional subtitle */}
              {section.subtitleComponent ||
                (section.subtitle && (
                  <Typography variant="body2" color="medium-gray" className="mt-xxs">
                    {section.subtitle}
                  </Typography>
                ))}
            </div>

            {/* Section content */}
            <div>{section.content}</div>
            {/* Optional action link */}
            {section.action && <div>{section.action}</div>}

            {/* Optional divider */}
            {section.divider && <div className="px-md mt-lg">{section.divider}</div>}
          </section>
        ))}
      </div>
    </PageLayout>
  );
};

// Define section shape with new options for branding
const sectionShape = PropTypes.shape({
  title: PropTypes.string,
  titleComponent: PropTypes.node,
  subtitle: PropTypes.string,
  subtitleComponent: PropTypes.node,
  content: PropTypes.node.isRequired,
  action: PropTypes.node,
  divider: PropTypes.node,
});

HomePageLayout.propTypes = {
  headerTitle: PropTypes.string,
  headerSubtitle: PropTypes.string,
  sections: PropTypes.arrayOf(sectionShape),
  className: PropTypes.string,
};

export default HomePageLayout;
