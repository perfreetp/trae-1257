export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  level: number;
  points: number;
  visitCount: number;
  favoriteCount: number;
  checkinCount: number;
  noteCount: number;
}

export interface CheckInRecord {
  id: string;
  date: string;
  location: string;
  locationName: string;
  stampImage?: string;
  points: number;
}

export interface VisitNote {
  id: string;
  title: string;
  content: string;
  exhibitId?: string;
  exhibitName?: string;
  images?: string[];
  createTime: string;
}

export interface FavoriteItem {
  id: string;
  type: 'exhibit' | 'exhibition' | 'route';
  itemId: string;
  itemName: string;
  itemImage: string;
  addTime: string;
}
