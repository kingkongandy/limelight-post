import { useEffect } from 'react';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Google AdSense Component
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get approved by Google AdSense (apply at google.com/adsense)
 * 2. Add your AdSense code to /index.html <head> section:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
 *            crossorigin="anonymous"></script>
 * 3. Replace "ca-pub-XXXXXXXXXXXXXXXX" below with your actual Publisher ID
 * 4. Replace slot IDs with your actual ad unit slot IDs from AdSense dashboard
 */

export function AdSense({ slot, format = 'auto', style, className = '' }: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // ⚠️ REPLACE WITH YOUR ADSENSE ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      
      {/* Placeholder for development */}
      {process.env.NODE_ENV !== 'production' && (
        <div 
          className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-600 text-sm font-bold"
          style={style || { minHeight: '250px' }}
        >
          📢 AdSense Placeholder
          <br />
          (Ads show after approval)
        </div>
      )}
    </div>
  );
}

// Pre-configured ad formats for common placements
export function AdSenseHeader() {
  return (
    <AdSense
      slot="1234567890" // Replace with your header ad slot
      format="horizontal"
      style={{ minHeight: '90px' }}
      className="mb-4"
    />
  );
}

export function AdSenseSidebar() {
  return (
    <AdSense
      slot="0987654321" // Replace with your sidebar ad slot
      format="vertical"
      style={{ minHeight: '600px' }}
      className="sticky top-4"
    />
  );
}

export function AdSenseInFeed() {
  return (
    <AdSense
      slot="1122334455" // Replace with your in-feed ad slot
      format="fluid"
      style={{ minHeight: '250px' }}
      className="my-6"
    />
  );
}

export function AdSenseArticle() {
  return (
    <AdSense
      slot="5544332211" // Replace with your in-article ad slot
      format="fluid"
      style={{ minHeight: '300px' }}
      className="my-8"
    />
  );
}
