import type { UserInfo, CheckInRecord, VisitNote, FavoriteItem } from '@/types/user';

export const userInfo: UserInfo = {
  id: 'u001',
  nickname: '文博爱好者',
  avatar: 'https://picsum.photos/id/64/200/200',
  level: 5,
  points: 2680,
  visitCount: 28,
  favoriteCount: 36,
  checkinCount: 42,
  noteCount: 15
};

export const checkInRecords: CheckInRecord[] = [
  {
    id: 'c1',
    date: '2026-06-08',
    location: '第一展厅',
    locationName: '敦煌艺术展',
    points: 20,
    stampImage: 'https://picsum.photos/id/1061/200/200'
  },
  {
    id: 'c2',
    date: '2026-06-08',
    location: '第二展厅',
    locationName: '明清家具展',
    points: 20,
    stampImage: 'https://picsum.photos/id/1059/200/200'
  },
  {
    id: 'c3',
    date: '2026-06-08',
    location: '第三展厅',
    locationName: '青铜文明展',
    points: 20,
    stampImage: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: 'c4',
    date: '2026-05-20',
    location: '入口大厅',
    locationName: '数字文化馆',
    points: 50,
    stampImage: 'https://picsum.photos/id/1039/200/200'
  },
  {
    id: 'c5',
    date: '2026-05-15',
    location: '第四展厅',
    locationName: '近现代书画展',
    points: 20,
    stampImage: 'https://picsum.photos/id/1073/200/200'
  },
  {
    id: 'c6',
    date: '2026-05-01',
    location: '互动展厅',
    locationName: '童趣工坊',
    points: 30,
    stampImage: 'https://picsum.photos/id/1080/200/200'
  }
];

export const visitNotes: VisitNote[] = [
  {
    id: 'n1',
    title: '敦煌飞天之美',
    content: '今天参观了敦煌艺术大展，被飞天壁画深深震撼。唐代的飞天姿态轻盈，衣带飘举，仿佛真的在天空中飞舞。讲解员说敦煌飞天融合了中印文化，是艺术交流的结晶。下次还要带孩子一起来看！',
    exhibitId: 'e1',
    exhibitName: '敦煌飞天壁画',
    createTime: '2026-06-08 15:30'
  },
  {
    id: 'n2',
    title: '司母戊鼎的震撼',
    content: '站在司母戊鼎前，才真正感受到什么叫"国之重器"。800多公斤的青铜器，三千多年前的古人是怎么铸造出来的？太不可思议了！',
    exhibitId: 'e3',
    exhibitName: '司母戊鼎',
    createTime: '2026-06-08 11:20'
  },
  {
    id: 'n3',
    title: '汝窑天青釉',
    content: '雨过天青云破处，这般颜色做将来。汝窑的天青色真的太美了，温润如玉，看多久都不会腻。可惜存世太少，能亲眼看到真是幸运。',
    exhibitId: 'e5',
    exhibitName: '汝窑天青釉盘',
    createTime: '2026-05-20 14:15'
  },
  {
    id: 'n4',
    title: '和孩子的陶艺体验',
    content: '周末带孩子参加了陶艺体验课，小家伙玩得特别开心，说自己做了一个"超级大碗"。虽然歪歪扭扭的，但很有纪念意义，等烧制好了一定要摆在家里。',
    createTime: '2026-05-18 16:45'
  },
  {
    id: 'n5',
    title: '齐白石的虾',
    content: '以前只在画册上见过齐白石的虾，今天看到真迹了！寥寥几笔，虾的灵动神态就出来了，太厉害了。大写意果然是中国画的精髓。',
    exhibitId: 'e4',
    exhibitName: '齐白石虾趣图',
    createTime: '2026-05-15 10:30'
  }
];

export const favoriteItems: FavoriteItem[] = [
  {
    id: 'f1',
    type: 'exhibit',
    itemId: 'e1',
    itemName: '敦煌飞天壁画',
    itemImage: 'https://picsum.photos/id/1061/200/200',
    addTime: '2026-06-08 15:00'
  },
  {
    id: 'f2',
    type: 'exhibit',
    itemId: 'e3',
    itemName: '司母戊鼎',
    itemImage: 'https://picsum.photos/id/1025/200/200',
    addTime: '2026-06-08 11:00'
  },
  {
    id: 'f3',
    type: 'exhibit',
    itemId: 'e5',
    itemName: '汝窑天青釉盘',
    itemImage: 'https://picsum.photos/id/1082/200/200',
    addTime: '2026-05-20 14:00'
  },
  {
    id: 'f4',
    type: 'exhibit',
    itemId: 'e8',
    itemName: '四羊方尊',
    itemImage: 'https://picsum.photos/id/1050/200/200',
    addTime: '2026-05-15 09:30'
  },
  {
    id: 'f5',
    type: 'exhibition',
    itemId: '1',
    itemName: '丝路瑰宝·敦煌艺术大展',
    itemImage: 'https://picsum.photos/id/1061/200/200',
    addTime: '2026-05-10 16:20'
  },
  {
    id: 'f6',
    type: 'route',
    itemId: 'rt1',
    itemName: '精品馆藏精选路线',
    itemImage: 'https://picsum.photos/id/1025/200/200',
    addTime: '2026-04-28 10:15'
  }
];

export const getCheckInRecords = (): CheckInRecord[] => {
  return checkInRecords;
};

export const getVisitNotes = (): VisitNote[] => {
  return visitNotes;
};

export const getFavoriteItems = (): FavoriteItem[] => {
  return favoriteItems;
};
