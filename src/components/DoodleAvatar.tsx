import { OpponentType } from '../engine/types';
import {
  DoodleKnight,
  DoodleSquire,
  DoodleCrusader,
  DoodleArcher,
} from './doodles/DoodleCharacters';

interface DoodleAvatarProps {
  type: OpponentType;
  name: string;
  size?: number;
  className?: string;
}

/**
 * Minimalist, colored doodle avatar styled with medieval ink and parchment,
 * dynamically selecting distinct character artwork from the uploaded doodle sheet.
 */
export default function DoodleAvatar({
  type,
  name,
  size = 80,
  className = '',
}: DoodleAvatarProps) {
  // Use character name to deterministically vary artwork
  const charCode = name.charCodeAt(0) || 0;
  const isKnight = type === 'knight';

  let CharacterComponent = DoodleKnight;
  if (isKnight) {
    CharacterComponent = charCode % 2 === 0 ? DoodleKnight : DoodleCrusader;
  } else {
    CharacterComponent = charCode % 2 === 0 ? DoodleSquire : DoodleArcher;
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-parchment/40 border-2 border-ink flex items-center justify-center p-1.5 relative shadow-xs shrink-0 overflow-hidden ${className}`}
      aria-label={`${isKnight ? 'Knight' : 'Squire'} avatar for ${name}`}
    >
      <CharacterComponent size={size * 0.85} />
    </div>
  );
}
