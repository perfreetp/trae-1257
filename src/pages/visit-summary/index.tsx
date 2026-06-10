import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store/appStore';
import { getRouteById } from '@/data/routes';
import type { RouteVisitRecord } from '@/types/route';

const formatDuration = (startTime: string, endTime?: string): string => {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  const diff = Math.floor((end - start) / 1000);
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  if (hours > 0) return `${hours}小时${minutes}分钟`;
  return `${minutes}分钟`;
};

const VisitSummaryPage: React.FC = () => {
  const router = useRouter();
  const recordId = router.params.recordId || '';
  const visitRecords = useAppStore(state => state.visitRecords);

  const record: RouteVisitRecord | undefined = recordId
    ? visitRecords.find(r => r.id === recordId)
    : visitRecords.find(r => r.status === 'completed');

  const route = record ? getRouteById(record.routeId) : undefined;

  const handleShare = () => {
    Taro.navigateTo({ url: '/pages/share-poster/index' });
  };

  const handleBackToMine = () => {
    Taro.switchTab({ url: '/pages/mine/index' });
  };

  const handleViewRoute = () => {
    if (record) {
      Taro.navigateTo({ url: `/pages/route-detail/index?id=${record.routeId}` });
    }
  };

  if (!record || !route) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text>参观记录不存在</Text>
        </View>
      </View>
    );
  }

  const totalStops = record.startStops.length;
  const completedStops = record.completedStops.length;
  const duration = formatDuration(record.startTime, record.endTime);

  const stats = [
    { icon: '🏆', label: '完成站点', value: `${completedStops}/${totalStops}` },
    { icon: '⏱️', label: '参观时长', value: duration },
    { icon: '🚶', label: '步行距离', value: route.distance },
    { icon: '💪', label: '难度等级', value: route.difficulty }
  ];

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.summaryHeader}>
        <View className={styles.trophy}>🏆</View>
        <Text className={styles.congrats}>恭喜完成参观！</Text>
        <Text className={styles.routeName}>{route.name}</Text>
        <Text className={styles.finishTime}>
          {record.endTime ? `完成时间：${record.endTime}` : ''}
        </Text>
      </View>

      <View className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} className={styles.statCard}>
            <Text className={styles.statIcon}>{stat.icon}</Text>
            <Text className={styles.statValue}>{stat.value}</Text>
            <Text className={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.accent}>·</Text> 参观站点
        </Text>
        <View className={styles.stopList}>
          {record.startStops.map((stop, index) => {
            const isCompleted = record.completedStops.includes(stop.id);
            return (
              <View
                key={stop.id}
                className={`${styles.stopItem} ${isCompleted ? styles.completed : ''}`}
              >
                <View className={styles.stopNumber}>
                  {isCompleted ? '✓' : index + 1}
                </View>
                <View className={styles.stopInfo}>
                  <Text className={styles.stopName}>{stop.name}</Text>
                  <Text className={styles.stopDesc}>{stop.description}</Text>
                </View>
                {isCompleted && <Text className={styles.stopCheck}>✓</Text>}
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.accent}>·</Text> 路线信息
        </Text>
        <View className={styles.routeInfoCard}>
          <Image className={styles.routeCover} src={route.coverImage} mode="aspectFill" />
          <View className={styles.routeDesc}>{route.description}</View>
        </View>
      </View>

      <View className={styles.actionSection}>
        <View className={styles.primaryBtn} onClick={handleShare}>
          📤 生成分享海报
        </View>
        <View className={styles.secondaryBtn} onClick={handleViewRoute}>
          🗺️ 再看一次路线
        </View>
        <View className={styles.tertiaryBtn} onClick={handleBackToMine}>
          📋 返回我的记录
        </View>
      </View>

      <View style={{ height: '60rpx' }} />
    </ScrollView>
  );
};

export default VisitSummaryPage;
