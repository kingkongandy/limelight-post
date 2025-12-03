import { Mail, Instagram, Twitter, Youtube } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

// TikTok icon (Lucide doesn't have it)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-secondary mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-3 border-secondary lime-glow">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1582769923195-c6e60dc1d8dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Lime"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                THE <span className="text-secondary">LIMELIGHT</span> POST
              </h3>
            </div>
            <p className="text-sm text-gray-400 text-center md:text-left">
              AI-powered celebrity and influencer news. Fresh takes on trending topics, delivered daily.
            </p>
          </div>

          {/* Got a Story? */}
          <div className="flex flex-col items-center justify-center gap-4">
            <h4 className="font-bold text-lg text-secondary uppercase tracking-wider">Got a Story?</h4>
            <a href="mailto:andrew@limelightpost.com">
              <Button className="gap-2 bg-secondary hover:bg-secondary/90 text-black font-bold px-6 py-6">
                <Mail className="size-5" />
                Email Us
              </Button>
            </a>
            <p className="text-xs text-gray-500">andrew@limelightpost.com</p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h4 className="font-bold text-lg text-secondary uppercase tracking-wider">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/thelimelightpost/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Instagram className="size-6" />
              </a>
              <a
                href="https://x.com/liMelitepoSt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black border-2 border-secondary flex items-center justify-center hover:scale-110 transition-transform hover:bg-secondary hover:text-black"
              >
                <Twitter className="size-6" />
              </a>
              <a
                href="https://www.youtube.com/@THELIMELIGHTPOST/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Youtube className="size-6" />
              </a>
              <a
                href="https://www.tiktok.com/@limelightpost?_r=1&_t=ZT-91tw1h5MnFd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-pink-600 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <TikTokIcon className="size-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-secondary to-transparent mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2025 The Limelight Post. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-secondary transition-colors">Privacy Policy</button>
            <button className="hover:text-secondary transition-colors">Terms of Service</button>
            <button className="hover:text-secondary transition-colors">Contact</button>
          </div>
        </div>

        {/* AI Disclaimer */}
        <div className="mt-6 text-center text-xs text-gray-600 bg-white/5 rounded-lg p-3">
          ⚠️ Stories are AI-generated based on real news sources. Always verify information independently.
        </div>
      </div>
    </footer>
  );
}
