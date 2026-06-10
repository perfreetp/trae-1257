import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { getRouteById, getDifficultyLabel } from '@/data/routes';

const RouteDetailPage: React.FC = () => {
  const router = useRouter();
  const routeId = router.params.id || 'rt1';
  const route = getRouteById(routeId as string);

  const handleStartRoute = () => {
    Taro.showToast({ title: '开始路线导览', icon: 'none' });
  };

  const handleShare = () => {
    Taro.navigateTo({ url: '/pages/share-poster/index' });
  };

  const handleSave = () => {
    Taro.showToast({ title: '已保存到我的路线', icon: 'none' });
  };

  const handleStopClick = (stop: typeof route.stops[0]) => {
    if (stop.exhibitId) {
      Taro.navigateTo({
        url: `/pages/exhibit-detail/index?id=${stop.exhibitId}`
      });
    } else {
      Taro.showToast({ title: stop.description, icon: 'none' });
    }
  };

  const handleExhibitDetail = (exhibitId: string) => {
    Taro.navigateTo({
      url: `/pages/exhibit-detail/index?id=${exhibitId}`
    });
  };

  if (!route) {
    return (
      <View className={styles.page}>
        <Text>路线不存在</Text>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.routeHeader}>
        <Text className={styles.routeName}>{route.name}</Text>
        <Text className={styles.routeDesc}>{route.description}</Text>
        <View className={styles.routeStats}>
          <View className={styles.statItem}>
            <Text className={styles.icon}>⏱️</Text>
            <Text>{route.duration}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.icon}>👣</Text>
            <Text>{route.distance}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.icon}>🎯</Text>
            <Text>{route.stops.length}个站点</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.icon}>💪</Text>
            <Text>{getDifficultyLabel(route.difficulty)}</Text>
          </View>
        </View>
      </View>

      <View className={styles.tipSection}>
        <View className={styles.tipHeader}>
          <Text className={styles.icon}>💡</Text>
          <Text className={styles.tipTitle}>路线贴士</Text>
        </View>
        <Text className={styles.tipText}>
          建议从入口出发，按照编号顺序参观，不走回头路。每个展品都有语音讲解，记得戴耳机效果更佳哦～
        </Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.accent}>·</Text>
          参观站点（{route.stops.length}站）
        </Text>
        <View className={styles.timeline}>
          {route.stops.map((stop, index) => (
            <View key={stop.id} className={styles.timelineItem}>
              <View className={styles.stopNumber}>{index + 1}</View>
              <View
                className={styles.stopContent}
                onClick={() => handleStopClick(stop)}
              >
                <Text className={styles.stopName}>{stop.name}</Text>
                <Text className={styles.stopInfo}>{stop.location} · 约{stop.duration}</Text>
                <Text className={styles.stopDesc}>{stop.description}</Text>
                <View className={styles.stopActions}>
                  {stop.exhibitId && (
                    <View className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleExhibitDetail(stop.exhibitId!); }}>
                      🎧 展品讲解
                    </View>
                  )}
                  <View className={styles.actionBtn}>📖 查看详情</View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.actionItem} onClick={handleSave}>
          <Text className={styles.icon}>⭐</Text>
          <Text className={styles.label}>收藏</Text>
        </View>
        <View className={styles.actionItem} onClick={handleShare}>
          <Text className={styles.icon}>📤</Text>
          <Text className={styles.label}>分享</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleStartRoute}>
          <Text className={styles.icon}>🚶</Text>
          <Text>开始导览</Text>
        </View>
      </View>
    </View>
  );
};

export default RouteDetailPage;
