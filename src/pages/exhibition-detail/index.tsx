import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { getExhibitionById, exhibits } from '@/data/exhibitions';
import type { Exhibition } from '@/types/exhibition';

const ExhibitionDetailPage: React.FC = () => {
  const router = useRouter();
  const exhibitionId = router.params.id || '1';
  const exhibition = getExhibitionById(exhibitionId as string);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (exhibition) {
      setIsFavorite(exhibition.isHot || false);
    }
  }, [exhibition]);

  const handleExhibitClick = (exhibitId: string) => {
    console.log('[ExhibitionDetail] 点击展品:', exhibitId);
    Taro.navigateTo({
      url: `/pages/exhibit-detail/index?id=${exhibitId}`
    });
  };

  const handleFavorite = () => {
    console.log('[ExhibitionDetail] 收藏/取消收藏');
    setIsFavorite(!isFavorite);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '收藏成功',
      icon: 'none'
    });
  };

  const handleShare = () => {
    console.log('[ExhibitionDetail] 分享');
    Taro.navigateTo({ url: '/pages/share-poster/index' });
  };

  const handleStartGuide = () => {
    console.log('[ExhibitionDetail] 开始导览');
    Taro.showToast({ title: '开始导览', icon: 'none' });
  };

  if (!exhibition) {
    return (
      <View className={styles.page}>
        <Text>展览不存在</Text>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.coverImage}>
          <Image src={exhibition.coverImage} mode="aspectFill" />
        </View>

        <View className={styles.exhibitionInfo}>
          <Text className={styles.title}>{exhibition.title}</Text>
          <Text className={styles.subtitle}>{exhibition.subtitle}</Text>
          <View className={styles.metaRow}>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📅</Text>
              <Text>{exhibition.startDate} - {exhibition.endDate}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📍</Text>
              <Text>{exhibition.location}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>🏛️</Text>
              <Text>{exhibition.floor}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>🖼️</Text>
              <Text>{exhibition.exhibitCount}件展品</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text>
            展览介绍
          </Text>
          <Text className={styles.description}>{exhibition.description}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text>
            展品列表
          </Text>
          <View className={styles.exhibitList}>
            {exhibits.slice(0, 5).map(exhibit => (
              <View
                key={exhibit.id}
                className={styles.exhibitItem}
                onClick={() => handleExhibitClick(exhibit.id)}
              >
                <View className={styles.exhibitImage}>
                  <Image src={exhibit.image} mode="aspectFill" />
                </View>
                <View className={styles.exhibitInfo}>
                  <Text className={styles.name}>{exhibit.name}</Text>
                  <Text className={styles.desc}>{exhibit.era} · {exhibit.category}</Text>
                </View>
                <Text className={styles.exhibitArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.actionItem} onClick={handleFavorite}>
          <Text className={styles.icon}>{isFavorite ? '❤️' : '🤍'}</Text>
          <Text className={styles.label}>收藏</Text>
        </View>
        <View className={styles.actionItem} onClick={handleShare}>
          <Text className={styles.icon}>📤</Text>
          <Text className={styles.label}>分享</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleStartGuide}>
          <Text className={styles.icon}>🗺️</Text>
          <Text>开始导览</Text>
        </View>
      </View>
    </View>
  );
};

export default ExhibitionDetailPage;
