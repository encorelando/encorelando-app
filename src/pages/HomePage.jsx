import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import HomePageLayout from '../components/templates/HomePageLayout';
import HorizontalScroller from '../components/organisms/HorizontalScroller';
import PerformanceCard from '../components/organisms/PerformanceCard';
import EntityCard from '../components/organisms/EntityCard';
import Typography from '../components/atoms/Typography';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import BrandHeading from '../components/atoms/BrandHeading';
import Divider from '../components/atoms/Divider';
import EmailConfirmationSuccess from '../components/auth/EmailConfirmationSuccess';
import useConcerts from '../hooks/useConcerts';
import useArtists from '../hooks/useArtists';
import useFestivals from '../hooks/useFestivals';

/**
 * Groups performances by artist to consolidate multiple shows
 * Ensures artist image data is preserved from all potential sources
 * @param {Array} concerts - List of concert performances
 * @returns {Array} - Grouped performances by artist
 */
const groupPerformancesByArtist = concerts => {
  // Log the first concert to debug data structure
  if (concerts && concerts.length > 0) {
    console.log('First concert data structure:', {
      concert: concerts[0],
      hasArtist: Boolean(concerts[0].artist),
      hasArtists: Boolean(concerts[0].artists),
      artistImageUrl: concerts[0].artist?.image_url,
      artistsImageUrl: concerts[0].artists?.image_url,
    });
  }

  const groupedMap = concerts.reduce((groups, concert) => {
    // The API returns "artists" but our components expect "artist"
    // So we need to handle both naming conventions
    const artistData = concert.artists || concert.artist;
    const artistId = artistData?.id || 'unknown';

    if (!groups[artistId]) {
      groups[artistId] = {
        artistId,
        artistName: artistData?.name || 'Unknown Artist',
        artistImageUrl: null, // Initialize image URL as null
        performances: [],
      };
    }

    // Try to find and store artist image URL from any available source
    // Check all possible locations for the image URL
    if (!groups[artistId].artistImageUrl) {
      const imageUrl =
        concert.artists?.image_url || concert.artist?.image_url || artistData?.image_url || null;

      if (imageUrl) {
        groups[artistId].artistImageUrl = imageUrl;
        console.log(`Found image URL for artist ${artistId}:`, imageUrl);
      }
    }

    groups[artistId].performances.push(concert);
    return groups;
  }, {});

  // Convert map to array and sort by artist name
  return Object.values(groupedMap).sort((a, b) => a.artistName.localeCompare(b.artistName));
};

/**
 * HomePage component with the new EncoreLando branding
 * Mobile-optimized with dark background and vibrant accents
 */
const HomePage = () => {
  // Get search parameters and location for detecting email confirmation
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showConfirmationSuccess, setShowConfirmationSuccess] = useState(false);

  // State for today's date
  const [today] = useState(new Date());

  // Check for email confirmation success
  useEffect(() => {
    // Look for the confirmation success parameter from Supabase
    const isConfirmed = searchParams.get('email_confirmed') === 'true';

    if (isConfirmed) {
      setShowConfirmationSuccess(true);

      // Remove the query parameter from URL (for cleaner UX)
      const newUrl = location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams, location]);

  // Fetch today's concerts - make sure we capture the full date range for today
  const {
    concerts,
    loading: concertsLoading,
    error: concertsError,
  } = useConcerts({
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59),
  });

  // Fetch popular artists
  const { artists, loading: artistsLoading } = useArtists({ limit: 10 });

  // Fetch active festivals
  const { festivals, loading: festivalsLoading } = useFestivals({
    isActive: true,
    limit: 5,
  });

  // Building sections for the home page with updated branding
  const homeSections = [
    // Today's Performances Section
    {
      title: "Today's Performances",
      titleComponent: (
        <BrandHeading level={2} gradient className="mb-xs">
          Today&apos;s Performances
        </BrandHeading>
      ),
      subtitle: 'Live music happening today across Orlando theme parks',
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
                Unable to load today&apos;s concerts
              </Typography>
            </div>
          ) : concerts.length === 0 ? (
            <div className="text-center py-lg">
              <Typography variant="body1" color="medium-gray">
                No performances scheduled for today
              </Typography>
            </div>
          ) : (
            <HorizontalScroller itemWidth={340}>
              {groupPerformancesByArtist(concerts).map((group, index) => {
                // Safety check for valid performances
                if (!group.performances || group.performances.length === 0) {
                  return null;
                }

                // Get the first performance to use as the base
                const basePerformance = group.performances[0];

                // Extract artist data
                const artist = basePerformance.artist || basePerformance.artists || {};

                return (
                  <div key={group.artistId} className="w-[340px]">
                    {/* Debug logs for artist data */}
                    {console.log('HomePage artist debug:', {
                      artistId: group.artistId,
                      artistName: group.artistName,
                      artistImageUrl: group.artistImageUrl,
                      firstPerfHasArtist: Boolean(basePerformance.artist),
                      firstPerfArtistImageUrl: basePerformance.artist?.image_url,
                      artistUsingFromBasePerf:
                        artist.image_url || basePerformance.artist?.image_url,
                    })}

                    {group.performances.length > 1 ? (
                      <PerformanceCard
                        performance={{
                          ...basePerformance,
                          name: group.artistName,
                          // Include both artist and artists properties for compatibility
                          artist: {
                            id: group.artistId,
                            name: group.artistName,
                            image_url: group.artistImageUrl,
                          },
                          artists: {
                            id: group.artistId,
                            name: group.artistName,
                            image_url: group.artistImageUrl,
                          },
                          performanceTimes: group.performances.map(p => ({
                            id: p.id,
                            startTime: p.startTime || p.start_time,
                            endTime: p.endTime || p.end_time,
                          })),
                        }}
                        featured={index === 0}
                      />
                    ) : (
                      <PerformanceCard
                        performance={{
                          ...basePerformance,
                          // Ensure both artist properties are defined with image
                          artist: {
                            id: group.artistId,
                            name: group.artistName,
                            image_url: group.artistImageUrl,
                          },
                          artists: {
                            id: group.artistId,
                            name: group.artistName,
                            image_url: group.artistImageUrl,
                          },
                        }}
                        featured={index === 0}
                      />
                    )}
                  </div>
                );
              })}
            </HorizontalScroller>
          )}
        </div>
      ),
      action: (
        <div className="flex justify-center mt-md">
          <Link to="/calendar">
            <Button variant="secondary" size="md">
              View Calendar
            </Button>
          </Link>
        </div>
      ),
      divider: <Divider gradient margin="lg" />,
    },

    // Featured Artists Section
    {
      title: 'Featured Artists',
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
            <div className="px-md">
              <HorizontalScroller itemWidth={250}>
                {artists.map((artist, index) => (
                  <div key={artist.id} className="w-[250px]">
                    <EntityCard entity={artist} featured={index === 0} type="artist" />
                  </div>
                ))}
              </HorizontalScroller>
            </div>
          )}
        </div>
      ),
      action: (
        <div className="flex justify-center mt-md">
          <Link to="/artists">
            <Button variant="secondary" size="md">
              View All Artists
            </Button>
          </Link>
        </div>
      ),
      divider: festivals.length > 0 ? <Divider gradient margin="lg" /> : null,
    },

    // Current Festivals Section (only shown if there are active festivals)
    ...(festivals.length > 0
      ? [
          {
            title: 'Current Festivals',
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
                  <div className="px-md">
                    <HorizontalScroller itemWidth={300}>
                      {festivals.map((festival, index) => (
                        <div key={festival.id} className="w-[300px]">
                          <EntityCard
                            entity={festival}
                            featured={index === 0} // Feature the first item
                            type="festival"
                          />
                        </div>
                      ))}
                    </HorizontalScroller>
                  </div>
                )}
              </div>
            ),
            action: (
              <div className="flex justify-center mt-md">
                <Link to="/festivals">
                  <Button variant="secondary" size="md">
                    View All Festivals
                  </Button>
                </Link>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-background min-h-screen pb-16">
      <HomePageLayout sections={homeSections} />
      {showConfirmationSuccess && <EmailConfirmationSuccess />}
      <div className="mt-lg px-md text-center space-x-md text-xs text-medium-gray">
        <Link to="/privacy">Privacy&nbsp;Policy</Link>
        <span>|</span>
        <Link to="/terms">Terms&nbsp;&amp;&nbsp;Conditions</Link>
        <span>|</span>
        <Link to="/copyright">Copyright&nbsp;Notice</Link>
      </div>
      <div className="mt-sm mb-lg px-md text-center text-xs text-medium-gray">
        <span className="text-medium-gray">
          &copy; {new Date().getFullYear()} Starbright Lab LLC. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default HomePage;
