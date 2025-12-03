import { ImageWithFallback } from './figma/ImageWithFallback';

interface FakeAdProps {
  type: 'banner' | 'square' | 'vertical' | 'leaderboard';
  className?: string;
}

const fakeAds = {
  banner: [
    {
      brand: 'LUXE WATCHES',
      tagline: 'Time never looked this good',
      bg: 'from-purple-900 to-pink-900',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
    },
    {
      brand: 'NEON SNEAKERS',
      tagline: 'Step into the spotlight',
      bg: 'from-green-600 to-lime-600',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
    {
      brand: 'CLOUDSTREAM',
      tagline: 'Music that moves you',
      bg: 'from-blue-900 to-cyan-900',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    },
  ],
  square: [
    {
      brand: 'GLOW COSMETICS',
      tagline: 'Shine bright',
      bg: 'from-pink-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
    },
    {
      brand: 'FITPULSE',
      tagline: 'Your fitness, elevated',
      bg: 'from-orange-600 to-red-600',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    },
  ],
  vertical: [
    {
      brand: 'URBAN THREADS',
      tagline: 'Fashion for the fearless',
      bg: 'from-indigo-900 to-purple-900',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
    },
  ],
  leaderboard: [
    {
      brand: 'VELOCITY ENERGY',
      tagline: 'Fuel your ambition',
      bg: 'from-yellow-500 to-orange-500',
      image: 'https://images.unsplash.com/photo-1622543925917-763c34c1a571?w=800',
    },
  ],
};

export function FakeAd({ type, className = '' }: FakeAdProps) {
  const ads = fakeAds[type];
  const ad = ads[Math.floor(Math.random() * ads.length)];

  const sizes = {
    banner: 'h-32 w-full',
    square: 'h-64 w-64',
    vertical: 'h-96 w-48',
    leaderboard: 'h-24 w-full',
  };

  return (
    <div className={`${sizes[type]} ${className} relative overflow-hidden rounded-lg border-2 border-border group cursor-pointer`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${ad.bg} opacity-90`}></div>
      
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <ImageWithFallback
          src={ad.image}
          alt={ad.brand}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-white/60 text-xs mb-2 uppercase tracking-widest">Advertisement</p>
        <h3 
          className="text-white font-black text-2xl mb-2 drop-shadow-lg"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {ad.brand}
        </h3>
        <p className="text-white/90 text-sm italic">{ad.tagline}</p>
        <button className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm transition-all border border-white/30">
          LEARN MORE
        </button>
      </div>

      {/* AdSense Label */}
      <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-white text-[10px]">
        AdSense
      </div>
    </div>
  );
}
