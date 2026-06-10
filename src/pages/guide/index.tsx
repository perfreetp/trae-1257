import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { routes, crowdInfoList, getCrowdLevelLabel, getDifficultyLabel } from '@/data/routes';
import type { Route, CrowdInfo } from '@/types/route';

const GuidePage: React.FC = () => {
  const [activeFloor, setActiveFloor] = useState(1);

  const floors = [
    { label: '负一楼', value: -1 },
    { label: '一楼', value: 1 },
    { label: '二楼', value: 2 },
    { label: '三楼', value: 3 },
    { label: '四楼', value: 4 }
  ];

  const exhibitPositions = [
    { id: 1, name: '第三展厅', x: 25, y: 40, level: 1, isCrowd: false },
    { id: 2, name: '入口大厅', x: 50, y: 80, level: 1, isCrowd: true },
    { id: 3, name: '学术报告厅', x: 75, y: 60, level: 1, isCrowd: false },
    { id: 4, name: '我的位置', x: 50, y: 65, level: 1, isMy: true }
  ];

  const handleFloorChange = (floor: number) => {
    console.log('[Guide] 切换楼层:', floor);
    setActiveFloor(floor);
  };

  const handleRouteClick = (route: Route) => {
    console.log('[Guide] 点击路线:', route.name);
    Taro.navigateTo({
      url: `/pages/route-detail/index?id=${route.id}`
    });
  };

  const handleLocationClick = () => {
    console.log('[Guide] 点击定位');
    Taro.showToast({ title: '正在定位...', icon: 'none' });
  };

  const handleZoomIn = () => {
    console.log('[Guide] 放大地图');
  };

  const handleZoomOut = () => {
    console.log('[Guide] 缩小地图');
  };

  const handleAccessibleRoute = () => {
    console.log('[Guide] 无障碍路线');
    Taro.showToast({ title: '无障碍路线已规划', icon: 'none' });
  };

  const handleMoreClick = () => {
    console.log('[Guide] 查看更多路线');
    Taro.showToast({ title: '更多路线', icon: 'none' });
  };

  const getCrowdBarClass = (level: CrowdInfo['level']) => {
    return level;
  };

  const getCrowdPercent = (crowd: CrowdInfo) => {
    return Math.round((crowd.count / crowd.capacity) * 100);
  };

  const currentExhibits = exhibitPositions.filter(item => item.level === activeFloor);

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.floorTabs}>
        {floors.map(floor => (
          <View
            key={floor.value}
            className={`${styles.tabItem} ${activeFloor === floor.value ? styles.active : ''}`}
            onClick={() => handleFloorChange(floor.value)}
          >
            <Text>{floor.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.mapContainer}>
        <View className={styles.mapBg} />
        <View className={styles.mapGrid} />
        <View className={styles.mapTitle}>{activeFloor > 0 ? `${activeFloor}楼平面图` : '负一楼平面图'}</View>
        
        <View className={styles.mapContent}>
          {currentExhibits.map(item => (
            <View
              key={item.id}
              className={`${styles.exhibitPoint} ${item.isCrowd ? styles.crowded : ''} ${item.isMy ? styles.myPosition : ''}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <View className={styles.pointDot} />
              <Text className={styles.pointLabel}>{item.name}</Text>
            </View>
          ))}
        </View>

        <View className={styles.mapToolbar}>
          <View className={styles.toolBtn} onClick={handleLocationClick}>
            <Text>📍</Text>
          </View>
          <View className={styles.toolBtn} onClick={handleZoomIn}>
            <Text>➕</Text>
          </View>
          <View className={styles.toolBtn} onClick={handleZoomOut}>
            <Text>➖</Text>
          </View>
          <View className={styles.toolBtn} onClick={handleAccessibleRoute}>
            <Text>♿</Text>
          </View>
        </View>
      </View>

      <View className={styles.crowdSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text> 实时拥挤度
          </Text>
          <View className={styles.crowdLegend}>
            <View className={styles.legendItem}>
              <View className={`${styles.legendDot} ${styles.normal}`} />
              <Text>舒适</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={`${styles.legendDot} ${styles.moderate}`} />
              <Text>适中</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={`${styles.legendDot} ${styles.crowded}`} />
              <Text>拥挤</Text>
            </View>
          </View>
        </View>
        <View className={styles.crowdList}>
          {crowdInfoList.slice(0, 5).map(crowd => (
            <View key={crowd.location} className={styles.crowdItem}>
              <Text className={styles.locationName}>{crowd.location}</Text>
              <View className={styles.crowdBar}>
                <View
                  className={`${styles.crowdFill} ${styles[getCrowdBarClass(crowd.level)]}`}
                  style={{ width: `${getCrowdPercent(crowd)}%` }}
                />
              </View>
              <Text className={styles.crowdPercent}>{getCrowdPercent(crowd)}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text> 推荐路线
          </Text>
          <View className={styles.sectionMore} onClick={handleMoreClick}>
            <Text>更多</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>
        <View className={styles.routeList}>
          {routes.slice(0, 3).map(route => (
            <View
              key={route.id}
              className={`${styles.routeCard} ${route.isRecommended ? styles.recommended : ''}`}
              onClick={() => handleRouteClick(route)}
            >
              <View className={styles.routeImage}>
                <Image src={route.coverImage} mode="aspectFill" />
                {route.isRecommended && (
                  <View className={styles.recommendBadge}>推荐路线</View>
                )}
                {route.isWheelchairAccessible && (
                  <View className={styles.accessibleBadge}>♿ 无障碍</View>
                )}
              </View>
              <View className={styles.routeInfo}>
                <Text className={styles.routeName}>{route.name}</Text>
                <Text className={styles.routeDesc}>{route.description}</Text>
                <View className={styles.routeMeta}>
                  <View className={styles.metaItem}>
                    <Text className={styles.icon}>⏱️</Text>
                    <Text>{route.duration}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.icon}>🚶</Text>
                    <Text>{route.distance}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.icon}>🖼️</Text>
                    <Text>{route.exhibitCount}件展品</Text>
                  </View>
                  <View className={`${styles.difficultyTag} ${styles[route.difficulty]}`}>
                    {getDifficultyLabel(route.difficulty)}
                  </View>
                </View>
                <View className={styles.tagList}>
                  {route.tags.map((tag, idx) => (
                    <Text key={idx} className={styles.tag}>{tag}</Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default GuidePage;
