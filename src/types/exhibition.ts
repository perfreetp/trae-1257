export interface Exhibition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  location: string;
  floor: string;
  exhibitCount: number;
  isHot?: boolean;
  isNew?: boolean;
  theme?: string;
}

export interface Exhibit {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  images?: string[];
  era: string;
  category: string;
  location: string;
  floor: string;
  audioDuration?: string;
  qrCode?: string;
  arEnabled?: boolean;
  isFavorite?: boolean;
  hasChildVersion?: boolean;
}
