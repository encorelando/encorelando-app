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
import useConcerts from '../hooks/useConcerts';
import useArtists from '../hooks/useArtists';
import useFestivals from '../hooks/useFestivals';

/**
 * HomePage component displaying today's performances
 * Mobile-optimized with horizontal scrollers for content categories
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

  // Building sections for the home page
  const homeSections = [
    // Today's Performances Section
    {
      title: "Today's Performances",
      subtitle: "Live music happening today across Orlando theme parks",
      content: (
        <div>
          {concertsLoading && !concerts.length ? (
            <div className="flex justify-center py-xl">
              <Spinner size="lg" color="primary" />
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
              {concerts.map(concert => (
                <div key={concert.id} className="w-[300px]">
                  <PerformanceCard performance={concert} />
                </div>
              ))}
            </HorizontalScroller>
          )}
        </div>
      ),
      action: (
        <Link to="/calendar">
          <Button variant="ghost" size="sm">View Calendar</Button>
        </Link>
      ),
    },
    
    // Featured Artists Section
    {
      title: "Featured Artists",
      content: (
        <div>
          {artistsLoading && !artists.length ? (
            <div className="flex justify-center py-xl">
              <Spinner size="lg" color="primary" />
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-lg">
              <Typography variant="body1" color="medium-gray">
                No artists found
              </Typography>
            </div>
          ) : (
            <HorizontalScroller itemWidth={250}>
              {artists.map(artist => (
                <div key={artist.id} className="w-[250px]">
                  <ArtistCard artist={artist} />
                </div>
              ))}
            </HorizontalScroller>
          )}
        </div>
      ),
      action: (
        <Link to="/artists">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      ),
    },
    
    // Current Festivals Section (only shown if there are active festivals)
    ...(festivals.length > 0 ? [{
      title: "Current Festivals",
      content: (
        <div>
          {festivalsLoading && !festivals.length ? (
            <div className="flex justify-center py-xl">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <HorizontalScroller itemWidth={300}>
              {festivals.map(festival => (
                <div key={festival.id} className="w-[300px]">
                  <FestivalCard festival={festival} />
                </div>
              ))}
            </HorizontalScroller>
          )}
        </div>
      ),
      action: (
        <Link to="/festivals">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      ),
    }] : []),
  ];

  return (
    <HomePageLayout
      sections={homeSections}
    />
  );
};

export default HomePage;