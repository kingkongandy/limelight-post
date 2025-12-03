import { StoryCard } from './StoryCard';
import type { Story } from '../types';

interface StoryGridProps {
  stories: Story[];
  onStoryClick: (story: Story) => void;
}

export function StoryGrid({ stories, onStoryClick }: StoryGridProps) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border">
        <p className="text-muted-foreground italic">No stories found in this vertical.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <StoryCard 
          key={story.id} 
          story={story} 
          onClick={() => onStoryClick(story)}
        />
      ))}
    </div>
  );
}