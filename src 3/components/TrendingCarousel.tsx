import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Story } from '../types';
import { useState, useRef } from 'react';

interface TrendingCarouselProps {
  stories: Story[];
  onStoryClick: (story: Story) => void;
}

const verticalColors: Record<string, string> = {
  'arts-music': 'bg-purple-500',
  'fashion-culture': 'bg-pink-500',
  'sports-leisure': 'bg-blue-500',
  'business-news': 'bg-orange-500',
};

const verticalLabels: Record<string, string> = {
  'arts-music': 'Arts & Music',
  'fashion-culture': 'Fashion & Culture',
  'sports-leisure': 'Sports & Leisure',
  'business-news': 'Business & News',
};

export function TrendingCarousel({ stories, onStoryClick }: TrendingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate which story is currently in view
      const cardWidth = scrollRef.current.querySelector('div')?.offsetWidth || 0;
      const gap = 24; // 6 in Tailwind = 24px
      const currentIndex = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(currentIndex, stories.length - 1));
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-secondary text-black px-4 py-2 rounded-lg">
          <TrendingUp className="size-5" />
          <h2 className="font-bold uppercase tracking-wider">Trending Stories</h2>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-secondary to-transparent"></div>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border-2 border-secondary"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border-2 border-secondary"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-6" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="flex-shrink-0 w-[85%] sm:w-[70%] md:w-[60%] lg:w-[48%] snap-start"
            >
              <div
                onClick={() => onStoryClick(story)}
                className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group/card h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <ImageWithFallback
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  
                  {/* Trending Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-secondary text-black px-3 py-1.5 rounded-full shadow-lg">
                    <TrendingUp className="size-4" />
                    <span className="text-xs font-bold uppercase">#{index + 1} Trending</span>
                  </div>

                  {/* Vertical Badge */}
                  <div className={`absolute top-4 right-4 ${verticalColors[story.vertical]} text-white px-3 py-1.5 rounded-full shadow-lg`}>
                    <span className="text-xs font-bold uppercase">{verticalLabels[story.vertical]}</span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2 group-hover/card:text-secondary transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {story.excerpt}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{story.author}</span>
                      <span>•</span>
                      <span>{new Date(story.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                      {story.aiGenerated && (
                        <>
                          <span>•</span>
                          <span className="text-secondary">AI Generated</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="p-4 flex flex-wrap gap-2">
                  {story.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full border border-secondary/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {stories.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-8 bg-secondary' : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}