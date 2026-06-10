import type { Route, RoutePoint, CrowdInfo } from '@/types/route';

export const routes: Route[] = [
  {
    id: 'rt1',
    name: '精品馆藏精选路线',
    description: '精选馆内最具代表性的十件镇馆之宝，让您在有限时间内领略馆藏精华。适合首次参观的观众。',
    duration: '约1.5小时',
    distance: '约1.2公里',
    exhibitCount: 10,
    difficulty: 'easy',
    coverImage: 'https://picsum.photos/id/1025/750/420',
    tags: ['必看', '精华', '镇馆之宝'],
    isWheelchairAccessible: true,
    isRecommended: true
  },
  {
    id: 'rt2',
    name: '丝路文化深度游',
    description: '沿着丝绸之路的足迹，从敦煌到长安，感受东西方文化交流的璀璨成果。适合对历史文化感兴趣的观众。',
    duration: '约2.5小时',
    distance: '约2.0公里',
    exhibitCount: 28,
    difficulty: 'medium',
    coverImage: 'https://picsum.photos/id/1061/750/420',
    tags: ['丝路', '敦煌', '历史'],
    isWheelchairAccessible: true,
    isRecommended: false
  },
  {
    id: 'rt3',
    name: '亲子童趣探索路线',
    description: '专为家庭观众设计的趣味路线，包含互动体验区、儿童讲解和手工活动，让孩子在游玩中学习传统文化。',
    duration: '约2小时',
    distance: '约1.5公里',
    exhibitCount: 15,
    difficulty: 'easy',
    coverImage: 'https://picsum.photos/id/1080/750/420',
    tags: ['亲子', '儿童', '互动'],
    isWheelchairAccessible: true,
    isRecommended: true
  },
  {
    id: 'rt4',
    name: '传统工艺鉴赏路线',
    description: '深入了解中国传统工艺之美，从陶瓷到家具，从青铜到玉器，感受匠人的精湛技艺与匠心精神。',
    duration: '约3小时',
    distance: '约2.5公里',
    exhibitCount: 35,
    difficulty: 'hard',
    coverImage: 'https://picsum.photos/id/1082/750/420',
    tags: ['工艺', '陶瓷', '家具', '青铜'],
    isWheelchairAccessible: false,
    isRecommended: false
  },
  {
    id: 'rt5',
    name: '无障碍参观路线',
    description: '全程无障碍通道，电梯直达各楼层，适合行动不便的观众。精选最具代表性的展品，参观体验舒适便捷。',
    duration: '约1.5小时',
    distance: '约0.8公里',
    exhibitCount: 12,
    difficulty: 'easy',
    coverImage: 'https://picsum.photos/id/1059/750/420',
    tags: ['无障碍', '轮椅', '舒适'],
    isWheelchairAccessible: true,
    isRecommended: false
  },
  {
    id: 'rt6',
    name: '书画艺术主题路线',
    description: '徜徉于翰墨丹青之间，从晋唐到明清，再到近现代，领略中国书画艺术的传承与发展。',
    duration: '约2小时',
    distance: '约1.8公里',
    exhibitCount: 22,
    difficulty: 'medium',
    coverImage: 'https://picsum.photos/id/1073/750/420',
    tags: ['书画', '水墨', '艺术'],
    isWheelchairAccessible: true,
    isRecommended: false
  }
];

export const routePoints: RoutePoint[] = [
  { id: 'p1', name: '入口大厅', x: 375, y: 600, floor: 1, type: 'entrance' },
  { id: 'p2', name: '服务中心', x: 375, y: 520, floor: 1, type: 'service' },
  { id: 'p3', name: '第一展厅', x: 180, y: 300, floor: 2, type: 'exhibit' },
  { id: 'p4', name: '第二展厅', x: 560, y: 300, floor: 3, type: 'exhibit' },
  { id: 'p5', name: '第三展厅', x: 180, y: 200, floor: 1, type: 'exhibit' },
  { id: 'p6', name: '第四展厅', x: 560, y: 200, floor: 4, type: 'exhibit' },
  { id: 'p7', name: '第五展厅', x: 375, y: 150, floor: 2, type: 'exhibit' },
  { id: 'p8', name: '洗手间', x: 680, y: 450, floor: 1, type: 'restroom' },
  { id: 'p9', name: '出口', x: 375, y: 680, floor: 1, type: 'exit' },
  { id: 'p10', name: '互动展厅', x: 180, y: 500, floor: -1, type: 'exhibit' },
  { id: 'p11', name: '学术报告厅', x: 560, y: 500, floor: 1, type: 'service' },
  { id: 'p12', name: '陶艺体验室', x: 620, y: 350, floor: -1, type: 'service' }
];

export const crowdInfoList: CrowdInfo[] = [
  { location: '第一展厅', level: 'crowded', count: 186, capacity: 200 },
  { location: '第二展厅', level: 'moderate', count: 89, capacity: 150 },
  { location: '第三展厅', level: 'normal', count: 45, capacity: 180 },
  { location: '第四展厅', level: 'normal', count: 32, capacity: 120 },
  { location: '第五展厅', level: 'moderate', count: 98, capacity: 200 },
  { location: '互动展厅', level: 'crowded', count: 72, capacity: 80 },
  { location: '入口大厅', level: 'moderate', count: 156, capacity: 300 },
  { location: '文创商店', level: 'normal', count: 28, capacity: 100 }
];

export const getRouteById = (id: string): Route | undefined => {
  return routes.find(item => item.id === id);
};

export const getCrowdLevelLabel = (level: CrowdInfo['level']): string => {
  const map = {
    normal: '舒适',
    moderate: '适中',
    crowded: '拥挤'
  };
  return map[level];
};

export const getDifficultyLabel = (difficulty: Route['difficulty']): string => {
  const map = {
    easy: '轻松',
    medium: '适中',
    hard: '深度'
  };
  return map[difficulty];
};
