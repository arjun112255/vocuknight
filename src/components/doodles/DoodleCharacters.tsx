interface DoodleProps {
  size?: number;
  className?: string;
}

/** Plate Armor Knight with plume & arming sword */
export function DoodleKnight({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      {/* Plume feather */}
      <path
        d="M28 8 C28 2, 38 2, 44 6 C40 8, 36 10, 30 12"
        fill="#EE9B00"
        stroke="#FFFFFF"
        strokeWidth="1.8"
      />
      {/* Helmet dome */}
      <path
        d="M20 22 C20 12, 40 12, 40 22 L40 32 C40 35, 20 35, 20 32 Z"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="2.5"
      />
      {/* Visor horizontal slot */}
      <line x1="23" y1="22" x2="37" y2="22" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
      {/* Visor breath holes */}
      <circle cx="27" cy="27" r="1" fill="#000000" />
      <circle cx="30" cy="27" r="1" fill="#000000" />
      <circle cx="33" cy="27" r="1" fill="#000000" />
      {/* Torso cuirass / breastplate */}
      <path
        d="M18 34 L42 34 L40 50 L20 50 Z"
        fill="#005F73"
        stroke="#38BDF8"
        strokeWidth="2"
      />
      {/* Shoulder pauldrons */}
      <circle cx="16" cy="36" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="44" cy="36" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Arm with sword */}
      <path d="M46 38 L52 46 L50 48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      {/* Sword */}
      <line x1="48" y1="46" x2="58" y2="18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="44" x2="54" y2="44" stroke="#EE9B00" strokeWidth="2" strokeLinecap="round" />
      {/* Armored legs/feet */}
      <rect x="22" y="50" width="6" height="8" fill="#1E2E4E" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="32" y="50" width="6" height="8" fill="#1E2E4E" stroke="#38BDF8" strokeWidth="1.5" />
      <path d="M18 58 L28 58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 58 L42 58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Apprentice Squire with tunic and wooden club */
export function DoodleSquire({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      {/* Squire cap */}
      <path
        d="M20 20 C22 12, 38 12, 40 20 Z"
        fill="#38BDF8"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      {/* Head */}
      <circle cx="30" cy="22" r="9" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
      {/* Friendly face */}
      <circle cx="27" cy="21" r="1.5" fill="#000000" />
      <circle cx="33" cy="21" r="1.5" fill="#000000" />
      <path d="M28 26 Q30 28 32 26" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cloth tunic */}
      <path
        d="M20 31 L40 31 L42 48 L18 48 Z"
        fill="#0A9396"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      {/* Leather belt */}
      <line x1="18" y1="40" x2="42" y2="40" stroke="#CA6702" strokeWidth="2.5" />
      <rect x="28" y="38" width="4" height="4" fill="#EE9B00" stroke="#000000" strokeWidth="1" />
      {/* Wooden training club */}
      <path
        d="M42 38 L52 24 L56 26 L46 42 Z"
        fill="#CA6702"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Legs & boots */}
      <rect x="23" y="48" width="5" height="8" fill="#1E2E4E" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="32" y="48" width="5" height="8" fill="#1E2E4E" stroke="#38BDF8" strokeWidth="1.5" />
      <path d="M20 56 L28 56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 56 L40 56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Crusader with cross flat-top helm & battle axe */
export function DoodleCrusader({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      <rect x="20" y="12" width="20" height="18" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
      <line x1="30" y1="16" x2="30" y2="28" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="21" x2="36" y2="21" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 30 L42 30 L40 48 L20 48 Z" fill="#1E2E4E" stroke="#38BDF8" strokeWidth="2" />
      <line x1="30" y1="34" x2="30" y2="44" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="39" x2="36" y2="39" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="16" x2="16" y2="52" stroke="#CA6702" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 20 C14 16, 14 26, 8 28 Z" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="22" y="48" width="6" height="8" fill="#005F73" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="32" y="48" width="6" height="8" fill="#005F73" stroke="#38BDF8" strokeWidth="1.5" />
    </svg>
  );
}

/** Heraldic medieval dragon */
export function DoodleDragon({ size = 48, className = '' }: DoodleProps) {
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
        d="M20 46 C12 46, 8 52, 6 56 C12 54, 18 52, 24 50 L36 50 C44 50, 48 42, 44 34 L38 28 C34 24, 26 26, 24 30 L20 46 Z"
        fill="#CA6702"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M38 28 L46 22 L52 24 L50 28 L46 32 Z" fill="#BB3E03" stroke="#FFFFFF" strokeWidth="1.8" />
      <path d="M44 20 L48 16" stroke="#EE9B00" strokeWidth="2" strokeLinecap="round" />
      <circle cx="45" cy="24" r="1.5" fill="#38BDF8" />
      <path
        d="M30 30 L38 12 L44 16 L38 22 L46 20 L38 28 Z"
        fill="#EE9B00"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M52 27 Q56 26 58 29 Q54 30 52 28" fill="#EF4444" stroke="#000" strokeWidth="1" />
    </svg>
  );
}

/** Archer / Ranger */
export function DoodleArcher({ size = 48, className = '' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-sm ${className}`}
    >
      <path d="M22 24 C20 14, 38 12, 40 22 C42 28, 38 32, 38 32 L22 32 Z" fill="#005F73" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="30" cy="24" r="6" fill="#FFFFFF" />
      <circle cx="32" cy="23" r="1.5" fill="#000000" />
      <path d="M22 32 L38 32 L40 48 L20 48 Z" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.8" />
      <path d="M42 16 Q52 32 42 48" stroke="#CA6702" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="16" x2="42" y2="48" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="16" y1="20" x2="22" y2="34" stroke="#BB3E03" strokeWidth="3" />
      <path d="M14 18 L18 16" stroke="#EE9B00" strokeWidth="2" strokeLinecap="round" />
      <rect x="23" y="48" width="5" height="8" fill="#1E2E4E" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="31" y="48" width="5" height="8" fill="#1E2E4E" stroke="#38BDF8" strokeWidth="1.5" />
    </svg>
  );
}
