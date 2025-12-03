import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X, Wand2, Save, Sparkles, Youtube } from 'lucide-react';
import type { Story } from '../types';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface EditorPanelProps {
  story: Story;
  onClose: () => void;
  onUpdate: (story: Story) => void;
}

export function EditorPanel({ story, onClose, onUpdate }: EditorPanelProps) {
  const [editedStory, setEditedStory] = useState(story);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);

  const handleAiPolish = async () => {
    setIsPolishing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d2c193b9/ai-polish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            content: editedStory.content,
            title: editedStory.title,
            vertical: editedStory.vertical,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to polish story');
      }

      const { polishedContent } = await response.json();
      setEditedStory(prev => ({ 
        ...prev, 
        content: polishedContent,
        lastEdited: new Date().toISOString(),
      }));
      toast.success('✨ Story polished with AI! Review and save changes.');
    } catch (error) {
      console.error('AI Polish error:', error);
      toast.error('Failed to polish story. Check console for details.');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleAiEdit = () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // In a real app, this would call an AI API
      let newContent = editedStory.content;
      
      if (aiPrompt.toLowerCase().includes('shorter')) {
        const paragraphs = newContent.split('\n\n');
        newContent = paragraphs.slice(0, Math.ceil(paragraphs.length / 2)).join('\n\n');
      } else if (aiPrompt.toLowerCase().includes('longer')) {
        newContent += '\n\n' + 'The story continues to develop as more details emerge. Industry insiders are watching closely to see how this situation unfolds and what implications it may have for the broader community.';
      } else if (aiPrompt.toLowerCase().includes('casual') || aiPrompt.toLowerCase().includes('conversational')) {
        newContent = newContent.replace(/demonstrates that/g, 'shows that')
          .replace(/accumulated/g, 'racked up')
          .replace(/represents/g, 'is');
      }
      
      setEditedStory({
        ...editedStory,
        content: newContent,
        lastEdited: new Date().toISOString(),
      });
      
      setAiPrompt('');
      setIsProcessing(false);
    }, 1500);
  };

  const handleSave = () => {
    onUpdate({
      ...editedStory,
      lastEdited: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border-4 border-secondary">
        <div className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10 border-b-2 border-secondary/30 flex items-center justify-between">
          <div>
            <h2 className="text-foreground flex items-center gap-2" 
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.75rem', fontWeight: '800' }}>
              <Sparkles className="size-6 text-secondary" />
              Story Editor
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Edit manually or use AI to transform your content
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="hover:bg-destructive/10 hover:text-destructive rounded-full"
          >
            <X className="size-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Prompt Section */}
          <div className="bg-gradient-to-br from-secondary/20 to-accent/20 border-2 border-secondary rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="size-5 text-secondary" />
              <Label className="text-foreground text-lg font-bold">
                AI Story Transformation
              </Label>
            </div>
            <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
              Tell the AI how to modify this story. Try: "Make it shorter", "Add more quotes", "Make the tone more urgent", "Focus on the controversy"
            </p>
            <div className="flex gap-2">
              <Input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="What changes do you want to make?"
                className="flex-1 border-2 border-secondary/30 focus:border-secondary bg-white"
                disabled={isProcessing}
              />
              <Button 
                onClick={handleAiEdit}
                disabled={!aiPrompt.trim() || isProcessing}
                className="gap-2 bg-secondary hover:bg-secondary/90 text-black font-bold px-6"
              >
                <Wand2 className="size-4" />
                {isProcessing ? 'Processing...' : 'Transform'}
              </Button>
            </div>
            
            {/* AI Polish Button - For manual stories */}
            {story.source === 'manual' && (
              <div className="mt-4 pt-4 border-t-2 border-secondary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">Polish with AI</p>
                    <p className="text-xs text-foreground/70">Fix spelling, grammar & rewrite in brand voice</p>
                  </div>
                  <Button
                    onClick={handleAiPolish}
                    disabled={isPolishing}
                    variant="outline"
                    className="gap-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-black font-bold"
                  >
                    <Sparkles className="size-4" />
                    {isPolishing ? 'Polishing...' : 'AI Polish'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Story Details */}
          <div className="space-y-5">
            <div>
              <Label className="text-foreground font-bold mb-2 block">Story Title</Label>
              <Input
                value={editedStory.title}
                onChange={(e) => setEditedStory({ ...editedStory, title: e.target.value })}
                className="border-2 border-border focus:border-secondary bg-white"
              />
            </div>
            
            <div>
              <Label className="text-foreground font-bold mb-2 block">Excerpt / Subtitle</Label>
              <Textarea
                value={editedStory.excerpt}
                onChange={(e) => setEditedStory({ ...editedStory, excerpt: e.target.value })}
                className="border-2 border-border focus:border-secondary bg-white"
                rows={3}
              />
            </div>
            
            <div>
              <Label className="text-foreground font-bold mb-2 block">Full Article Content</Label>
              <Textarea
                value={editedStory.content}
                onChange={(e) => setEditedStory({ ...editedStory, content: e.target.value })}
                className="border-2 border-border focus:border-secondary bg-white font-mono text-sm"
                rows={14}
              />
            </div>

            <div>
              <Label className="text-foreground font-bold mb-2 flex items-center gap-2">
                <Youtube className="size-4" />
                YouTube Video URL (Optional)
              </Label>
              <Input
                value={editedStory.youtubeUrl || ''}
                onChange={(e) => setEditedStory({ ...editedStory, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="border-2 border-border focus:border-secondary bg-white"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Embed a YouTube video in your story
              </p>
            </div>

            <div>
              <Label className="text-foreground font-bold mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg border-2 border-border">
                {editedStory.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/20 text-foreground border border-secondary/30">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10 border-t-2 border-secondary/30 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="border-2 font-bold"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="gap-2 bg-secondary hover:bg-secondary/90 text-black font-bold px-8"
          >
            <Save className="size-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}