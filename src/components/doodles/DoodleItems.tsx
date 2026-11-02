interface DoodleProps {
  size?: number;
  className?: string;
}

/** Heraldic shield with unicorn and stars */
export function DoodleShield({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Outer shield rim */}
      <path
        d="M32 4 L52 10 C52 38, 38 54, 32 60 C26 54, 12 38, 12 10 Z"
        fill="#005F73"
        stroke="#001219"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner shield field */}
      <path
        d="M32 8 L48 13 C48 35, 36 49, 32 54 C28 49, 16 35, 16 13 Z"
        fill="#E9D8A6"
        stroke="#001219"
        strokeWidth="1.5"
      />
      {/* Heraldic 3 stars */}
      <path d="M24 16 L25 18 L27 18 L25.5 19 L26 21 L24 20 L22 21 L22.5 19 L21 18 L23 18 Z" fill="#EE9B00" stroke="#001219" strokeWidth="1" />
      <path d="M32 14 L33 16 L35 16 L33.5 17 L34 19 L32 18 L30 19 L30.5 17 L29 16 L31 16 Z" fill="#EE9B00" stroke="#001219" strokeWidth="1" />
      <path d="M40 16 L41 18 L43 18 L41.5 19 L42 21 L40 20 L38 21 L38.5 19 L37 18 L39 18 Z" fill="#EE9B00" stroke="#001219" strokeWidth="1" />
      {/* Unicorn silhouette */}
      <path
        d="M30 26 C28 26, 27 28, 28 30 C26 31, 25 33, 26 35 L28 35 C27 38, 28 42, 32 44 C34 44, 36 41, 35 38 L37 36 C38 34, 37 31, 35 30 L35 27 C34 25, 32 26, 30 26 Z"
        fill="#0A9396"
        stroke="#001219"
        strokeWidth="1.5"
      />
      {/* Unicorn horn */}
      <path d="M29 26 L26 20 L28 24" stroke="#EE9B00" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Knight's sword */
export function DoodleSword({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Blade */}
      <path
        d="M30 6 L34 6 L35 40 L32 44 L29 40 Z"
        fill="#94D2BD"
        stroke="#001219"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Fuller ridge */}
      <line x1="32" y1="8" x2="32" y2="38" stroke="#005F73" strokeWidth="1.5" />
      {/* Crossguard */}
      <path
        d="M18 42 C24 43, 40 43, 46 42 L46 46 C40 46, 24 46, 18 46 Z"
        fill="#EE9B00"
        stroke="#001219"
        strokeWidth="2"
      />
      {/* Grip */}
      <rect x="30" y="46" width="4" height="10" fill="#CA6702" stroke="#001219" strokeWidth="2" rx="1" />
      {/* Pommel */}
      <circle cx="32" cy="58" r="4" fill="#EE9B00" stroke="#001219" strokeWidth="2" />
    </svg>
  );
}

/** Medieval Hourglass */
export function DoodleHourglass({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Top and bottom wood plates */}
      <rect x="16" y="8" width="32" height="6" rx="2" fill="#CA6702" stroke="#001219" strokeWidth="2.5" />
      <rect x="16" y="50" width="32" height="6" rx="2" fill="#CA6702" stroke="#001219" strokeWidth="2.5" />
      {/* Glass bulb */}
      <path
        d="M20 14 C20 28, 30 32, 32 32 C34 32, 44 28, 44 14 Z"
        fill="#FAF7EF"
        stroke="#001219"
        strokeWidth="2"
      />
      <path
        d="M20 50 C20 36, 30 32, 32 32 C34 32, 44 36, 44 50 Z"
        fill="#FAF7EF"
        stroke="#001219"
        strokeWidth="2"
      />
      {/* Sand */}
      <path d="M24 16 C25 24, 30 28, 32 30 C34 28, 39 24, 40 16 Z" fill="#EE9B00" />
      <path d="M22 50 C23 44, 28 40, 32 40 C36 40, 41 44, 42 50 Z" fill="#EE9B00" />
      {/* Sand trickle */}
      <line x1="32" y1="30" x2="32" y2="40" stroke="#EE9B00" strokeWidth="2" strokeDasharray="2 2" />
      {/* Side wooden pillars */}
      <line x1="18" y1="14" x2="18" y2="50" stroke="#BB3E03" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="14" x2="46" y2="50" stroke="#BB3E03" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Stone fortress/keep */
export function DoodleCastle({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Main curtain wall */}
      <rect x="22" y="26" width="20" height="28" fill="#E9D8A6" stroke="#001219" strokeWidth="2.5" />
      {/* Left tower */}
      <rect x="10" y="16" width="14" height="38" fill="#E9D8A6" stroke="#001219" strokeWidth="2.5" />
      {/* Right tower */}
      <rect x="40" y="16" width="14" height="38" fill="#E9D8A6" stroke="#001219" strokeWidth="2.5" />
      {/* Tower battlements */}
      <path d="M10 16 L10 12 L14 12 L14 14 L16 14 L16 12 L20 12 L20 14 L22 14 L22 12 L24 12 L24 16 Z" fill="#005F73" stroke="#001219" strokeWidth="2" />
      <path d="M40 16 L40 12 L44 12 L44 14 L46 14 L46 12 L50 12 L50 14 L52 14 L52 12 L54 12 L54 16 Z" fill="#005F73" stroke="#001219" strokeWidth="2" />
      {/* Wall battlements */}
      <path d="M24 26 L24 22 L28 22 L28 24 L30 24 L30 22 L34 22 L34 24 L36 24 L36 22 L40 22 L40 26 Z" fill="#005F73" stroke="#001219" strokeWidth="2" />
      {/* Gate / Portcullis */}
      <path d="M26 54 C26 44, 38 44, 38 54 Z" fill="#001219" />
      <line x1="28" y1="46" x2="36" y2="46" stroke="#CA6702" strokeWidth="1.5" />
      <line x1="32" y1="44" x2="32" y2="54" stroke="#CA6702" strokeWidth="1.5" />
    </svg>
  );
}

/** Royal jeweled crown */
export function DoodleCrown({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Crown base */}
      <path
        d="M12 44 L16 22 L26 34 L32 16 L38 34 L48 22 L52 44 Z"
        fill="#EE9B00"
        stroke="#001219"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Crown headband */}
      <rect x="12" y="44" width="40" height="8" rx="2" fill="#CA6702" stroke="#001219" strokeWidth="2.5" />
      {/* Jewels on peaks */}
      <circle cx="16" cy="21" r="2.5" fill="#AE2012" stroke="#001219" strokeWidth="1.5" />
      <circle cx="32" cy="15" r="3" fill="#0A9396" stroke="#001219" strokeWidth="1.5" />
      <circle cx="48" cy="21" r="2.5" fill="#AE2012" stroke="#001219" strokeWidth="1.5" />
      {/* Band gems */}
      <circle cx="20" cy="48" r="2" fill="#94D2BD" />
      <circle cx="32" cy="48" r="2.5" fill="#AE2012" />
      <circle cx="44" cy="48" r="2" fill="#94D2BD" />
    </svg>
  );
}

/** Bound treasure chest */
export function DoodleChest({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Chest body */}
      <rect x="12" y="28" width="40" height="24" rx="2" fill="#BB3E03" stroke="#001219" strokeWidth="2.5" />
      {/* Chest curved lid */}
      <path
        d="M12 28 C12 18, 52 18, 52 28 Z"
        fill="#CA6702"
        stroke="#001219"
        strokeWidth="2.5"
      />
      {/* Metal banding */}
      <rect x="18" y="20" width="4" height="32" fill="#EE9B00" stroke="#001219" strokeWidth="1.5" />
      <rect x="42" y="20" width="4" height="32" fill="#EE9B00" stroke="#001219" strokeWidth="1.5" />
      {/* Lock latch & keyhole */}
      <rect x="28" y="26" width="8" height="10" rx="2" fill="#EE9B00" stroke="#001219" strokeWidth="2" />
      <circle cx="32" cy="30" r="1.5" fill="#001219" />
      <line x1="32" y1="31" x2="32" y2="34" stroke="#001219" strokeWidth="1.5" />
    </svg>
  );
}

/** Rolled parchment scroll */
export function DoodleScroll({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Scroll cylinder */}
      <rect x="16" y="24" width="32" height="16" rx="2" fill="#E9D8A6" stroke="#001219" strokeWidth="2.5" />
      {/* Left curl */}
      <ellipse cx="16" cy="32" rx="4" ry="8" fill="#FAF7EF" stroke="#001219" strokeWidth="2" />
      {/* Right curl */}
      <ellipse cx="48" cy="32" rx="4" ry="8" fill="#E9D8A6" stroke="#001219" strokeWidth="2" />
      {/* Red ribbon band */}
      <rect x="30" y="24" width="5" height="16" fill="#AE2012" stroke="#001219" strokeWidth="1.5" />
      {/* Ribbon tails */}
      <path d="M30 40 L28 48 L32 46 L34 48 L33 40" fill="#AE2012" stroke="#001219" strokeWidth="1.5" />
    </svg>
  );
}

/** Open illuminated tome / book */
export function DoodleBook({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Leather cover background */}
      <path d="M8 44 C18 42, 32 44, 32 48 C32 44, 46 42, 56 44 L58 20 C46 18, 32 20, 32 24 C32 20, 18 18, 6 20 Z" fill="#005F73" stroke="#001219" strokeWidth="2.5" />
      {/* Parchment left page */}
      <path d="M10 40 C18 38, 30 40, 31 43 L31 22 C30 19, 18 17, 9 19 Z" fill="#E9D8A6" stroke="#001219" strokeWidth="2" />
      {/* Parchment right page */}
      <path d="M54 40 C46 38, 34 40, 33 43 L33 22 C34 19, 46 17, 55 19 Z" fill="#FAF7EF" stroke="#001219" strokeWidth="2" />
      {/* Text lines */}
      <line x1="14" y1="25" x2="26" y2="25" stroke="#CA6702" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="30" x2="24" y2="30" stroke="#001219" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="34" x2="26" y2="34" stroke="#001219" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="38" y1="25" x2="50" y2="25" stroke="#001219" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="38" y1="30" x2="48" y2="30" stroke="#001219" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="38" y1="34" x2="50" y2="34" stroke="#001219" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** Flaming torch */
export function DoodleTorch({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Wooden handle */}
      <path d="M28 32 L36 32 L33 58 L29 58 Z" fill="#CA6702" stroke="#001219" strokeWidth="2.5" />
      {/* Metal bowl / bracket */}
      <path d="M24 26 C24 34, 40 34, 40 26 Z" fill="#005F73" stroke="#001219" strokeWidth="2.5" />
      {/* Outer flame */}
      <path
        d="M32 6 C38 12, 42 18, 38 24 C34 27, 30 27, 26 24 C22 18, 26 12, 32 6 Z"
        fill="#EE9B00"
        stroke="#001219"
        strokeWidth="2"
      />
      {/* Inner flame */}
      <path
        d="M32 12 C35 16, 36 20, 34 23 C32 25, 30 25, 29 23 C28 20, 30 16, 32 12 Z"
        fill="#AE2012"
      />
    </svg>
  );
}
