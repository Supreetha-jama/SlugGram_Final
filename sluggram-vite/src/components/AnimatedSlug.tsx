interface AnimatedSlugProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-28 h-28',
};

export function AnimatedSlug({ size = 'md', className = '' }: AnimatedSlugProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={`${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes slugBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          @keyframes eyeBlink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes antennaWiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(8deg); }
            75% { transform: rotate(-8deg); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .slug-body { animation: slugBounce 1.5s ease-in-out infinite; }
          .slug-eye { animation: eyeBlink 3s ease-in-out infinite; transform-origin: center; }
          .slug-eye-right { animation-delay: 0.15s; }
          .antenna-left { animation: antennaWiggle 2s ease-in-out infinite; transform-origin: 25px 35px; }
          .antenna-right { animation: antennaWiggle 2s ease-in-out infinite 0.3s; transform-origin: 40px 35px; }
          .eye-sparkle { animation: sparkle 2s ease-in-out infinite; }
        `}
      </style>

      {/* Main body group with bounce animation */}
      <g className="slug-body">
        {/* Backpack */}
        <rect x="55" y="30" width="22" height="28" rx="4" fill="#003C6C" />
        <rect x="57" y="32" width="18" height="10" rx="2" fill="#002548" />
        {/* Backpack straps */}
        <path d="M55 35 Q50 40 48 50" stroke="#003C6C" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M77 35 Q82 40 84 50" stroke="#003C6C" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Backpack pocket */}
        <rect x="60" y="44" width="12" height="10" rx="2" fill="#FDC700" />
        {/* Backpack zipper */}
        <line x1="66" y1="33" x2="66" y2="40" stroke="#FDC700" strokeWidth="1.5" strokeLinecap="round" />

        {/* Body - Banana slug yellow - rounder and cuter */}
        <ellipse cx="55" cy="55" rx="38" ry="18" fill="#FDC700" />

        {/* Body highlight for 3D effect */}
        <ellipse cx="55" cy="50" rx="30" ry="10" fill="#FFE066" opacity="0.5" />

        {/* Cute body spots */}
        <circle cx="40" cy="52" r="4" fill="#E5B300" opacity="0.5" />
        <circle cx="60" cy="58" r="5" fill="#E5B300" opacity="0.5" />
        <circle cx="78" cy="52" r="3" fill="#E5B300" opacity="0.5" />
        <circle cx="50" cy="60" r="2.5" fill="#E5B300" opacity="0.5" />

        {/* Head - rounder and cuter */}
        <ellipse cx="25" cy="48" rx="16" ry="16" fill="#FDC700" />

        {/* Head highlight */}
        <ellipse cx="22" cy="43" rx="10" ry="8" fill="#FFE066" opacity="0.4" />

        {/* Cheek blush - cute! */}
        <ellipse cx="14" cy="52" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="36" cy="52" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.6" />

        {/* Left antenna */}
        <g className="antenna-left">
          <path d="M20 35 Q16 22 10 15" stroke="#FDC700" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="10" cy="15" r="4" fill="#FDC700" />
          <circle cx="10" cy="15" r="2" fill="#003C6C" />
        </g>

        {/* Right antenna */}
        <g className="antenna-right">
          <path d="M30 35 Q34 22 40 15" stroke="#FDC700" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="15" r="4" fill="#FDC700" />
          <circle cx="40" cy="15" r="2" fill="#003C6C" />
        </g>

        {/* Eyes - bigger and cuter */}
        <g className="slug-eye">
          <ellipse cx="18" cy="45" rx="5" ry="6" fill="white" />
          <ellipse cx="18" cy="46" rx="3.5" ry="4" fill="#003C6C" />
          <circle cx="16" cy="44" r="1.5" fill="white" className="eye-sparkle" />
        </g>
        <g className="slug-eye slug-eye-right">
          <ellipse cx="32" cy="45" rx="5" ry="6" fill="white" />
          <ellipse cx="32" cy="46" rx="3.5" ry="4" fill="#003C6C" />
          <circle cx="30" cy="44" r="1.5" fill="white" className="eye-sparkle" />
        </g>

        {/* Happy smile - curved more */}
        <path d="M19 55 Q25 62 31 55" stroke="#003C6C" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Tail end - rounder */}
        <ellipse cx="92" cy="55" rx="6" ry="10" fill="#FDC700" />
        <ellipse cx="92" cy="52" rx="4" ry="5" fill="#FFE066" opacity="0.4" />
      </g>
    </svg>
  );
}

// Static version for places where animation might be distracting
export function StaticSlug({ size = 'md', className = '' }: AnimatedSlugProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={`${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Backpack */}
      <rect x="55" y="30" width="22" height="28" rx="4" fill="#003C6C" />
      <rect x="57" y="32" width="18" height="10" rx="2" fill="#002548" />
      <path d="M55 35 Q50 40 48 50" stroke="#003C6C" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M77 35 Q82 40 84 50" stroke="#003C6C" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="60" y="44" width="12" height="10" rx="2" fill="#FDC700" />
      <line x1="66" y1="33" x2="66" y2="40" stroke="#FDC700" strokeWidth="1.5" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="55" cy="55" rx="38" ry="18" fill="#FDC700" />
      <ellipse cx="55" cy="50" rx="30" ry="10" fill="#FFE066" opacity="0.5" />

      {/* Spots */}
      <circle cx="40" cy="52" r="4" fill="#E5B300" opacity="0.5" />
      <circle cx="60" cy="58" r="5" fill="#E5B300" opacity="0.5" />
      <circle cx="78" cy="52" r="3" fill="#E5B300" opacity="0.5" />

      {/* Head */}
      <ellipse cx="25" cy="48" rx="16" ry="16" fill="#FDC700" />
      <ellipse cx="22" cy="43" rx="10" ry="8" fill="#FFE066" opacity="0.4" />

      {/* Cheeks */}
      <ellipse cx="14" cy="52" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.6" />
      <ellipse cx="36" cy="52" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.6" />

      {/* Antennae */}
      <path d="M20 35 Q16 22 10 15" stroke="#FDC700" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="10" cy="15" r="4" fill="#FDC700" />
      <circle cx="10" cy="15" r="2" fill="#003C6C" />
      <path d="M30 35 Q34 22 40 15" stroke="#FDC700" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="15" r="4" fill="#FDC700" />
      <circle cx="40" cy="15" r="2" fill="#003C6C" />

      {/* Eyes */}
      <ellipse cx="18" cy="45" rx="5" ry="6" fill="white" />
      <ellipse cx="18" cy="46" rx="3.5" ry="4" fill="#003C6C" />
      <circle cx="16" cy="44" r="1.5" fill="white" />
      <ellipse cx="32" cy="45" rx="5" ry="6" fill="white" />
      <ellipse cx="32" cy="46" rx="3.5" ry="4" fill="#003C6C" />
      <circle cx="30" cy="44" r="1.5" fill="white" />

      {/* Smile */}
      <path d="M19 55 Q25 62 31 55" stroke="#003C6C" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Tail */}
      <ellipse cx="92" cy="55" rx="6" ry="10" fill="#FDC700" />
    </svg>
  );
}
