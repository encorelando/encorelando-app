import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HomePageLayout from '../components/templates/HomePageLayout';
import HorizontalScroller from '../components/organisms/HorizontalScroller';
import PerformanceCard from '../components/organisms/PerformanceCard';
import ArtistCard from '../components/organisms/ArtistCard';
import FestivalCard from '../components/organisms/FestivalCard';
import Typography from '../components/atoms/Typography';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import BrandHeading from '../components/atoms/BrandHeading';
import Divider from '../components/atoms/Divider';
import useConcerts from '../hooks/useConcerts';
import useArtists from '../hooks/useArtists';
import useFestivals from '../hooks/useFestivals';

/**
 * HomePage component with the new EncoreLando branding
 * Mobile-optimized with dark background and vibrant accents
 */
const HomePage = () => {
  // State for today's date
  const [today] = useState(new Date());
  
  // Fetch today's concerts
  const { concerts, loading: concertsLoading, error: concertsError } = useConcerts({
    startDate: today,
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59),
  });
  
  // Fetch popular artists
  const { artists, loading: artistsLoading } = useArtists({ limit: 10 });
  
  // Fetch active festivals
  const { festivals, loading: festivalsLoading } = useFestivals({ 
    isActive: true,
    limit: 5
  });

  // Building sections for the home page with updated branding
  const homeSections = [
    // Today's Performances Section
    {
      title: "Today's Performances",
      titleComponent: (
        <BrandHeading level={2} gradient className="mb-xs">
          Today's Performances
        </BrandHeading>
      ),
      subtitle: "Live music happening today across Orlando theme parks",
      subtitleComponent: (
        <Typography variant="body1" color="medium-gray" className="mb-md">
          Live music happening today across Orlando theme parks
        </Typography>
      ),
      content: (
        <div>
          {concertsLoading && !concerts.length ? (
            <div className="flex justify-center py-xl">
              <Spinner color="sunset-orange" />
            </div>
          ) : concertsError ? (
            <div className="text-center py-lg">
              <Typography variant="body1" color="error">
                Unable to load today's concerts
              </Typography>
            </div>
          ) : concerts.length === 0 ? (
            <div className="text-center py-lg">
              <Typography variant="body1" color="medium-gray">
                No performances scheduled for today
              </Typography>
            </div>
          ) : (
            <HorizontalScroller itemWidth={300}>
              {concerts.map((concert, index) => (
                <div key={concert.id} className="w-[300px]">
                  <PerformanceCard 
                    performance={concert} 
                    featured={index === 0} // Feature the first item
                  />
                </div>
              ))}
            </HorizontalScroller>
          )}
        </div>
      ),
      action: (
        <div className="flex justify-center mt-md">
          <Link to="/calendar">
            <Button variant="secondary" size="md">View Calendar</Button>
          </Link>
        </div>
      ),
      divider: <Divider gradient margin="lg" />
    },
    
    // Featured Artists Section
    {
      title: "Featured Artists",
      titleComponent: (
        <BrandHeading level={2} gradient className="mb-md">
          Featured Artists
        </BrandHeading>
      ),
      content: (
        <div>
          {artistsLoading && !artists.length ? (
            <div className="flex justify-center py-xl">
              <Spinner color="magenta-pink" />
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-lg">
              <Typography variant="body1" color="medium-gray">
                No artists found
              </Typography>
            </div>
          ) : (
            <HorizontalScroller itemWidth={250}>
              {artists.map((artist, index) => (
                <div key={artist.id} className="w-[250px]">
                  <ArtistCard 
                    artist={artist} 
                    featured={index === 0} // Feature the first item
                  />
                </div>
              ))}
            </HorizontalScroller>
          )}
        </div>
      ),
      action: (
        <div className="flex justify-center mt-md">
          <Link to="/artists">
            <Button variant="secondary" size="md">View All Artists</Button>
          </Link>
        </div>
      ),
      divider: festivals.length > 0 ? <Divider gradient margin="lg" /> : null
    },
    
    // Current Festivals Section (only shown if there are active festivals)
    ...(festivals.length > 0 ? [{
      title: "Current Festivals",
      titleComponent: (
        <BrandHeading level={2} gradient className="mb-md">
          Current Festivals
        </BrandHeading>
      ),
      content: (
        <div>
          {festivalsLoading && !festivals.length ? (
            <div className="flex justify-center py-xl">
              <Spinner color="deep-orchid" />
            </div>
          ) : (
            <HorizontalScroller itemWidth={300}>
              {festivals.map((festival, index) => (
                <div key={festival.id} className="w-[300px]">
                  <FestivalCard 
                    festival={festival} 
                    featured={index === 0} // Feature the first item
                  />
                </div>
              ))}
            </HorizontalScroller>
          )}
        </div>
      ),
      action: (
        <div className="flex justify-center mt-md">
          <Link to="/festivals">
            <Button variant="secondary" size="md">View All Festivals</Button>
          </Link>
        </div>
      ),
    }] : []),
  ];

  return (
    <div className="bg-background min-h-screen pb-nav">
      <HomePageLayout
        sections={homeSections}
      />
    </div>
  );
};

export default HomePage;