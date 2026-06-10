import type { Activity, Reservation } from '@/types/activity';

export const activities: Activity[] = [
  {
    id: 'a1',
    title: '敦煌艺术专题讲座',
    subtitle: '樊锦诗先生解读敦煌之美',
    description: '邀请敦煌研究院名誉院长樊锦诗先生，为您深度解读敦煌艺术的历史渊源、艺术特色与文化价值。带您走进千年莫高窟，领略丝路文明的璀璨光芒。',
    coverImage: 'https://picsum.photos/id/1061/750/420',
    date: '2026-06-15',
    time: '14:00-16:00',
    duration: '2小时',
    location: '学术报告厅',
    capacity: 200,
    signedUp: 156,
    price: 0,
    type: 'lecture',
    status: 'upcoming',
    isReservation: true,
    guest: {
      name: '樊锦诗',
      title: '敦煌研究院名誉院长',
      bio: '被誉为"敦煌女儿"，长期从事敦煌文物保护与研究工作，为敦煌艺术的传承做出了卓越贡献。',
      avatar: 'https://picsum.photos/id/64/200/200'
    }
  },
  {
    id: 'a2',
    title: '陶艺体验工坊',
    subtitle: '亲手制作专属陶瓷',
    description: '在专业陶艺师的指导下，体验拉坯、塑形、上釉等陶瓷制作工艺，创作属于自己的陶瓷作品。作品烧制完成后可邮寄到家。',
    coverImage: 'https://picsum.photos/id/1082/750/420',
    date: '2026-06-18',
    time: '10:00-12:00',
    duration: '2小时',
    location: '陶艺体验室',
    capacity: 20,
    signedUp: 18,
    price: 128,
    type: 'workshop',
    status: 'upcoming',
    isReservation: true,
    guest: {
      name: '李明远',
      title: '高级陶艺师',
      bio: '从事陶艺创作20余年，擅长传统青瓷与现代陶艺的融合创新，作品多次获国家级大奖。',
      avatar: 'https://picsum.photos/id/91/200/200'
    }
  },
  {
    id: 'a3',
    title: '青铜时代亲子导览',
    subtitle: '小小考古学家养成记',
    description: '专为6-12岁儿童设计的亲子导览活动，通过趣味问答、手工制作等互动方式，让孩子在游戏中了解青铜文明，培养对传统文化的兴趣。',
    coverImage: 'https://picsum.photos/id/1025/750/420',
    date: '2026-06-20',
    time: '09:30-11:30',
    duration: '2小时',
    location: '第三展厅',
    capacity: 30,
    signedUp: 25,
    price: 68,
    type: 'tour',
    status: 'upcoming',
    isReservation: true
  },
  {
    id: 'a4',
    title: '古琴雅集',
    subtitle: '千年古韵·琴瑟和鸣',
    description: '邀请古琴名家演奏经典曲目，品茗听琴，感受传统音乐之美。雅集后设交流环节，可与演奏家面对面交流。',
    coverImage: 'https://picsum.photos/id/1083/750/420',
    date: '2026-06-22',
    time: '19:00-21:00',
    duration: '2小时',
    location: '古琴馆',
    capacity: 50,
    signedUp: 42,
    price: 188,
    type: 'performance',
    status: 'upcoming',
    isReservation: true,
    guest: {
      name: '陈雅韵',
      title: '古琴演奏家',
      bio: '国家级非物质文化遗产古琴艺术传承人，师从广陵派大师，演奏风格古朴典雅。',
      avatar: 'https://picsum.photos/id/65/200/200'
    }
  },
  {
    id: 'a5',
    title: '书法入门体验课',
    subtitle: '一笔一画·感悟书法之美',
    description: '从基础的握笔、运笔开始，体验书法艺术的魅力。课程提供全套文房四宝，零基础也能轻松入门。',
    coverImage: 'https://picsum.photos/id/1073/750/420',
    date: '2026-06-25',
    time: '14:00-16:30',
    duration: '2.5小时',
    location: '书法教室',
    capacity: 15,
    signedUp: 12,
    price: 98,
    type: 'workshop',
    status: 'upcoming',
    isReservation: true,
    guest: {
      name: '王墨轩',
      title: '书法教育家',
      bio: '中国书法家协会会员，从事书法教育15年，倡导"以书养心"的教学理念。',
      avatar: 'https://picsum.photos/id/177/200/200'
    }
  },
  {
    id: 'a6',
    title: '古画修复观摩',
    subtitle: '探秘文物修复工作室',
    description: '走进文物修复工作室，观看古画修复全过程，了解文物保护的科技与匠心。名额有限，先到先得。',
    coverImage: 'https://picsum.photos/id/1059/750/420',
    date: '2026-06-28',
    time: '10:00-11:30',
    duration: '1.5小时',
    location: '文物修复中心',
    capacity: 10,
    signedUp: 8,
    price: 0,
    type: 'tour',
    status: 'upcoming',
    isReservation: true
  },
  {
    id: 'a7',
    title: '明清家具鉴赏讲座',
    subtitle: '明式家具的审美与收藏',
    description: '邀请家具鉴赏专家，讲解明清家具的历史演变、工艺特点与鉴赏要点，助您提升传统家具的审美能力。',
    coverImage: 'https://picsum.photos/id/1080/750/420',
    date: '2026-07-02',
    time: '14:30-16:30',
    duration: '2小时',
    location: '多功能厅',
    capacity: 100,
    signedUp: 67,
    price: 50,
    type: 'lecture',
    status: 'upcoming',
    isReservation: true,
    guest: {
      name: '张檀香',
      title: '古典家具鉴赏家',
      bio: '故宫博物院特聘研究员，专注明清家具研究30年，出版多部专著。',
      avatar: 'https://picsum.photos/id/180/200/200'
    }
  },
  {
    id: 'a8',
    title: '端午香囊制作',
    subtitle: '巧手做香囊·浓情过端午',
    description: '端午节特别活动，亲手制作传统香囊。学习传统刺绣工艺，配以中草药香料，制作专属端午礼物。',
    coverImage: 'https://picsum.photos/id/1039/750/420',
    date: '2026-06-10',
    time: '09:00-11:00',
    duration: '2小时',
    location: '民俗体验室',
    capacity: 25,
    signedUp: 25,
    price: 78,
    type: 'workshop',
    status: 'ongoing',
    isReservation: true
  }
];

export const reservations: Reservation[] = [
  {
    id: 'r1',
    activityId: 'a1',
    activityTitle: '敦煌艺术专题讲座',
    date: '2026-06-15',
    time: '14:00-16:00',
    status: 'reserved',
    ticketCount: 2,
    reservationTime: '2026-06-01 10:30'
  },
  {
    id: 'r2',
    activityId: 'a2',
    activityTitle: '陶艺体验工坊',
    date: '2026-06-18',
    time: '10:00-12:00',
    status: 'reserved',
    ticketCount: 1,
    reservationTime: '2026-06-02 15:20'
  },
  {
    id: 'r3',
    activityId: 'a8',
    activityTitle: '端午香囊制作',
    date: '2026-06-10',
    time: '09:00-11:00',
    status: 'completed',
    ticketCount: 2,
    reservationTime: '2026-05-28 09:15'
  }
];

export const getActivityById = (id: string): Activity | undefined => {
  return activities.find(item => item.id === id);
};

export const getActivityTypeLabel = (type: Activity['type']): string => {
  const map = {
    lecture: '讲座',
    workshop: '工坊',
    tour: '导览',
    performance: '演出'
  };
  return map[type];
};

export const getActivityStatusLabel = (status: Activity['status']): string => {
  const map = {
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束'
  };
  return map[status];
};
