interface DoodleProps {
  size?: number;
  className?: string;
}

/** Heraldic shield with unicorn and stars */
export function DoodleShield({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      {/* Outer shield rim */}
      <path
        d="M32 4 L52 10 C52 38, 38 54, 32 60 C26 54, 12 38, 12 10 Z"
        fill="#005F73"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner shield field */}
      <path
        d="M32 8 L48 13 C48 35, 36 49, 32 54 C28 49, 16 35, 16 13 Z"
        fill="#0E172C"
        stroke="#38BDF8"
        strokeWidth="1.5"
      />
      {/* Heraldic 3 stars */}
      <path d="M24 16 L25 18 L27 18 L25.5 19 L26 21 L24 20 L22 21 L22.5 19 L21 18 L23 18 Z" fill="#EE9B00" stroke="#000" strokeWidth="0.8" />
      <path d="M32 14 L33 16 L35 16 L33.5 17 L34 19 L32 18 L30 19 L30.5 17 L29 16 L31 16 Z" fill="#EE9B00" stroke="#000" strokeWidth="0.8" />
      <path d="M40 16 L41 18 L43 18 L41.5 19 L42 21 L40 20 L38 21 L38.5 19 L37 18 L39 18 Z" fill="#EE9B00" stroke="#000" strokeWidth="0.8" />
      {/* Unicorn silhouette */}
      <path
        d="M30 26 C28 26, 27 28, 28 30 C26 31, 25 33, 26 35 L28 35 C27 38, 28 42, 32 44 C34 44, 36 41, 35 38 L37 36 C38 34, 37 31, 35 30 L35 27 C34 25, 32 26, 30 26 Z"
        fill="#38BDF8"
        stroke="#FFFFFF"
        strokeWidth="1.2"
      />
      {/* Unicorn horn */}
      <path d="M29 26 L25 19 L28 24" stroke="#EE9B00" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Knight's sword */
export function DoodleSword({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      {/* Blade with bright steel highlight */}
      <path
        d="M30 5 L34 5 L35 40 L32 44 L29 40 Z"
        fill="#E2F1FF"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Blade center fuller */}
      <line x1="32" y1="7" x2="32" y2="38" stroke="#38BDF8" strokeWidth="1.8" />
      {/* Golden Crossguard */}
      <path
        d="M17 41 C24 42, 40 42, 47 41 L47 45 C40 45, 24 45, 17 45 Z"
        fill="#EE9B00"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Leather Wrapped Grip */}
      <rect x="30" y="45" width="4" height="10" fill="#CA6702" stroke="#000000" strokeWidth="2" rx="1" />
      {/* Pommel with gem */}
      <circle cx="32" cy="57" r="4.5" fill="#EE9B00" stroke="#000000" strokeWidth="2" />
      <circle cx="32" cy="57" r="2" fill="#38BDF8" />
    </svg>
  );
}

/** Medieval Hourglass */
export function DoodleHourglass({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      {/* Top and bottom wood plates */}
      <rect x="16" y="8" width="32" height="6" rx="2" fill="#CA6702" stroke="#FFFFFF" strokeWidth="1.8" />
      <rect x="16" y="50" width="32" height="6" rx="2" fill="#CA6702" stroke="#FFFFFF" strokeWidth="1.8" />
      {/* Glass bulb */}
      <path
        d="M20 14 C20 28, 30 32, 32 32 C34 32, 44 28, 44 14 Z"
        fill="#101D38"
        stroke="#38BDF8"
        strokeWidth="2"
      />
      <path
        d="M20 50 C20 36, 30 32, 32 32 C34 32, 44 36, 44 50 Z"
        fill="#101D38"
        stroke="#38BDF8"
        strokeWidth="2"
      />
      {/* Golden Sand */}
      <path d="M23 16 C25 24, 30 28, 32 30 C34 28, 39 24, 41 16 Z" fill="#EE9B00" />
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
export function DoodleCastle({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      {/* Main curtain wall */}
      <rect x="22" y="26" width="20" height="28" fill="#14213D" stroke="#38BDF8" strokeWidth="2" />
      {/* Left tower */}
      <rect x="10" y="16" width="14" height="38" fill="#14213D" stroke="#38BDF8" strokeWidth="2" />
      {/* Right tower */}
      <rect x="40" y="16" width="14" height="38" fill="#14213D" stroke="#38BDF8" strokeWidth="2" />
      {/* Battlements */}
      <path d="M10 16 L10 11 L14 11 L14 13 L16 13 L16 11 L20 11 L20 13 L22 13 L22 11 L24 11 L24 16 Z" fill="#0A9396" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M40 16 L40 11 L44 11 L44 13 L46 13 L46 11 L50 11 L50 13 L52 13 L52 11 L54 11 L54 16 Z" fill="#0A9396" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M24 26 L24 21 L28 21 L28 23 L30 23 L30 21 L34 21 L34 23 L36 23 L36 21 L40 21 L40 26 Z" fill="#0A9396" stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Gate / Portcullis */}
      <path d="M26 54 C26 43, 38 43, 38 54 Z" fill="#000000" stroke="#38BDF8" strokeWidth="1.5" />
      <line x1="28" y1="46" x2="36" y2="46" stroke="#EE9B00" strokeWidth="1.5" />
      <line x1="32" y1="43" x2="32" y2="54" stroke="#EE9B00" strokeWidth="1.5" />
    </svg>
  );
}

/** Royal jeweled crown */
export function DoodleCrown({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      {/* Crown body */}
      <path
        d="M12 44 L16 20 L26 32 L32 14 L38 32 L48 20 L52 44 Z"
        fill="#EE9B00"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Crown headband */}
      <rect x="12" y="44" width="40" height="9" rx="2" fill="#CA6702" stroke="#FFFFFF" strokeWidth="2" />
      {/* Jewels on peaks */}
      <circle cx="16" cy="19" r="3" fill="#EF4444" stroke="#000" strokeWidth="1.2" />
      <circle cx="32" cy="13" r="3.5" fill="#38BDF8" stroke="#000" strokeWidth="1.2" />
      <circle cx="48" cy="19" r="3" fill="#EF4444" stroke="#000" strokeWidth="1.2" />
      {/* Band gems */}
      <circle cx="20" cy="48.5" r="2.5" fill="#38BDF8" />
      <circle cx="32" cy="48.5" r="3" fill="#EF4444" />
      <circle cx="44" cy="48.5" r="2.5" fill="#38BDF8" />
    </svg>
  );
}

/** Bound treasure chest */
export function DoodleChest({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      <rect x="12" y="28" width="40" height="24" rx="2" fill="#BB3E03" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M12 28 C12 18, 52 18, 52 28 Z" fill="#CA6702" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="18" y="20" width="4" height="32" fill="#EE9B00" stroke="#000" strokeWidth="1" />
      <rect x="42" y="20" width="4" height="32" fill="#EE9B00" stroke="#000" strokeWidth="1" />
      <rect x="28" y="26" width="8" height="10" rx="2" fill="#EE9B00" stroke="#000" strokeWidth="1.5" />
      <circle cx="32" cy="30" r="1.5" fill="#000" />
    </svg>
  );
}

/** Rolled parchment scroll */
export function DoodleScroll({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      <rect x="16" y="24" width="32" height="16" rx="2" fill="#E2F1FF" stroke="#000" strokeWidth="2" />
      <ellipse cx="16" cy="32" rx="4" ry="8" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
      <ellipse cx="48" cy="32" rx="4" ry="8" fill="#E2F1FF" stroke="#000" strokeWidth="2" />
      <rect x="30" y="24" width="5" height="16" fill="#EF4444" stroke="#000" strokeWidth="1.2" />
      <path d="M30 40 L28 47 L32 45 L34 47 L33 40" fill="#EF4444" stroke="#000" strokeWidth="1.2" />
    </svg>
  );
}

/** Open illuminated book / tome */
export function DoodleBook({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      <path d="M8 44 C18 42, 32 44, 32 48 C32 44, 46 42, 56 44 L58 20 C46 18, 32 20, 32 24 C32 20, 18 18, 6 20 Z" fill="#005F73" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M10 40 C18 38, 30 40, 31 43 L31 22 C30 19, 18 17, 9 19 Z" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
      <path d="M54 40 C46 38, 34 40, 33 43 L33 22 C34 19, 46 17, 55 19 Z" fill="#E2F1FF" stroke="#000" strokeWidth="1.5" />
      <line x1="14" y1="25" x2="26" y2="25" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="30" x2="24" y2="30" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="34" x2="26" y2="34" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="38" y1="25" x2="50" y2="25" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="38" y1="30" x2="48" y2="30" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** Flaming torch */
export function DoodleTorch({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      <path d="M28 32 L36 32 L33 58 L29 58 Z" fill="#CA6702" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M24 26 C24 34, 40 34, 40 26 Z" fill="#005F73" stroke="#FFFFFF" strokeWidth="2" />
      <path
        d="M32 6 C38 12, 42 18, 38 24 C34 27, 30 27, 26 24 C22 18, 26 12, 32 6 Z"
        fill="#EE9B00"
        stroke="#000"
        strokeWidth="1.5"
      />
      <path
        d="M32 12 C35 16, 36 20, 34 23 C32 25, 30 25, 29 23 C28 20, 30 16, 32 12 Z"
        fill="#EF4444"
      />
    </svg>
  );
}

/** Crossed Knight Duel Swords */
export function DoodleSwords({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      {/* Sword 1 (top-left to bottom-right) */}
      <g transform="rotate(45 32 32)">
        <path d="M30 4 L34 4 L35 44 L32 48 L29 44 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
        <line x1="32" y1="6" x2="32" y2="42" stroke="#38BDF8" strokeWidth="1.5" />
        <rect x="20" y="44" width="24" height="4" rx="2" fill="#EE9B00" stroke="#000000" strokeWidth="1.5" />
        <rect x="30" y="48" width="4" height="8" rx="1" fill="#CA6702" stroke="#000000" strokeWidth="1.5" />
        <circle cx="32" cy="58" r="3.5" fill="#EE9B00" stroke="#000000" strokeWidth="1.5" />
      </g>
      {/* Sword 2 (top-right to bottom-left) */}
      <g transform="rotate(-45 32 32)">
        <path d="M30 4 L34 4 L35 44 L32 48 L29 44 Z" fill="#E0F2FE" stroke="#000000" strokeWidth="2" />
        <line x1="32" y1="6" x2="32" y2="42" stroke="#0A9396" strokeWidth="1.5" />
        <rect x="20" y="44" width="24" height="4" rx="2" fill="#EE9B00" stroke="#000000" strokeWidth="1.5" />
        <rect x="30" y="48" width="4" height="8" rx="1" fill="#CA6702" stroke="#000000" strokeWidth="1.5" />
        <circle cx="32" cy="58" r="3.5" fill="#EE9B00" stroke="#000000" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/** Medieval Settings Astrolabe / Cog Gear with Compass Star */
export function DoodleGear({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      {/* Outer Gear Teeth ring */}
      <circle cx="32" cy="32" r="22" fill="#0E1628" stroke="#EE9B00" strokeWidth="3" />
      {/* 8 Cog Teeth */}
      <rect x="29" y="4" width="6" height="8" rx="1.5" fill="#EE9B00" stroke="#000" strokeWidth="1.5" />
      <rect x="29" y="52" width="6" height="8" rx="1.5" fill="#EE9B00" stroke="#000" strokeWidth="1.5" />
      <rect x="4" y="29" width="8" height="6" rx="1.5" fill="#EE9B00" stroke="#000" strokeWidth="1.5" />
      <rect x="52" y="29" width="8" height="6" rx="1.5" fill="#EE9B00" stroke="#000" strokeWidth="1.5" />
      <g transform="rotate(45 32 32)">
        <rect x="29" y="4" width="6" height="8" rx="1.5" fill="#CA6702" stroke="#000" strokeWidth="1.5" />
        <rect x="29" y="52" width="6" height="8" rx="1.5" fill="#CA6702" stroke="#000" strokeWidth="1.5" />
        <rect x="4" y="29" width="8" height="6" rx="1.5" fill="#CA6702" stroke="#000" strokeWidth="1.5" />
        <rect x="52" y="29" width="8" height="6" rx="1.5" fill="#CA6702" stroke="#000" strokeWidth="1.5" />
      </g>
      {/* Inner Astrolabe Ring */}
      <circle cx="32" cy="32" r="14" fill="#005F73" stroke="#FFFFFF" strokeWidth="2" />
      {/* Center 4-Point Compass Star */}
      <path
        d="M32 20 L34 30 L44 32 L34 34 L32 44 L30 34 L20 32 L30 30 Z"
        fill="#EE9B00"
        stroke="#FFFFFF"
        strokeWidth="1"
      />
      <circle cx="32" cy="32" r="3" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
    </svg>
  );
}

/** Heraldic Banner / Pennant */
export function DoodleBanner({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      <rect x="10" y="8" width="44" height="5" rx="2" fill="#CA6702" stroke="#000" strokeWidth="1.5" />
      <circle cx="10" cy="10.5" r="3" fill="#EE9B00" stroke="#000" strokeWidth="1.2" />
      <circle cx="54" cy="10.5" r="3" fill="#EE9B00" stroke="#000" strokeWidth="1.2" />
      {/* Pennant Flag */}
      <path
        d="M14 13 L50 13 L50 44 L32 36 L14 44 Z"
        fill="#005F73"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      {/* Banner Crest */}
      <circle cx="32" cy="24" r="7" fill="#EE9B00" stroke="#000" strokeWidth="1.5" />
      <path d="M32 19 L34 23 L38 24 L34 26 L32 30 L30 26 L26 24 L30 23 Z" fill="#FFFFFF" />
    </svg>
  );
}

/** 8-Point Medieval Compass Star */
export function DoodleStar({ size = 32, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      <path
        d="M32 6 L35 25 L48 12 L39 28 L58 32 L39 36 L48 52 L35 39 L32 58 L29 39 L16 52 L25 36 L6 32 L25 28 L16 12 L29 25 Z"
        fill="#EE9B00"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="4.5" fill="#38BDF8" stroke="#000" strokeWidth="1.5" />
    </svg>
  );
}
