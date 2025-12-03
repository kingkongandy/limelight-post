import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Edit3, Sparkles, Zap, Bot, PenTool, Calendar, LogOut } from 'lucide-react';
import type { Vertical } from '../types';

interface HeaderProps {
  selectedVertical: Vertical | 'all';
  onVerticalChange: (vertical: Vertical | 'all') => void;
  onEditorToggle: () => void;
  onAgentToggle: () => void;
  onManualWriteToggle: () => void;
  onScheduleToggle: () => void;
  showEditor: boolean;
  onLogoClick?: () => void;
  isAdmin?: boolean;
  onAdminLogout?: () => void;
}

const verticals: { value: Vertical | 'all'; label: string; emoji: string }[] = [
  { value: 'arts-music', label: 'Arts & Music', emoji: '🎵' },
  { value: 'fashion-culture', label: 'Fashion & Culture', emoji: '✨' },
  { value: 'sports-leisure', label: 'Sports & Leisure', emoji: '⚽' },
  { value: 'business-news', label: 'Business & News', emoji: '💼' },
];

export function Header({ selectedVertical, onVerticalChange, onEditorToggle, onAgentToggle, onManualWriteToggle, onScheduleToggle, showEditor, onLogoClick, isAdmin, onAdminLogout }: HeaderProps) {
  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-xl border-b-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary text-black px-3 py-1 rounded-full">
              <Zap className="size-4 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">Breaking</span>
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">AI-Powered Celebrity News</span>
          </div>
          
          <div className="flex gap-2">
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  onClick={onAgentToggle}
                  size="sm"
                  className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-black"
                >
                  <Bot className="size-4" />
                  <span className="hidden sm:inline">AI Agent</span>
                </Button>
                <Button
                  variant={showEditor ? "default" : "outline"}
                  onClick={onEditorToggle}
                  size="sm"
                  className={showEditor 
                    ? "gap-2 bg-secondary hover:bg-secondary/90 text-black border-none" 
                    : "gap-2 border-secondary text-secondary hover:bg-secondary hover:text-black"
                  }
                >
                  <Edit3 className="size-4" />
                  <span className="hidden sm:inline">Editor</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onManualWriteToggle}
                  size="sm"
                  className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-black"
                >
                  <PenTool className="size-4" />
                  <span className="hidden sm:inline">Manual Write</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onScheduleToggle}
                  size="sm"
                  className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-black"
                >
                  <Calendar className="size-4" />
                  <span className="hidden sm:inline">Schedule</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onAdminLogout}
                  size="sm"
                  className="gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Logo Section */}
        <div className="py-6">
          <button 
            onClick={() => {
              onVerticalChange('all');
              onLogoClick?.();
            }}
            className="flex flex-col items-center gap-3 hover:opacity-90 transition-opacity mx-auto group"
          >
            <div className="relative">
              {/* Lime fruit elements */}
              <div className="flex items-center gap-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-3 border-secondary group-hover:border-accent transition-colors lime-glow">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1582769923195-c6e60dc1d8dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Lime"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-col items-center">
                  <h1 className="text-white text-5xl tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: '1' }}>
                    THE <span className="text-secondary">LIMELIGHT</span> POST
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-px w-8 bg-secondary"></div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      Fresh Takes Daily
                    </p>
                    <div className="h-px w-8 bg-secondary"></div>
                  </div>
                </div>
                
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-3 border-secondary group-hover:border-accent transition-colors lime-glow">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1582769923195-c6e60dc1d8dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Lime"
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                </div>
              </div>
            </div>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="border-t border-white/10">
          <div className="flex justify-center items-center gap-1 py-3 overflow-x-auto">
            {verticals.map((vertical) => (
              <button
                key={vertical.value}
                onClick={() => onVerticalChange(vertical.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all text-sm font-bold uppercase tracking-wide flex items-center gap-2 ${
                  selectedVertical === vertical.value
                    ? 'bg-secondary text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span>{vertical.emoji}</span>
                <span>{vertical.label}</span>
              </button>
            ))}
          </div>
        </nav>
        
        {/* AI Badge */}
        <div className="border-t border-white/10 py-2 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Sparkles className="size-3 text-secondary pulse-lime" />
            <span>Stories curated by AI</span>
          </div>
        </div>
      </div>
    </header>
  );
}