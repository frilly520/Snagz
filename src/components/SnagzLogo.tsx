import React from 'react';

export interface SnagzLogoProps {
  variant?: 'full' | 'symbol' | 'wordmark';
  theme?: 'dark' | 'light' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SnagzSymbol: React.FC<{ size?: number; className?: string; monochrome?: boolean }> = ({
  size = 36,
  className = '',
  monochrome = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
    >
      <defs>
        <linearGradient id="snagzEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="snagzSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>

      {/* Rounded squircle background */}
      <rect 
        width="100" 
        height="100" 
        rx="24" 
        fill={monochrome ? '#262626' : '#0e1713'} 
        stroke={monochrome ? '#404040' : '#10b981'} 
        strokeWidth="2.5" 
        strokeOpacity={monochrome ? '0.5' : '0.4'}
      />

      {/* Snag "S" Hook Glyph */}
      <path
        d="M 69 31 L 43 31 C 36 31 30 36 30 43 C 30 50 35 55 42 57 L 61 63 C 67 65 71 69 71 75 C 71 82 65 87 56 87 L 29 87 L 29 76 L 56 76 C 59 76 61 74 61 72 C 61 70 59 68 56 67 L 37 61 C 30 59 25 54 25 46 C 25 36 34 27 46 27 L 73 27 Z"
        fill={monochrome ? '#ffffff' : 'url(#snagzEmeraldGrad)'}
      />

      {/* Spark capture accent */}
      <path
        d="M 72 22 L 79 33 L 71 33 L 75 44 L 63 35 L 70 35 Z"
        fill={monochrome ? '#e5e5e5' : 'url(#snagzSparkGrad)'}
      />

      {/* Tag eyelet circle */}
      <circle
        cx="44"
        cy="42"
        r="3.5"
        fill="#0e1713"
        stroke={monochrome ? '#ffffff' : '#34d399'}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const SnagzLogo: React.FC<SnagzLogoProps> = ({
  variant = 'full',
  theme = 'dark',
  size = 'md',
  showTagline = false,
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: { symbol: 24, text: 'text-base', tagline: 'text-[9px]' },
    sm: { symbol: 28, text: 'text-lg', tagline: 'text-[10px]' },
    md: { symbol: 36, text: 'text-2xl', tagline: 'text-[11px]' },
    lg: { symbol: 48, text: 'text-3xl', tagline: 'text-xs' },
    xl: { symbol: 64, text: 'text-5xl', tagline: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isMonochrome = theme === 'monochrome';
  const isLight = theme === 'light';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {(variant === 'full' || variant === 'symbol') && (
        <SnagzSymbol
          size={currentSize.symbol}
          monochrome={isMonochrome}
          className="shadow-sm"
        />
      )}

      {(variant === 'full' || variant === 'wordmark') && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline">
            <span
              className={`font-black tracking-tight ${currentSize.text} ${
                isLight ? 'text-neutral-900' : isMonochrome ? 'text-white' : 'text-white'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              SNAG
              <span className={isMonochrome ? 'text-neutral-400' : 'text-emerald-400'}>
                Z
              </span>
            </span>
          </div>
          {showTagline && (
            <span
              className={`font-bold tracking-widest uppercase mt-0.5 ${currentSize.tagline} ${
                isLight ? 'text-neutral-600' : isMonochrome ? 'text-neutral-400' : 'text-emerald-400/90'
              }`}
              style={{ letterSpacing: '0.15em' }}
            >
              Find it. Save it. Snag it.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
