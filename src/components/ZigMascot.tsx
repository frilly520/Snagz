import React from 'react';

export type ZigExpression = 'confident' | 'hunting' | 'celebrating' | 'thinking';

interface ZigAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  expression?: ZigExpression;
  className?: string;
  glow?: boolean;
}

/**
 * ZIG Mascot Avatar & Head Component
 * An original, tech-forward deal-hunter character:
 * - Sleek dark-graphite cyber scout head
 * - Signature zig-zag signal ears / deal-radar antennae (inspired by "ZIG" lightning & SNAGZ "S")
 * - Curved holographic scanner visor with neon-emerald target reticle
 * - Subtle confident/mischievous smirk
 * - Crisp contrast against dark backgrounds; scales down gracefully to 20px-32px
 */
export const ZigAvatar: React.FC<ZigAvatarProps> = ({
  size = 'md',
  expression = 'confident',
  className = '',
  glow = false
}) => {
  let pixelSize = 40;
  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    switch (size) {
      case 'xs': pixelSize = 24; break;
      case 'sm': pixelSize = 32; break;
      case 'md': pixelSize = 44; break;
      case 'lg': pixelSize = 64; break;
      case 'xl': pixelSize = 96; break;
    }
  }

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      aria-label="ZIG — Your Deal Hunter"
    >
      {glow && (
        <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-md pointer-events-none animate-pulse" />
      )}
      <svg
        viewBox="0 0 100 100"
        width={pixelSize}
        height={pixelSize}
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="zig-helmet" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#262626" />
            <stop offset="50%" stopColor="#171717" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>

          <linearGradient id="zig-visor" x1="25" y1="40" x2="75" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="45%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="zig-ear-neon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="zig-accent-amber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <filter id="zig-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Aura Frame (keeps icon cohesive at small nav sizes) */}
        <circle cx="50" cy="50" r="47" fill="#0d1117" stroke="#10b981" strokeWidth="2.5" strokeOpacity="0.4" />

        {/* LEFT SIGNAL RADAR EAR (Zig-Zag Angle) */}
        <g id="zig-left-ear">
          <path
            d="M 28 34 L 12 12 L 24 16 L 36 28 Z"
            fill="url(#zig-helmet)"
            stroke="#10b981"
            strokeWidth="2"
          />
          {/* Ear Neon Pulse Core */}
          <path
            d="M 24 28 L 16 16 L 22 18 L 30 26 Z"
            fill="url(#zig-ear-neon)"
          />
        </g>

        {/* RIGHT SIGNAL RADAR EAR (Zig-Zag Angle) */}
        <g id="zig-right-ear">
          <path
            d="M 72 34 L 88 12 L 76 16 L 64 28 Z"
            fill="url(#zig-helmet)"
            stroke="#10b981"
            strokeWidth="2"
          />
          {/* Ear Neon Pulse Core */}
          <path
            d="M 76 28 L 84 16 L 78 18 L 70 26 Z"
            fill="url(#zig-ear-neon)"
          />
        </g>

        {/* MAIN HEAD (Sleek Geometric Tech Hood) */}
        <path
          d="M 25 45 C 25 28, 75 28, 75 45 C 75 68, 68 82, 50 84 C 32 82, 25 68, 25 45 Z"
          fill="url(#zig-helmet)"
          stroke="#404040"
          strokeWidth="2"
        />

        {/* Forehead Deal Antenna Pin / SNAGZ Notch */}
        <path
          d="M 46 25 L 54 25 L 52 33 L 48 33 Z"
          fill="#10b981"
        />
        <circle cx="50" cy="23" r="2.5" fill="#34d399" />

        {/* HOLOGRAPHIC SCANNER VISOR (High-tech Deal Hunter Eye) */}
        <path
          d="M 27 46 C 27 40, 73 40, 73 46 C 73 59, 66 64, 50 64 C 34 64, 27 59, 27 46 Z"
          fill="#052e16"
          stroke="#10b981"
          strokeWidth="2.5"
        />

        {/* Visor Neon Glow Lens */}
        <path
          d="M 30 47 C 30 43, 70 43, 70 47 C 70 57, 63 61, 50 61 C 37 61, 30 57, 30 47 Z"
          fill="url(#zig-visor)"
          opacity="0.9"
        />

        {/* Visor Glint / Reflection Stripe */}
        <path
          d="M 33 45 Q 50 43 65 47"
          stroke="#a7f3d0"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* SCANNER RETICLE / DEAL-HUNTER TARGET */}
        {expression === 'hunting' || expression === 'thinking' ? (
          // Active Scanning Crosshair Target
          <g id="scanner-reticle" className="animate-pulse">
            <circle cx="50" cy="52" r="6" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
            <line x1="40" y1="52" x2="60" y2="52" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="50" y1="44" x2="50" y2="60" stroke="#fbbf24" strokeWidth="1.5" />
            <circle cx="50" cy="52" r="2" fill="#ffffff" />
          </g>
        ) : (
          // Confident / Alert Scanner Eye Pair with Holographic Rings
          <g id="scanner-eyes">
            {/* Left Scanner Lens */}
            <circle cx="41" cy="52" r="4.5" fill="#042f1a" stroke="#a7f3d0" strokeWidth="1.2" />
            <circle cx="42" cy="51" r="2.2" fill="#ffffff" />
            
            {/* Right Scanner Lens */}
            <circle cx="59" cy="52" r="4.5" fill="#042f1a" stroke="#a7f3d0" strokeWidth="1.2" />
            <circle cx="60" cy="51" r="2.2" fill="#ffffff" />

            {/* Mischievous wink / HUD tick mark */}
            <line x1="47" y1="52" x2="53" y2="52" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>
        )}

        {/* MISCHIEVOUS & CONFIDENT SMIRK */}
        {expression === 'celebrating' ? (
          // Big excited grin
          <path
            d="M 42 71 Q 50 78 58 71"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : expression === 'thinking' ? (
          // Curious smirk
          <path
            d="M 44 72 Q 49 71 56 73"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          // Signature ZIG Smirk (slightly raised right corner, clever & confident)
          <path
            d="M 42 72 C 46 72, 53 74, 58 70"
            stroke="#34d399"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* CHEEK SENSOR LIGHTS */}
        <circle cx="34" cy="65" r="1.5" fill="#10b981" opacity="0.8" />
        <circle cx="66" cy="65" r="1.5" fill="#10b981" opacity="0.8" />

        {/* MINI SNAGZ DEAL BADGE / COLLAR TAG */}
        <g id="zig-collar-tag" transform="translate(43, 79)">
          <rect width="14" height="10" rx="3" fill="#10b981" />
          <path
            d="M 4 2.5 H 10 M 4 5 H 8 M 4 7.5 H 9"
            stroke="#0a0a0a"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="10.5" cy="5" r="1" fill="#fbbf24" />
        </g>
      </svg>
    </div>
  );
};

/**
 * ZIG Bottom Nav Icon
 * Specifically proportioned to fit inside the mobile navigation tab.
 */
export const ZigNavIcon: React.FC<{ active?: boolean }> = ({ active = false }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulsing ring for active state */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${
        active 
          ? 'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-950 scale-105' 
          : 'bg-gradient-to-tr from-neutral-800 to-neutral-700 p-[1.5px] hover:border-emerald-500'
      }`}>
        <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center overflow-hidden">
          <ZigAvatar size={38} expression={active ? 'hunting' : 'confident'} glow={active} />
        </div>
      </div>
      {/* Live Hunter Radar Dot */}
      <span className="absolute top-0 right-0 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-neutral-950" />
      </span>
    </div>
  );
};

/**
 * ZIG Chat Header Widget
 * Displays ZIG's identity, avatar, status, and tag.
 */
export const ZigChatHeaderTitle: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-emerald-500/40 p-0.5 shadow-md flex items-center justify-center">
          <ZigAvatar size={36} expression="confident" glow />
        </div>
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-neutral-950 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </span>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-black text-white tracking-wide flex items-center gap-1">
            <span>ZIG</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-neutral-950 font-bold uppercase tracking-wider">
              Deal Hunter
            </span>
          </h2>
        </div>
        <p className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span>Hunting live discounts & savings recipes</span>
        </p>
      </div>
    </div>
  );
};

/**
 * ZIG Thinking & Hunting Radar Animation
 * Visualized during AI query generation:
 * ZIG's scanner sweeps live deals, radar rings expand, and signal tags flutter.
 */
export const ZigThinkingAnimation: React.FC = () => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-950/90 border border-emerald-500/30 text-neutral-300 text-xs shadow-lg">
      <div className="relative shrink-0">
        <ZigAvatar size={36} expression="hunting" glow />
        <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-30 pointer-events-none" />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-xs">ZIG is hunting...</span>
          <span className="inline-flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          Scanning store ads, coupon stacks, rewards & money-maker thresholds...
        </p>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-emerald-400/80 font-mono">
          <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">CVS ExtraCare</span>
          <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">Target Circle</span>
          <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">Ibotta Rebates</span>
        </div>
      </div>
    </div>
  );
};

/**
 * ZIG Empty Chat State & Welcome Card
 * Prominently presents ZIG with his signature welcome message and deal-hunter posture.
 */
export const ZigEmptyChatIllustration: React.FC<{
  onSelectPrompt: (promptText: string) => void;
}> = ({ onSelectPrompt }) => {
  const quickActions = [
    { label: "What's the best deal at CVS?", icon: "🏪", desc: "Digital coupon + ExtraBucks stack" },
    { label: "Find me a money maker.", icon: "💰", desc: "Rewards exceed register price" },
    { label: "Find me something FREE.", icon: "🎁", desc: "$0 100% free verified offers" },
    { label: "I have $20. What should I buy?", icon: "💵", desc: "Max savings budget recipe" },
    { label: "Build me the best CVS transaction.", icon: "🧺", desc: "Toothpaste & laundry rolling stack" },
    { label: "What's expiring today?", icon: "⏰", desc: "Urgent final-call promotions" },
  ];

  return (
    <div className="flex flex-col items-center text-center p-4 sm:p-6 space-y-4">
      {/* Full ZIG Mascot Spotlight Illustration */}
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
        <div className="relative w-28 h-28 rounded-3xl bg-neutral-950 border-2 border-emerald-500/50 shadow-2xl flex items-center justify-center p-2">
          <ZigAvatar size={88} expression="confident" glow />
          {/* Magnifying holographic reticle overlay */}
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-neutral-950 p-1.5 rounded-xl font-black text-[10px] flex items-center gap-1 shadow-lg border border-neutral-950">
            <span>READY</span>
          </div>
        </div>
      </div>

      {/* Identity & Welcome Callout */}
      <div className="max-w-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
          <span>⚡ ZIG — Your Deal Hunter</span>
        </div>
        <h3 className="text-base sm:text-lg font-black text-white">
          “Hey, I’m ZIG. Give me a store, a product, or a budget and I’ll hunt down the best deal I can find.”
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          I don't just find coupons—I compute complete <strong className="text-neutral-200">Savings Recipes</strong>, check store reward thresholds, uncover <strong className="text-amber-400">Money Makers</strong>, and calculate your exact out-of-pocket register total.
        </p>
      </div>

      {/* Quick Action Prompts */}
      <div className="w-full pt-2">
        <p className="text-[11px] font-bold text-neutral-400 text-left mb-2 flex items-center justify-between">
          <span>Quick Deal Inquiries:</span>
          <span className="text-emerald-400 font-normal">Tap to ask ZIG</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectPrompt(qa.label)}
              className="group p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 transition-all flex items-start gap-2.5 text-left"
            >
              <span className="text-base shrink-0 p-1 rounded-lg bg-neutral-900 group-hover:bg-emerald-950 transition-colors">
                {qa.icon}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-neutral-200 group-hover:text-emerald-300 transition-colors">
                  {qa.label}
                </div>
                <div className="text-[10px] text-neutral-500 group-hover:text-neutral-400 truncate">
                  {qa.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
