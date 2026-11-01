import { OpponentType } from '../engine/types';

interface DoodleAvatarProps {
  type: OpponentType;
  name: string;
  size?: number;
}

/**
 * Minimalist doodle avatar for Squire and Knight opponents,
 * styled with paper-white background and hand-drawn ink lines.
 */
export default function DoodleAvatar({
  type,
  size = 80,
}: DoodleAvatarProps) {
  const isKnight = type === 'knight';

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-surface border-2 border-ink flex items-center justify-center p-2 relative shadow-xs"
      aria-label={`${isKnight ? 'Knight' : 'Squire'} doodle avatar`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-ink"
      >
        {isKnight ? (
          /* Knight: Doodle Helmet with Visor and Plume */
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Plume feather */}
            <path d="M32 10 C32 4, 38 4, 44 8 C40 10, 36 12, 32 14" fill="#E08A00" stroke="#14213D" />
            {/* Helmet dome */}
            <path d="M18 34 C16 20, 48 20, 46 34 L46 48 C46 52, 18 52, 18 48 Z" fill="#FFFFFF" />
            {/* Visor slit horizontal */}
            <line x1="22" y1="32" x2="42" y2="32" strokeWidth="3" />
            {/* Visor breath holes */}
            <circle cx="26" cy="40" r="1.5" fill="currentColor" />
            <circle cx="32" cy="40" r="1.5" fill="currentColor" />
            <circle cx="38" cy="40" r="1.5" fill="currentColor" />
            {/* Helmet neck guard */}
            <path d="M16 48 C24 54, 40 54, 48 48" />
          </g>
        ) : (
          /* Squire: Doodle Training Cap with Wooden Sword */
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Squire head */}
            <circle cx="32" cy="32" r="16" fill="#FFFFFF" />
            {/* Friendly eyes */}
            <circle cx="27" cy="30" r="2" fill="currentColor" />
            <circle cx="37" cy="30" r="2" fill="currentColor" />
            {/* Cheerful smile */}
            <path d="M28 38 Q32 42 36 38" />
            {/* Cap */}
            <path d="M17 26 C20 16, 44 16, 47 26 Z" fill="#2F5BFF" fillOpacity="0.2" />
            <line x1="16" y1="26" x2="48" y2="26" />
            {/* Tiny wooden training sword icon */}
            <path d="M48 44 L56 52 M46 48 L50 44" stroke="#E08A00" strokeWidth="2.5" />
          </g>
        )}
      </svg>
    </div>
  );
}
