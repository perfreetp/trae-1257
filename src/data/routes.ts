import type { Route, RoutePoint, CrowdInfo } from '@/types/route';

export const routes: Route[] = [
  {
    id: 'rt1',
    name: '精品馆藏精选路线',
    description: '精选馆内最具代表性的十件镇馆之宝，让您在有限时间内领略馆藏精华。适合首次参观的观众。',
    duration: '1.5小时',
    distance: '约1.2公里',
    exhibitCount: 5,
    difficulty: 'easy',
    coverImage: 'https://picsum.photos/id/1025/750/420',
    tags: ['必看', '精华', '镇馆之宝'],
    isWheelchairAccessible: true,
    isRecommended: true,
    stops: [
      { id: 's1-1', name: '入口大厅', location: '一楼', duration: '5分钟', description: '领取导览手册，了解参观须知' },
      { id: 's1-2', name: '敦煌飞天壁画', exhibitId: 'e1', location: '第一展厅A区·二楼', duration: '10分钟', description: '唐代莫高窟第320窟飞天壁画，敦煌艺术代表作' },
      { id: 's1-3', name: '司母戊鼎', exhibitId: 'e3', location: '第三展厅C区·一楼', duration: '10分钟', description: '中国现存最大最重的青铜器，商代铸造工艺巅峰' },
      { id: 's1-4', name: '汝窑天青釉盘', exhibitId: 'e5', location: '第五展厅D区·二楼', duration: '10分钟', description: '宋代五大名窑之首，天青釉如雨过天青' },
      { id: 's1-5', name: '四羊方尊', exhibitId: 'e8', location: '第三展厅A区·一楼', duration: '10分钟', description: '商代青铜器杰作，四角卷角羊造型生动' }
    ]
  },
  {
    id: 'rt2',
    name: '丝路文化深度游',
    description: '沿着丝绸之路的足迹，从敦煌到长安，感受东西方文化交流的璀璨成果。适合对历史文化感兴趣的观众。',
    duration: '2.5小时',
    distance: '约2.0公里',
    exhibitCount: 4,
    difficulty: 'medium',
    coverImage: 'https://picsum.photos/id/1061/750/420',
    tags: ['丝路', '敦煌', '历史'],
    isWheelchairAccessible: true,
    isRecommended: false,
    stops: [
      { id: 's2-1', name: '入口大厅', location: '一楼', duration: '5分钟', description: '了解丝绸之路路线概览' },
      { id: 's2-2', name: '敦煌飞天壁画', exhibitId: 'e1', location: '第一展厅A区·二楼', duration: '20分钟', description: '飞天形象演变与丝路文化交融' },
      { id: 's2-3', name: '敦煌彩塑菩萨像', exhibitId: 'e6', location: '第一展厅B区·二楼', duration: '20分钟', description: '唐代雕塑精品，丝路艺术结晶' },
      { id: 's2-4', name: '司母戊鼎', exhibitId: 'e3', location: '第三展厅C区·一楼', duration: '15分钟', description: '礼乐文明与丝路贸易' }
    ]
  },
  {
    id: 'rt3',
    name: '亲子童趣探索路线',
    description: '专为家庭观众设计的趣味路线，包含互动体验区、儿童讲解和手工活动，让孩子在游玩中学习传统文化。',
    duration: '2小时',
    distance: '约1.5公里',
    exhibitCount: 3,
    difficulty: 'easy',
    coverImage: 'https://picsum.photos/id/1080/750/420',
    tags: ['亲子', '儿童', '互动'],
    isWheelchairAccessible: true,
    isRecommended: true,
    stops: [
      { id: 's3-1', name: '入口大厅', location: '一楼', duration: '5分钟', description: '领取亲子导览手册和互动任务卡' },
      { id: 's3-2', name: '互动展厅', location: '负一楼', duration: '30分钟', description: 'AR互动体验、手工制作区域' },
      { id: 's3-3', name: '四羊方尊', exhibitId: 'e8', location: '第三展厅A区·一楼', duration: '15分钟', description: '趣味讲解：小羊为什么在青铜器上？' },
      { id: 's3-4', name: '青花缠枝莲纹瓶', exhibitId: 'e10', location: '第五展厅B区·二楼', duration: '15分钟', description: '寻找花纹中的秘密，绘制自己的青花图案' }
    ]
  },
  {
    id: 'rt4',
    name: '传统工艺鉴赏路线',
    description: '深入了解中国传统工艺之美，从陶瓷到家具，从青铜到玉器，感受匠人的精湛技艺与匠心精神。',
    duration: '3小时',
    distance: '约2.5公里',
    exhibitCount: 5,
    difficulty: 'hard',
    coverImage: 'https://picsum.photos/id/1082/750/420',
    tags: ['工艺', '陶瓷', '家具', '青铜'],
    isWheelchairAccessible: false,
    isRecommended: false,
    stops: [
      { id: 's4-1', name: '入口大厅', location: '一楼', duration: '5分钟', description: '领取工艺鉴赏手册' },
      { id: 's4-2', name: '汝窑天青釉盘', exhibitId: 'e5', location: '第五展厅D区·二楼', duration: '15分钟', description: '解析汝窑釉色与烧制工艺' },
      { id: 's4-3', name: '黄花梨圈椅', exhibitId: 'e2', location: '第二展厅B区·三楼', duration: '15分钟', description: '明式家具榫卯结构详解' },
      { id: 's4-4', name: '司母戊鼎', exhibitId: 'e3', location: '第三展厅C区·一楼', duration: '15分钟', description: '青铜铸造工艺流程' },
      { id: 's4-5', name: '青花缠枝莲纹瓶', exhibitId: 'e10', location: '第五展厅B区·二楼', duration: '15分钟', description: '青花瓷绘制技法' },
      { id: 's4-6', name: '紫檀雕龙纹宝座', exhibitId: 'e7', location: '第二展厅A区·三楼', duration: '15分钟', description: '清代宫廷家具雕刻工艺' }
    ]
  },
  {
    id: 'rt5',
    name: '无障碍参观路线',
    description: '全程无障碍通道，电梯直达各楼层，适合行动不便的观众。精选最具代表性的展品，参观体验舒适便捷。',
    duration: '1.5小时',
    distance: '约0.8公里',
    exhibitCount: 3,
    difficulty: 'easy',
    coverImage: 'https://picsum.photos/id/1059/750/420',
    tags: ['无障碍', '轮椅', '舒适'],
    isWheelchairAccessible: true,
    isRecommended: false,
    stops: [
      { id: 's5-1', name: '入口大厅', location: '一楼', duration: '5分钟', description: '无障碍通道入口，轮椅借用服务' },
      { id: 's5-2', name: '司母戊鼎', exhibitId: 'e3', location: '第三展厅C区·一楼', duration: '15分钟', description: '电梯直达，宽敞通道' },
      { id: 's5-3', name: '敦煌飞天壁画', exhibitId: 'e1', location: '第一展厅A区·二楼', duration: '15分钟', description: '电梯直达二楼，低视角展柜' }
    ]
  },
  {
    id: 'rt6',
    name: '书画艺术主题路线',
    description: '徜徉于翰墨丹青之间，从晋唐到明清，再到近现代，领略中国书画艺术的传承与发展。',
    duration: '2小时',
    distance: '约1.8公里',
    exhibitCount: 3,
    difficulty: 'medium',
    coverImage: 'https://picsum.photos/id/1073/750/420',
    tags: ['书画', '水墨', '艺术'],
    isWheelchairAccessible: true,
    isRecommended: false,
    stops: [
      { id: 's6-1', name: '入口大厅', location: '一楼', duration: '5分钟', description: '领取书画鉴赏手册' },
      { id: 's6-2', name: '齐白石虾趣图', exhibitId: 'e4', location: '第四展厅A区·四楼', duration: '20分钟', description: '大写意花鸟画巅峰之作' },
      { id: 's6-3', name: '张大千庐山图', exhibitId: 'e9', location: '第四展厅B区·四楼', duration: '20分钟', description: '泼彩山水的开创性探索' },
      { id: 's6-4', name: '敦煌飞天壁画', exhibitId: 'e1', location: '第一展厅A区·二楼', duration: '15分钟', description: '唐代壁画中的绘画技法' }
    ]
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
