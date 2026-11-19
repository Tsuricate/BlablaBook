import type { IconType } from 'react-icons';
import {
  LuWandSparkles,
  LuRocket,
  LuHeart,
  LuZap,
  LuFingerprint,
  LuGhost,
  LuLandmark,
  LuUser,
  LuSparkles,
  LuSmile,
  LuCompass,
  LuBriefcase,
  LuLightbulb,
  LuMessageSquare,
  LuBookOpen,
} from 'react-icons/lu';

const categoryIcons: Record<string, IconType> = {
  fantasy: LuWandSparkles,
  scienceFiction: LuRocket,
  romance: LuHeart,
  thriller: LuZap,
  mystery: LuFingerprint,
  horror: LuGhost,
  historical: LuLandmark,
  biography: LuUser,
  youngAdult: LuSparkles,
  children: LuSmile,
  adventure: LuCompass,
  business: LuBriefcase,
  philosophy: LuLightbulb,
  comics: LuMessageSquare,
};

export const getCategoryIcon = (key: string): IconType => categoryIcons[key] ?? LuBookOpen;
