import { useState } from 'react';
import { X, Save, Image as ImageIcon, Youtube, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Checkbox } from './ui/checkbox';
import type { Story, Vertical } from '../types';

interface ManualStoryFormProps {
  onClose: () => void;
  onSave: (story: Partial<Story>) => void;
}

const verticalLabels: Record<Vertical, string> = {
  'arts-music': 'Arts & Music',
  'fashion-culture': 'Fashion & Culture',
  'sports-leisure': 'Sports & Leisure',
  'business-news': 'Business & News',
};

export function ManualStoryForm({ onClose, onSave }: ManualStoryFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    vertical: 'arts-music' as Vertical,
    author: 'Editor',
    imageUrl: '',
    youtubeUrl: '',
    tags: '',
    keepIndefinitely: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('Please fill in all required fields (Title, Excerpt, Content)');
      return;
    }

    // Convert comma-separated tags to array
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const story: Partial<Story> = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      vertical: formData.vertical,
      author: formData.author || 'Editor',
      imageUrl: formData.imageUrl || undefined,
      youtubeUrl: formData.youtubeUrl || undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['Breaking News'],
      keepIndefinitely: formData.keepIndefinitely,
    };

    onSave(story);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 overflow-y-auto py-8">
      <div className="bg-card border-2 border-secondary rounded-xl w-full max-w-3xl mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-border">
          <div>
            <h2 className="text-2xl font-bold">✍️ Write Story Manually</h2>
            <p className="text-sm text-muted-foreground mt-1">Create a custom story like a WordPress post</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-border rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vertical Selection */}
          <div>
            <Label htmlFor="vertical">Vertical *</Label>
            <select
              id="vertical"
              value={formData.vertical}
              onChange={(e) => setFormData({ ...formData, vertical: e.target.value as Vertical })}
              className="w-full mt-1 px-4 py-2 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {Object.entries(verticalLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Headline *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Attention-grabbing headline..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              placeholder="2-3 sentence hook that draws readers in..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="mt-1 min-h-[80px]"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              This appears in previews and social media shares
            </p>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Full Story *</Label>
            <Textarea
              id="content"
              placeholder="Write your full story here... Use line breaks to separate paragraphs."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-1 min-h-[240px]"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tip: Press Enter twice for paragraph breaks
            </p>
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <ImageIcon className="size-4" />
              Featured Image URL (optional)
            </Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg (leave empty for auto-search)"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              If left empty, we'll search for a relevant image based on your title
            </p>
          </div>

          {/* YouTube URL */}
          <div>
            <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
              <Youtube className="size-4" />
              YouTube Video URL (optional)
            </Label>
            <Input
              id="youtubeUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Embed a YouTube video in your story
            </p>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="Trending, Celebrity, Breaking News (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Author */}
          <div>
            <Label htmlFor="author">Author Name</Label>
            <Input
              id="author"
              type="text"
              placeholder="Editor"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Keep Indefinitely */}
          <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg border-2 border-secondary/20">
            <Checkbox
              id="keepIndefinitely"
              checked={formData.keepIndefinitely}
              onCheckedChange={(checked) => setFormData({ ...formData, keepIndefinitely: !!checked })}
            />
            <div className="flex-1">
              <Label htmlFor="keepIndefinitely" className="flex items-center gap-2 cursor-pointer">
                <Star className="size-4 text-secondary" />
                <span className="font-bold">Keep This Story Forever</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Manual stories normally delete after 1 year. Check this to keep this story indefinitely.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t-2 border-border">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-secondary text-black hover:bg-secondary/90"
            >
              <Save className="size-4 mr-2" />
              Publish Story
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}