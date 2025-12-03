import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { X, Bot, Sparkles, Play, Settings, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { AgentConfig, Vertical, Story } from '../types';

interface AIAgentPanelProps {
  config: AgentConfig;
  onClose: () => void;
  onUpdateConfig: (config: AgentConfig) => void;
  onGenerateStories: (vertical: Vertical, count: number, customPrompt?: string, useMockMode?: boolean) => void;
  isGenerating: boolean;
  onGoLive?: () => void; // Optional Go Live handler
}

const verticalLabels: Record<Vertical, string> = {
  'arts-music': 'Arts & Music',
  'sports-leisure': 'Sports & Leisure',
  'fashion-culture': 'Fashion & Culture',
  'business-news': 'Business & News',
};

const verticalColors: Record<Vertical, string> = {
  'arts-music': 'bg-purple-500',
  'sports-leisure': 'bg-blue-500',
  'fashion-culture': 'bg-pink-500',
  'business-news': 'bg-orange-500',
};

const defaultPrompts: Record<Vertical, string> = {
  'arts-music': 'Find trending stories about musicians, artists, concerts, album releases, viral performances, and entertainment industry news',
  'fashion-culture': 'Discover fashion week updates, designer launches, celebrity style, cultural movements, and influential trends',
  'sports-leisure': 'Cover athlete achievements, sports events, fitness trends, esports, and leisure activities gaining popularity',
  'business-news': 'Report on entrepreneur ventures, tech startups, creator economy, business deals, and financial news affecting influencers',
};

export function AIAgentPanel({ config, onClose, onUpdateConfig, onGenerateStories, isGenerating, onGoLive }: AIAgentPanelProps) {
  const [editedConfig, setEditedConfig] = useState<AgentConfig>(config);
  const [selectedVertical, setSelectedVertical] = useState<Vertical>('arts-music');
  const [customPrompt, setCustomPrompt] = useState('');
  const [storyCount, setStoryCount] = useState(1);
  const [useMockMode, setUseMockMode] = useState(true); // Default to TRUE so it works immediately!

  const handleSaveConfig = () => {
    onUpdateConfig(editedConfig);
  };

  const handleGenerateNow = () => {
    onGenerateStories(selectedVertical, storyCount, customPrompt || undefined, useMockMode);
    setCustomPrompt('');
  };

  const handlePromptChange = (vertical: Vertical, prompt: string) => {
    setEditedConfig({
      ...editedConfig,
      verticalPrompts: {
        ...editedConfig.verticalPrompts,
        [vertical]: prompt,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col border-4 border-secondary">
        <div className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10 border-b-2 border-secondary/30 flex items-center justify-between">
          <div>
            <h2 className="text-foreground flex items-center gap-3" 
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: '800' }}>
              <Bot className="size-8 text-secondary" />
              AI Story Agent
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure automatic story generation and create stories on demand
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
        
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="generate" className="gap-2">
                <Zap className="size-4" />
                Generate Stories
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="size-4" />
                Automation Settings
              </TabsTrigger>
            </TabsList>
            
            {/* Generate Stories Tab */}
            <TabsContent value="generate" className="space-y-6">
              {/* GO LIVE Button */}
              {onGoLive && (
                <div className="bg-gradient-to-r from-green-500/10 to-secondary/10 border-2 border-green-500 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <Zap className="size-5 text-green-500" />
                        🚀 Go Live Feature
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Launch your site with 12 fresh stories (3 per vertical). 
                        Deletes all mock data and publishes real content from today's news.
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                        <li>✅ Generates 12 real AI stories</li>
                        <li>❌ Removes all mock/demo content</li>
                        <li>💰 Costs ~$0.10 in OpenAI credits</li>
                        <li>⏱️ Takes ~2-3 minutes</li>
                      </ul>
                    </div>
                    <Button
                      onClick={onGoLive}
                      disabled={isGenerating}
                      className="gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-6 text-base shadow-lg"
                    >
                      <Zap className="size-5" />
                      GO LIVE
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Status Banner */}
              <div className="bg-gradient-to-br from-secondary/20 to-accent/20 border-2 border-secondary rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="font-bold text-foreground">
                      Agent Status: {config.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {config.lastGeneration && (
                    <Badge variant="outline" className="gap-1.5">
                      <Clock className="size-3" />
                      Last run: {new Date(config.lastGeneration).toLocaleString()}
                    </Badge>
                  )}
                </div>
                {config.enabled && config.nextGeneration && (
                  <p className="text-sm text-foreground/70">
                    Next automatic generation scheduled for {new Date(config.nextGeneration).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Manual Generation */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="size-5 text-secondary" />
                  <h3 className="font-bold text-lg">Generate Stories Now</h3>
                </div>

                {/* Mock Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg border-2 border-yellow-500/30">
                  <div className="flex-1">
                    <Label className="font-bold text-base">Mock Mode (Demo)</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {useMockMode 
                        ? '✅ Using fake stories (FREE - no OpenAI needed)'
                        : '⚠️ Using Real AI (requires OpenAI billing)'}
                    </p>
                  </div>
                  <Switch
                    checked={useMockMode}
                    onCheckedChange={setUseMockMode}
                  />
                </div>

                <div>
                  <Label className="mb-2 block font-bold">Select Vertical</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(verticalLabels) as Vertical[]).map((vertical) => (
                      <button
                        key={vertical}
                        onClick={() => setSelectedVertical(vertical)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedVertical === vertical
                            ? 'border-secondary bg-secondary/10'
                            : 'border-border hover:border-secondary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${verticalColors[vertical]}`}></div>
                          <span className="font-bold">{verticalLabels[vertical]}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {editedConfig.verticalPrompts[vertical]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block font-bold">Number of Stories</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={storyCount}
                    onChange={(e) => setStoryCount(parseInt(e.target.value) || 1)}
                    className="border-2 border-border focus:border-secondary"
                  />
                </div>

                <div>
                  <Label className="mb-2 block font-bold">Custom Prompt (Optional)</Label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., 'Focus on controversies', 'Only positive stories', 'Stories about Gen Z influencers'"
                    className="border-2 border-border focus:border-secondary"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use the default vertical prompt
                  </p>
                </div>

                <Button
                  onClick={handleGenerateNow}
                  disabled={isGenerating}
                  className="w-full gap-2 bg-secondary hover:bg-secondary/90 text-black font-bold py-6 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Bot className="size-5 animate-spin" />
                      Generating Stories...
                    </>
                  ) : (
                    <>
                      <Play className="size-5" />
                      Generate {storyCount} {storyCount === 1 ? 'Story' : 'Stories'} for {verticalLabels[selectedVertical]}
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-6">
                {/* Enable Agent */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg border-2 border-border">
                  <div className="flex-1">
                    <Label className="font-bold text-base">Enable AI Agent</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Allow the AI to automatically generate stories
                    </p>
                  </div>
                  <Switch
                    checked={editedConfig.enabled}
                    onCheckedChange={(enabled) => setEditedConfig({ ...editedConfig, enabled })}
                  />
                </div>

                {/* Auto Generate Daily */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg border-2 border-border">
                  <div className="flex-1">
                    <Label className="font-bold text-base">Daily Auto-Generation</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Automatically generate stories every day
                    </p>
                  </div>
                  <Switch
                    checked={editedConfig.autoGenerateDaily}
                    onCheckedChange={(autoGenerateDaily) => 
                      setEditedConfig({ ...editedConfig, autoGenerateDaily })
                    }
                    disabled={!editedConfig.enabled}
                  />
                </div>

                {/* Generation Time */}
                <div>
                  <Label className="mb-2 block font-bold">Daily Generation Time</Label>
                  <Input
                    type="time"
                    value={editedConfig.generationTime}
                    onChange={(e) => setEditedConfig({ ...editedConfig, generationTime: e.target.value })}
                    className="border-2 border-border focus:border-secondary"
                    disabled={!editedConfig.enabled || !editedConfig.autoGenerateDaily}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Stories will be generated at this time each day
                  </p>
                </div>

                {/* Stories Per Day */}
                <div>
                  <Label className="mb-2 block font-bold">Stories Per Vertical Per Day</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={editedConfig.storiesPerDay}
                    onChange={(e) => setEditedConfig({ 
                      ...editedConfig, 
                      storiesPerDay: parseInt(e.target.value) || 1 
                    })}
                    className="border-2 border-border focus:border-secondary"
                    disabled={!editedConfig.enabled || !editedConfig.autoGenerateDaily}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Total daily stories: {editedConfig.storiesPerDay * 4} ({editedConfig.storiesPerDay} per vertical)
                  </p>
                </div>

                {/* Vertical Prompts */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="size-5 text-secondary" />
                    <h3 className="font-bold text-lg">Vertical Prompts</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure what type of stories the AI should generate for each vertical
                  </p>
                  
                  <div className="space-y-4">
                    {(Object.keys(verticalLabels) as Vertical[]).map((vertical) => (
                      <div key={vertical} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${verticalColors[vertical]}`}></div>
                          <Label className="font-bold">{verticalLabels[vertical]}</Label>
                        </div>
                        <Textarea
                          value={editedConfig.verticalPrompts[vertical]}
                          onChange={(e) => handlePromptChange(vertical, e.target.value)}
                          className="border-2 border-border focus:border-secondary"
                          rows={2}
                          disabled={!editedConfig.enabled}
                        />
                        <button
                          onClick={() => handlePromptChange(vertical, defaultPrompts[vertical])}
                          className="text-xs text-secondary hover:underline"
                        >
                          Reset to default
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveConfig}
                    className="flex-1 gap-2 bg-secondary hover:bg-secondary/90 text-black font-bold py-6"
                  >
                    <CheckCircle2 className="size-5" />
                    Save Configuration
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}