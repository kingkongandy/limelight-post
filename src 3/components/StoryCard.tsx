import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import type { Story } from '../types';

interface StoryCardProps {
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

export function StoryCard({ story, onClick }: StoryCardProps) {
  return (
    <article 
      onClick={onClick}
      className="group cursor-pointer bg-card rounded-xl overflow-hidden hover:shadow-2xl transition-all border-2 border-transparent hover:border-secondary"
    >
      <div className="relative aspect-[16/10] bg-black overflow-hidden">
        <ImageWithFallback
          src={story.imageUrl}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${verticalColors[story.vertical]} hover:opacity-90 text-white border-none shadow-lg text-xs font-bold`}>
            {verticalLabels[story.vertical]}
          </Badge>
        </div>
        {story.aiGenerated && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-secondary hover:bg-secondary/90 text-black border-none shadow-lg text-xs">
              <Sparkles className="size-3 mr-1" />
              AI
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <Calendar className="size-3" />
          <span className="font-medium">
            {new Date(story.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <span className="mx-1">•</span>
          <span className="italic">By {story.author}</span>
        </div>
        
        <h3 className="text-foreground mb-3 group-hover:text-secondary transition-colors leading-tight" 
            style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.375rem', fontWeight: '700' }}>
          {story.title}
        </h3>
        
        <p className="text-foreground/70 text-sm mb-4 line-clamp-2 leading-relaxed">
          {story.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {story.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-1 text-secondary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Read More
            <ArrowRight className="size-4" />
          </div>
        </div>
      </div>
    </article>
  );
}