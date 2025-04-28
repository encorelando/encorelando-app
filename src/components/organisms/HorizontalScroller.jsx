import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '../atoms/IconButton';
import Typography from '../atoms/Typography';

/**
 * HorizontalScroller component for scrolling content horizontally
 * Mobile-optimized with touch scrolling and navigation buttons
 */
const HorizontalScroller = ({
  title,
  children,
  showControls = true,
  className = '',
  itemWidth = 280, // Default item width for scrolling calculations
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll possibilities whenever children change
  useEffect(() => {
    if (scrollContainerRef.current) {
      checkScrollability();
    }
  }, [children]);

  // Check if scrolling is possible
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // Can scroll left if not at the beginning
    setCanScrollLeft(scrollLeft > 0);

    // Can scroll right if there's more content to show
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5); // 5px buffer for rounding errors
  };

  // Handle scroll events
  const handleScroll = () => {
    checkScrollability();
  };

  // Scroll left
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    // Scroll one item width to the left
    container.scrollBy({
      left: -itemWidth,
      behavior: 'smooth',
    });
  };

  // Scroll right
  const scrollRight = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    // Scroll one item width to the right
    container.scrollBy({
      left: itemWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className={className}>
      {/* Header with title and navigation controls */}
      {(title || showControls) && (
        <div className="flex items-center justify-between mb-md px-md">
          {/* Title */}
          {title && <Typography variant="h3">{title}</Typography>}

          {/* Navigation controls - only shown on larger screens */}
          {showControls && (
            <div className="hidden sm:flex items-center">
              <IconButton
                icon="chevron-left"
                ariaLabel="Scroll left"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className="mr-sm"
              />
              <IconButton
                icon="chevron-right"
                ariaLabel="Scroll right"
                onClick={scrollRight}
                disabled={!canScrollRight}
              />
            </div>
          )}
        </div>
      )}

      {/* Scrollable content */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-md scrollbar-hide snap-x"
        onScroll={handleScroll}
      >
        {/* Add left padding */}
        <div className="pl-md" />

        {/* Render children with spacing */}
        {React.Children.map(children, (child, index) => (
          <div key={index} className="flex-shrink-0 snap-start mr-md">
            {child}
          </div>
        ))}

        {/* Add right padding */}
        <div className="pr-md" />
      </div>
    </div>
  );
};

HorizontalScroller.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  showControls: PropTypes.bool,
  className: PropTypes.string,
  itemWidth: PropTypes.number,
};

export default HorizontalScroller;
