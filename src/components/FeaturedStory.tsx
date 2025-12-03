import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';
import type { Story } from '../types';

interface FeaturedStoryProps {
  story: Story;
  onClick: () => void;
}

const verticalLabels: Record<string, string> = {
  'arts-music': 'Arts & Music',
  'sports-leisure': 'Sports & Leisure',
  'fashion-culture': 'Fashion & Culture',
  'business-news': 'Business & News',
};

const verticalColors: Record<string, string> = {
  'arts-music': 'bg-purple-500',
  'sports-leisure': 'bg-blue-500',
  'fashion-culture': 'bg-pink-500',
  'business-news': 'bg-orange-500',
};

export function FeaturedStory({ story, onClick }: FeaturedStoryProps) {
  return (
    <article 
      onClick={onClick}
      className="mb-8 cursor-pointer group relative"
    >
      <div className="absolute -top-3 -left-3 z-10">
        <div className="bg-secondary text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
          <TrendingUp className="size-4" />
          Trending Now
        </div>
      </div>
      
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-black shadow-2xl border-4 border-secondary">
        <ImageWithFallback
          src={story.imageUrl}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Badge className={`${verticalColors[story.vertical]} hover:opacity-90 text-white border-none shadow-lg`}>
              {verticalLabels[story.vertical]}
            </Badge>
            {story.aiGenerated && (
              <Badge className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30">
                <Sparkles className="size-3 mr-1" />
                AI Generated
              </Badge>
            )}
            <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm">
              <Calendar className="size-3 mr-1" />
              {new Date(story.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
          
          <h2 className="text-white mb-4 max-w-5xl group-hover:text-secondary transition-colors leading-tight" 
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>
            {story.title}
          </h2>
          
          <p className="text-gray-200 text-xl max-w-4xl mb-4 leading-relaxed">
            {story.excerpt}
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 font-medium">By {story.author}</span>
            <div className="flex gap-2">
              {story.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}