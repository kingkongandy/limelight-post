import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, Sparkles, Edit3, Share2 } from 'lucide-react';
import type { Story } from '../types';

interface StoryDetailProps {
  story: Story;
  onBack: () => void;
  onEdit: () => void;
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

export function StoryDetail({ story, onBack, onEdit }: StoryDetailProps) {
  return (
    <article className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="gap-2 border-2 hover:border-secondary hover:text-secondary"
        >
          <ArrowLeft className="size-4" />
          Back to Stories
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-2">
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button onClick={onEdit} className="gap-2 bg-secondary hover:bg-secondary/90 text-black">
            <Edit3 className="size-4" />
            <span className="hidden sm:inline">Edit Story</span>
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge className={`${verticalColors[story.vertical]} hover:opacity-90 text-white border-none shadow-lg`}>
            {verticalLabels[story.vertical]}
          </Badge>
          {story.aiGenerated && (
            <Badge className="bg-secondary hover:bg-secondary/90 text-black border-none">
              <Sparkles className="size-3 mr-1" />
              AI Generated Story
            </Badge>
          )}
          {story.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-foreground mb-6 leading-none" 
            style={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>
          {story.title}
        </h1>
        
        <div className="h-1.5 w-24 bg-secondary rounded-full mb-6"></div>
        
        <p className="text-foreground/80 text-2xl leading-relaxed mb-6" 
           style={{ fontFamily: "'Inter', sans-serif", fontWeight: '500' }}>
          {story.excerpt}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground pb-6 border-b-2 border-border">
          <span className="font-semibold text-foreground">By {story.author}</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            {new Date(story.date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
          {story.lastEdited && (
            <span className="text-xs italic">
              Last edited {new Date(story.lastEdited).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      
      <div className="relative aspect-[2/1] rounded-2xl overflow-hidden bg-black mb-8 shadow-2xl border-4 border-secondary/20">
        <ImageWithFallback
          src={story.imageUrl}
          alt={story.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* YouTube Video Embed */}
      {story.youtubeUrl && (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-8 shadow-2xl border-4 border-secondary/20">
          <iframe
            src={story.youtubeUrl.replace('watch?v=', 'embed/')}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}
      
      <div className="prose prose-lg max-w-none">
        {story.content.split('\\n\\n').map((paragraph, index) => (
          <p key={index} className="text-foreground/80 mb-6 leading-relaxed text-lg" 
             style={{ fontFamily: "'Inter', sans-serif" }}>
            {paragraph}
          </p>
        ))}
      </div>
      
      {/* Sources Section - Show if real news sources were used */}
      {story.sources && story.sources.length > 0 && (
        <div className="mt-8 pt-8 border-t-2 border-border">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <span className="text-secondary">📰</span> Sources
          </h3>
          <ul className="space-y-3">
            {story.sources.map((source, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-secondary font-bold mt-1">{index + 1}.</span>
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-secondary underline decoration-secondary/30 hover:decoration-secondary transition-colors"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-4 italic">
            This story was fact-checked against {story.sources.length} real news {story.sources.length === 1 ? 'source' : 'sources'} from around the web.
          </p>
        </div>
      )}
      
      <div className="mt-12 pt-8 border-t-2 border-secondary/20">
        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-6 border-2 border-secondary/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-5 text-secondary" />
            <h4 className="font-bold text-foreground">AI-Generated Content</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This story was automatically curated and written by our AI system, which scans the internet daily for the most relevant celebrity and influencer news. 
            All AI-generated content is reviewed and can be edited by our editorial team for accuracy and tone.
          </p>
        </div>
      </div>
    </article>
  );
}