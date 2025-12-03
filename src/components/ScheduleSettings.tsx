import { useState, useEffect } from 'react';
import { Clock, Calendar, Zap, X } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ScheduleSettings {
  enabled: boolean;
  time: string;
  storiesPerVertical: number;
  lastRun: string | null;
}

interface ScheduleSettingsProps {
  onClose: () => void;
}

export function ScheduleSettings({ onClose }: ScheduleSettingsProps) {
  const [settings, setSettings] = useState<ScheduleSettings>({
    enabled: false,
    time: '06:00',
    storiesPerVertical: 3,
    lastRun: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch current settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d2c193b9/schedule-settings`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch schedule settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d2c193b9/schedule-settings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        alert('✅ Schedule settings saved successfully!');
        onClose();
      } else {
        alert('❌ Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save schedule settings:', error);
      alert('❌ Error saving settings. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-card border-2 border-secondary rounded-xl p-8">
          <p className="text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-secondary rounded-xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <Calendar className="size-8 text-secondary" />
            <div>
              <h2 className="text-2xl font-bold">Auto-Post Schedule</h2>
              <p className="text-sm text-muted-foreground mt-1">Automatically generate & post stories daily</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-border rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="p-6 space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border-2 border-border">
            <div className="flex items-center gap-3">
              <Zap className={`size-6 ${settings.enabled ? 'text-secondary' : 'text-muted-foreground'}`} />
              <div>
                <Label htmlFor="enabled" className="text-lg font-bold">Auto-Generation Enabled</Label>
                <p className="text-sm text-muted-foreground">Automatically post stories every day</p>
              </div>
            </div>
            <Switch
              id="enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>

          {/* Time Selection */}
          <div className="p-4 bg-background rounded-lg border-2 border-border space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-secondary" />
              <Label htmlFor="time" className="font-bold">Post Time (PST)</Label>
            </div>
            <input
              id="time"
              type="time"
              value={settings.time}
              onChange={(e) => setSettings({ ...settings, time: e.target.value })}
              className="w-full px-4 py-3 bg-card border-2 border-border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              disabled={!settings.enabled}
            />
            <p className="text-sm text-muted-foreground">
              {settings.enabled ? (
                <>Stories will be generated at <span className="font-bold text-secondary">{settings.time} PST</span> every day</>
              ) : (
                'Enable auto-generation to set a schedule'
              )}
            </p>
          </div>

          {/* Stories Per Vertical */}
          <div className="p-4 bg-background rounded-lg border-2 border-border space-y-3">
            <Label htmlFor="storiesPerVertical" className="font-bold">
              Stories Per Vertical
            </Label>
            <input
              id="storiesPerVertical"
              type="number"
              min="1"
              max="10"
              value={settings.storiesPerVertical}
              onChange={(e) => setSettings({ ...settings, storiesPerVertical: parseInt(e.target.value) || 3 })}
              className="w-full px-4 py-3 bg-card border-2 border-border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              disabled={!settings.enabled}
            />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Arts & Music: {settings.storiesPerVertical} stories/day</p>
              <p>• Fashion & Culture: {settings.storiesPerVertical} stories/day</p>
              <p>• Sports & Leisure: {settings.storiesPerVertical} stories/day</p>
              <p>• Business & News: {settings.storiesPerVertical} stories/day</p>
              <p className="font-bold text-secondary mt-2">
                Total: {settings.storiesPerVertical * 4} stories per day
              </p>
            </div>
          </div>

          {/* Last Run Info */}
          {settings.lastRun && (
            <div className="p-4 bg-secondary/10 rounded-lg border-2 border-secondary/20">
              <p className="text-sm">
                <span className="font-bold">Last automated post:</span>{' '}
                {new Date(settings.lastRun).toLocaleString('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                  timeZone: 'America/Los_Angeles',
                })}
              </p>
            </div>
          )}

          {/* Info Banner */}
          <div className="p-4 bg-blue-500/10 rounded-lg border-2 border-blue-500/20">
            <p className="text-sm text-blue-200">
              <span className="font-bold">💡 How it works:</span> At the scheduled time, the system will automatically generate {settings.storiesPerVertical} trending stories for each vertical ({settings.storiesPerVertical * 4} total) and add them to your blog. You can still manually generate additional stories anytime!
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t-2 border-border">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={saveSettings}
            className="flex-1 bg-secondary text-black hover:bg-secondary/90"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Schedule'}
          </Button>
        </div>
      </div>
    </div>
  );
}
