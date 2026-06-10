import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { getActivityById } from '@/data/activities';

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.id || 'a1';
  const activity = getActivityById(activityId as string);

  const handleSignup = () => {
    console.log('[ActivityDetail] 立即报名');
    Taro.showToast({ title: '报名成功', icon: 'success' });
  };

  const handleShare = () => {
    console.log('[ActivityDetail] 分享活动');
    Taro.navigateTo({ url: '/pages/share-poster/index' });
  };

  const handleRemind = () => {
    console.log('[ActivityDetail] 设置提醒');
    Taro.showToast({ title: '已设置提醒', icon: 'none' });
  };

  if (!activity) {
    return (
      <View className={styles.page}>
        <Text>活动不存在</Text>
      </View>
    );
  }

  const statusText: Record<string, string> = {
    ongoing: '报名中',
    upcoming: '即将开始',
    ended: '已结束'
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.coverImage}>
          <Image src={activity.coverImage} mode="aspectFill" />
        </View>

        <View className={styles.activityInfo}>
          <View className={`${styles.statusBadge} ${styles[activity.status]}`}>
            {statusText[activity.status] || '报名中'}
          </View>
          <Text className={styles.title}>{activity.title}</Text>
          <View className={styles.category}>{activity.category}</View>
          <View className={styles.metaList}>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📅</Text>
              <Text>{activity.date} {activity.time}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📍</Text>
              <Text>{activity.location}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>👥</Text>
              <Text>已报名 {activity.participants}/{activity.capacity} 人</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>⏱️</Text>
              <Text>活动时长：约{activity.duration}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text>
            活动介绍
          </Text>
          <Text className={styles.sectionContent}>{activity.description}</Text>
        </View>

        {activity.guest && (
          <View className={`${styles.section} ${styles.guestSection}`}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.accent}>·</Text>
              主讲嘉宾
            </Text>
            <View className={styles.guestCard}>
              <View className={styles.avatar}>
                <Image src={activity.guest.avatar} mode="aspectFill" />
              </View>
              <View className={styles.guestInfo}>
                <Text className={styles.name}>{activity.guest.name}</Text>
                <Text className={styles.title}>{activity.guest.title}</Text>
                <Text className={styles.bio}>{activity.guest.bio}</Text>
              </View>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text>
            温馨提示
          </Text>
          <Text className={styles.sectionContent}>
            1. 请提前15分钟到达活动现场签到
            {'\n'}
            2. 活动期间请将手机调至静音
            {'\n'}
            3. 如需取消预约，请提前24小时操作
            {'\n'}
            4. 儿童请在家长陪同下参与
          </Text>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.priceInfo}>
          <Text className={styles.price}>{activity.price === '免费' ? '免费' : `¥${activity.price}`}</Text>
          <Text className={styles.priceLabel}>每人</Text>
        </View>
        <View className={styles.secondaryBtn} onClick={handleRemind}>
          <Text>🔔 提醒</Text>
        </View>
        <View
          className={`${styles.primaryBtn} ${activity.status === 'ended' ? styles.disabled : ''}`}
          onClick={activity.status !== 'ended' ? handleSignup : undefined}
        >
          <Text>{activity.status === 'ended' ? '已结束' : '立即报名'}</Text>
        </View>
      </View>
    </View>
  );
};

export default ActivityDetailPage;
