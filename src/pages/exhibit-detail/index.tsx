import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { getExhibitById } from '@/data/exhibitions';
import type { Exhibit } from '@/types/exhibition';

const ExhibitDetailPage: React.FC = () => {
  const router = useRouter();
  const exhibitId = router.params.id || 'e1';
  const exhibit = getExhibitById(exhibitId as string);

  const [activeMode, setActiveMode] = useState('normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [subtitleOn, setSubtitleOn] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const modes = [
    { key: 'normal', icon: '🎧', label: '标准讲解' },
    { key: 'child', icon: '👶', label: '儿童版' },
    { key: 'subtitle', icon: '📝', label: '文字版' }
  ];

  const images = exhibit?.images || [exhibit?.image || ''];

  useEffect(() => {
    if (exhibit) {
      setIsFavorite(exhibit.isFavorite || false);
    }
  }, [exhibit]);

  const handleModeChange = (mode: string) => {
    console.log('[ExhibitDetail] 切换讲解模式:', mode);
    setActiveMode(mode);
  };

  const handlePlayToggle = () => {
    console.log('[ExhibitDetail] 播放/暂停');
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = () => {
    const rates = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
    console.log('[ExhibitDetail] 切换播放速度:', rates[nextIndex]);
  };

  const handleFavorite = () => {
    console.log('[ExhibitDetail] 收藏/取消收藏');
    setIsFavorite(!isFavorite);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '收藏成功',
      icon: 'none'
    });
  };

  const handleShare = () => {
    console.log('[ExhibitDetail] 分享');
    Taro.navigateTo({ url: '/pages/share-poster/index' });
  };

  const handleNote = () => {
    console.log('[ExhibitDetail] 记笔记');
    Taro.showToast({ title: '记笔记功能', icon: 'none' });
  };

  const handleCheckin = () => {
    console.log('[ExhibitDetail] 打卡');
    Taro.navigateTo({ url: '/pages/checkin/index' });
  };

  const handleArView = () => {
    console.log('[ExhibitDetail] AR查看');
    Taro.showToast({ title: 'AR功能即将上线', icon: 'none' });
  };

  const handleImageChange = (e: any) => {
    setCurrentImageIndex(e.detail.current);
  };

  if (!exhibit) {
    return (
      <View className={styles.page}>
        <Text>展品不存在</Text>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.imageGallery}>
          <View className={styles.mainImage}>
            <Image src={exhibit.image} mode="aspectFill" />
          </View>
          <View className={styles.imageCounter}>
            {currentImageIndex + 1} / {images.length}
          </View>
          {exhibit.arEnabled && (
            <View className={styles.arBadge} onClick={handleArView}>
              <Text className={styles.icon}>📱</Text>
              <Text>AR查看</Text>
            </View>
          )}
        </View>

        <View className={styles.exhibitInfo}>
          <Text className={styles.exhibitName}>{exhibit.name}</Text>
          <Text className={styles.exhibitSubtitle}>{exhibit.subtitle}</Text>
          <View className={styles.metaGrid}>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>⏰</Text>
              <Text className={styles.label}>年代：</Text>
              <Text className={styles.value}>{exhibit.era}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📋</Text>
              <Text className={styles.label}>类别：</Text>
              <Text className={styles.value}>{exhibit.category}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📍</Text>
              <Text className={styles.label}>位置：</Text>
              <Text className={styles.value}>{exhibit.location}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>🎧</Text>
              <Text className={styles.label}>时长：</Text>
              <Text className={styles.value}>{exhibit.audioDuration}</Text>
            </View>
          </View>
        </View>

        <View className={styles.modeTabs}>
          {modes.map(mode => (
            <View
              key={mode.key}
              className={`${styles.tabItem} ${activeMode === mode.key ? styles.active : ''}`}
              onClick={() => handleModeChange(mode.key)}
            >
              <Text className={styles.tabIcon}>{mode.icon}</Text>
              <Text className={styles.tabLabel}>{mode.label}</Text>
            </View>
          ))}
        </View>

        {activeMode !== 'subtitle' && (
          <View className={styles.audioPlayer}>
            <View className={styles.progressBar}>
              <View className={styles.progressFill} />
              <View className={styles.progressDot} />
            </View>
            <View className={styles.timeRow}>
              <Text>1:23</Text>
              <Text>{exhibit.audioDuration}</Text>
            </View>
            <View className={styles.controls}>
              <View className={styles.controlBtn}>
                <Text>⏮️</Text>
              </View>
              <View className={styles.playBtn} onClick={handlePlayToggle}>
                <Text>{isPlaying ? '⏸️' : '▶️'}</Text>
              </View>
              <View className={styles.controlBtn}>
                <Text>⏭️</Text>
              </View>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
              <View className={styles.speedBtn} onClick={handleSpeedChange}>
                {playbackRate}x 倍速
              </View>
            </View>
          </View>
        )}

        {activeMode === 'child' && (
          <View className={styles.childVersion}>
            <View className={styles.childHeader}>
              <Text className={styles.childIcon}>👶</Text>
              <Text className={styles.childTitle}>小朋友版讲解</Text>
            </View>
            <Text className={styles.childContent}>
              嗨，小朋友！这个宝贝叫做{exhibit.name}，它来自{exhibit.era}，距今已经有好多好多年啦！
              {'\n\n'}
              你知道吗？古代的工匠叔叔们用他们灵巧的双手，一点一点地做出了这个精美的宝贝。它不仅好看，还藏着好多有趣的故事呢！
              {'\n\n'}
              想不想知道更多？让爸爸妈妈给你讲讲吧～
            </Text>
          </View>
        )}

        {(activeMode === 'normal' || activeMode === 'subtitle') && (
          <View className={styles.descriptionSection}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.accent}>·</Text>
              展品介绍
            </Text>
            <Text className={styles.descriptionText}>{exhibit.description}</Text>
            <View className={styles.subtitleToggle}>
              <Text className={styles.toggleLabel}>字幕显示</Text>
              <View
                className={`${styles.switch} ${subtitleOn ? styles.active : ''}`}
                onClick={() => setSubtitleOn(!subtitleOn)}
              >
                <View className={styles.switchDot} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View className={styles.bottomBar}>
        <View
          className={`${styles.actionItem} ${isFavorite ? styles.active : ''}`}
          onClick={handleFavorite}
        >
          <Text className={styles.icon}>{isFavorite ? '❤️' : '🤍'}</Text>
          <Text className={styles.label}>{isFavorite ? '已收藏' : '收藏'}</Text>
        </View>
        <View className={styles.actionItem} onClick={handleNote}>
          <Text className={styles.icon}>📝</Text>
          <Text className={styles.label}>记笔记</Text>
        </View>
        <View className={styles.actionItem} onClick={handleShare}>
          <Text className={styles.icon}>📤</Text>
          <Text className={styles.label}>分享</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleCheckin}>
          <Text className={styles.icon}>📍</Text>
          <Text>打卡盖章</Text>
        </View>
      </View>
    </View>
  );
};

export default ExhibitDetailPage;
