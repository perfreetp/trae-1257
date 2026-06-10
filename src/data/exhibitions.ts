import type { Exhibition, Exhibit } from '@/types/exhibition';

export const exhibitions: Exhibition[] = [
  {
    id: '1',
    title: '丝路瑰宝·敦煌艺术大展',
    subtitle: '穿越千年的敦煌之美',
    description: '本展览汇集敦煌莫高窟珍贵壁画、彩塑复制品及数字化复原作品，带您领略丝绸之路的璀璨文化。展览分为飞天神韵、千佛之光、丝路商旅三个单元，全面展现敦煌艺术的博大精深。',
    coverImage: 'https://picsum.photos/id/1061/750/500',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    location: '第一展厅',
    floor: '二楼',
    exhibitCount: 128,
    isHot: true,
    theme: '历史文化'
  },
  {
    id: '2',
    title: '匠心独运·明清家具珍品展',
    subtitle: '明韵清风·木韵芳华',
    description: '精选明清两代黄花梨、紫檀等名贵木材制作的家具珍品，展现中国传统家具工艺的精湛技艺与独特审美。',
    coverImage: 'https://picsum.photos/id/1059/750/500',
    startDate: '2026-02-01',
    endDate: '2026-07-15',
    location: '第二展厅',
    floor: '三楼',
    exhibitCount: 86,
    isNew: true,
    theme: '传统工艺'
  },
  {
    id: '3',
    title: '青铜时代·商周青铜文明',
    subtitle: '吉金光华·礼乐于斯',
    description: '展出商周时期青铜器精品，包括礼器、兵器、乐器等，带您领略青铜时代的辉煌文明与工匠精神。',
    coverImage: 'https://picsum.photos/id/1025/750/500',
    startDate: '2025-12-01',
    endDate: '2026-05-31',
    location: '第三展厅',
    floor: '一楼',
    exhibitCount: 92,
    theme: '历史文化'
  },
  {
    id: '4',
    title: '翰墨丹青·近现代书画名家展',
    subtitle: '笔墨精神·意境悠远',
    description: '汇集齐白石、张大千、徐悲鸿等近现代书画名家真迹，展现中国书画艺术的传承与创新。',
    coverImage: 'https://picsum.photos/id/1073/750/500',
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    location: '第四展厅',
    floor: '四楼',
    exhibitCount: 68,
    isHot: true,
    theme: '书画艺术'
  },
  {
    id: '5',
    title: '瓷韵千年·历代瓷器精品展',
    subtitle: '青瓷白瓷·彩瓷缤纷',
    description: '从原始青瓷到明清官窑，系统展示中国瓷器发展脉络，领略中华瓷文化的独特魅力。',
    coverImage: 'https://picsum.photos/id/1082/750/500',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    location: '第五展厅',
    floor: '二楼',
    exhibitCount: 156,
    theme: '陶瓷艺术'
  },
  {
    id: '6',
    title: '童趣工坊·儿童互动体验馆',
    subtitle: '边玩边学·快乐成长',
    description: '专为儿童设计的互动体验区，通过AR技术、手工制作等方式，让孩子在游戏中学习传统文化知识。',
    coverImage: 'https://picsum.photos/id/1080/750/500',
    startDate: '长期展出',
    endDate: '长期展出',
    location: '互动展厅',
    floor: '负一楼',
    exhibitCount: 24,
    theme: '儿童教育'
  }
];

export const exhibits: Exhibit[] = [
  {
    id: 'e1',
    name: '敦煌飞天壁画',
    subtitle: '唐代·莫高窟第320窟',
    description: '这幅飞天壁画是敦煌莫高窟的代表作之一。飞天是佛教中能奏乐、善飞舞的天人，敦煌飞天融合了中印文化特点，成为中国艺术史上的经典形象。画面中的飞天姿态轻盈，衣带飘举，手持乐器，在云端翩翩起舞，展现了唐代艺术的浪漫与华丽。',
    image: 'https://picsum.photos/id/1061/600/600',
    images: [
      'https://picsum.photos/id/1061/800/800',
      'https://picsum.photos/id/1059/800/800',
      'https://picsum.photos/id/1073/800/800'
    ],
    era: '唐代',
    category: '壁画',
    location: '第一展厅A区',
    floor: '二楼',
    audioDuration: '5分30秒',
    arEnabled: true,
    isFavorite: true,
    hasChildVersion: true
  },
  {
    id: 'e2',
    name: '黄花梨圈椅',
    subtitle: '明代·万历年间',
    description: '这对明代黄花梨圈椅是明式家具的典范之作。圈椅靠背与扶手浑然一体，线条流畅优美，体现了"天圆地方"的传统哲学理念。黄花梨木纹清晰美丽，包浆温润，历经数百年仍保存完好。',
    image: 'https://picsum.photos/id/1059/600/600',
    era: '明代',
    category: '家具',
    location: '第二展厅B区',
    floor: '三楼',
    audioDuration: '4分20秒',
    arEnabled: true,
    isFavorite: false,
    hasChildVersion: false
  },
  {
    id: 'e3',
    name: '司母戊鼎',
    subtitle: '商代晚期',
    description: '司母戊鼎是中国现存最大最重的青铜器，重达832.84公斤。鼎身饰有精美的兽面纹，四足粗壮有力，体现了商代高超的青铜铸造工艺。该鼎是商王为祭祀其母所铸，具有极高的历史与艺术价值。',
    image: 'https://picsum.photos/id/1025/600/600',
    era: '商代',
    category: '青铜器',
    location: '第三展厅C区',
    floor: '一楼',
    audioDuration: '6分15秒',
    arEnabled: true,
    isFavorite: true,
    hasChildVersion: true
  },
  {
    id: 'e4',
    name: '齐白石虾趣图',
    subtitle: '近现代·1947年作',
    description: '齐白石的虾画堪称一绝。此图中群虾嬉戏，形态各异，栩栩如生。画家运用淡墨表现虾体的透明质感，浓墨点眼，寥寥数笔便将虾的灵动神态表现得淋漓尽致，堪称大写意花鸟画的巅峰之作。',
    image: 'https://picsum.photos/id/1073/600/600',
    era: '近现代',
    category: '书画',
    location: '第四展厅A区',
    floor: '四楼',
    audioDuration: '4分50秒',
    arEnabled: false,
    isFavorite: false,
    hasChildVersion: false
  },
  {
    id: 'e5',
    name: '汝窑天青釉盘',
    subtitle: '北宋·汝官窑',
    description: '汝窑为宋代五大名窑之首，天青釉是其代表性釉色。此盘釉色如雨过天青，温润如玉，釉面有细小开片，俗称"蟹爪纹"。汝窑瓷器存世极少，此盘为难得的珍品。',
    image: 'https://picsum.photos/id/1082/600/600',
    era: '北宋',
    category: '瓷器',
    location: '第五展厅D区',
    floor: '二楼',
    audioDuration: '5分10秒',
    arEnabled: true,
    isFavorite: true,
    hasChildVersion: false
  },
  {
    id: 'e6',
    name: '敦煌彩塑菩萨像',
    subtitle: '唐代·莫高窟第45窟',
    description: '这尊菩萨彩塑是唐代雕塑艺术的精品。菩萨面容丰腴，神态安详，身姿优美，衣纹流畅自然。彩绘虽经千年仍色彩鲜艳，展现了唐代高超的雕塑与绘画技艺。',
    image: 'https://picsum.photos/id/1039/600/600',
    era: '唐代',
    category: '雕塑',
    location: '第一展厅B区',
    floor: '二楼',
    audioDuration: '5分45秒',
    arEnabled: true,
    isFavorite: false,
    hasChildVersion: true
  },
  {
    id: 'e7',
    name: '紫檀雕龙纹宝座',
    subtitle: '清代·乾隆年间',
    description: '这件紫檀宝座是清代宫廷家具的代表作品。宝座通体以紫檀木雕琢而成，靠背及扶手满雕龙纹，工艺精湛，气势恢宏，彰显了皇家的尊贵与威严。',
    image: 'https://picsum.photos/id/1083/600/600',
    era: '清代',
    category: '家具',
    location: '第二展厅A区',
    floor: '三楼',
    audioDuration: '4分30秒',
    arEnabled: false,
    isFavorite: false,
    hasChildVersion: false
  },
  {
    id: 'e8',
    name: '四羊方尊',
    subtitle: '商代晚期',
    description: '四羊方尊是商代青铜器的杰作。尊四角各塑一卷角羊，羊首伸出器外，造型生动逼真。尊身饰有精美的兽面纹和夔龙纹，整体铸造工艺极为复杂，代表了商代青铜铸造的最高水平。',
    image: 'https://picsum.photos/id/1050/600/600',
    era: '商代',
    category: '青铜器',
    location: '第三展厅A区',
    floor: '一楼',
    audioDuration: '5分50秒',
    arEnabled: true,
    isFavorite: true,
    hasChildVersion: true
  },
  {
    id: 'e9',
    name: '张大千庐山图',
    subtitle: '近现代·1950年代',
    description: '这幅《庐山图》是张大千泼彩山水的代表作。画家以传统笔墨为基础，融入西方印象派色彩观念，泼墨泼彩，气势磅礴，开创了中国山水画的新境界。',
    image: 'https://picsum.photos/id/1036/600/600',
    era: '近现代',
    category: '书画',
    location: '第四展厅B区',
    floor: '四楼',
    audioDuration: '5分20秒',
    arEnabled: false,
    isFavorite: false,
    hasChildVersion: false
  },
  {
    id: 'e10',
    name: '青花缠枝莲纹瓶',
    subtitle: '明代·永乐年间',
    description: '永乐青花是中国青花瓷的黄金时期。此瓶造型端庄秀美，青花发色浓艳青翠，缠枝莲纹布局疏朗有致，是明代官窑青花瓷的精品之作。',
    image: 'https://picsum.photos/id/1011/600/600',
    era: '明代',
    category: '瓷器',
    location: '第五展厅B区',
    floor: '二楼',
    audioDuration: '4分40秒',
    arEnabled: true,
    isFavorite: false,
    hasChildVersion: false
  }
];

export const getExhibitionById = (id: string): Exhibition | undefined => {
  return exhibitions.find(item => item.id === id);
};

export const getExhibitById = (id: string): Exhibit | undefined => {
  return exhibits.find(item => item.id === id);
};

export const getExhibitsByExhibitionId = (exhibitionId: string): Exhibit[] => {
  return exhibits.slice(0, 8);
};
