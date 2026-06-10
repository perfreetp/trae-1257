import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { getExhibitById } from '@/data/exhibitions';
import { useAppStore } from '@/store/appStore';
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
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [showArOverlay, setShowArOverlay] = useState(false);

  const addNote = useAppStore(state => state.addNote);
  const addTimelineRecord = useAppStore(state => state.addTimelineRecord);
  const visitRecords = useAppStore(state => state.visitRecords);
  const markExhibitViewed = useAppStore(state => state.markExhibitViewed);

  const getNowTimeStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

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

  useDidShow(() => {
    if (!exhibit) return;
    const activeVisit = visitRecords.find(r => r.status === 'in_progress');
    if (activeVisit) {
      const currentStop = activeVisit.startStops[activeVisit.currentStopIndex];
      if (currentStop?.exhibitId === exhibit.id && !activeVisit.viewedExhibits.includes(exhibit.id)) {
        markExhibitViewed(activeVisit.id, exhibit.id);
      }
    }
    const hasViewed = visitRecords.some(r =>
      r.viewedExhibits.includes(exhibit.id)
    );
    if (!hasViewed) {
      const timeStr = getNowTimeStr();
      addTimelineRecord({
        id: `tl_${Date.now()}`,
        type: 'scan_exhibit',
        title: '查看展品详情',
        description: `查看「${exhibit.name}」的展品讲解`,
        itemId: exhibit.id,
        itemType: 'exhibit',
        timestamp: timeStr,
        icon: '🔍'
      });
    }
  });

  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = () => {
    const rates = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '收藏成功',
      icon: 'none'
    });
  };

  const handleShare = () => {
    Taro.navigateTo({ url: '/pages/share-poster/index' });
  };

  const handleNote = () => {
    setNoteTitle('');
    setNoteContent('');
    setShowNoteInput(true);
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      Taro.showToast({ title: '请输入标题和内容', icon: 'none' });
      return;
    }
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    addNote({
      id: `n_${Date.now()}`,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      exhibitId: exhibit?.id,
      exhibitName: exhibit?.name,
      createTime: timeStr
    });
    setShowNoteInput(false);
    Taro.showToast({ title: '笔记已保存', icon: 'success' });
  };

  const handleCheckin = () => {
    Taro.navigateTo({ url: '/pages/checkin/index' });
  };

  const handleArView = () => {
    if (!exhibit) return;
    setShowArOverlay(true);
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    addTimelineRecord({
      id: `tl_${Date.now()}`,
      type: 'scan_exhibit',
      title: 'AR查看展品',
      description: `通过AR模式查看「${exhibit.name}」`,
      itemId: exhibit.id,
      itemType: 'exhibit',
      timestamp: timeStr,
      icon: '📱'
    });
  };

  const handleCloseAr = () => {
    setShowArOverlay(false);
  };

  const handleGoToExhibitFromAr = () => {
    setShowArOverlay(false);
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
      {showArOverlay && (
        <View className={styles.arOverlay}>
          <View className={styles.arCamera}>
            <Image src={exhibit.image} mode="aspectFill" className={styles.arBgImage} />
            <View className={styles.arScanFrame}>
              <View className={`${styles.arCorner} ${styles.arTopLeft}`} />
              <View className={`${styles.arCorner} ${styles.arTopRight}`} />
              <View className={`${styles.arCorner} ${styles.arBottomLeft}`} />
              <View className={`${styles.arCorner} ${styles.arBottomRight}`} />
            </View>
            <View className={styles.arInfoCard}>
              <View className={styles.arInfoHeader}>
                <Text className={styles.arDetectIcon}>✨</Text>
                <Text className={styles.arDetectLabel}>AR 识别结果</Text>
              </View>
              <Text className={styles.arExhibitName}>{exhibit.name}</Text>
              <Text className={styles.arExhibitSubtitle}>{exhibit.subtitle}</Text>
              <View className={styles.arInfoGrid}>
                <View className={styles.arInfoItem}>
                  <Text className={styles.arInfoIcon}>⏰</Text>
                  <Text className={styles.arInfoLabel}>年代</Text>
                  <Text className={styles.arInfoValue}>{exhibit.era}</Text>
                </View>
                <View className={styles.arInfoItem}>
                  <Text className={styles.arInfoIcon}>📋</Text>
                  <Text className={styles.arInfoLabel}>类别</Text>
                  <Text className={styles.arInfoValue}>{exhibit.category}</Text>
                </View>
                <View className={styles.arInfoItem}>
                  <Text className={styles.arInfoIcon}>📍</Text>
                  <Text className={styles.arInfoLabel}>位置</Text>
                  <Text className={styles.arInfoValue}>{exhibit.location}</Text>
                </View>
                <View className={styles.arInfoItem}>
                  <Text className={styles.arInfoIcon}>🎧</Text>
                  <Text className={styles.arInfoLabel}>讲解</Text>
                  <Text className={styles.arInfoValue}>{exhibit.audioDuration}</Text>
                </View>
              </View>
            </View>
            <View className={styles.arCloseBtn} onClick={handleCloseAr}>
              <Text>✕</Text>
            </View>
          </View>
        </View>
      )}

      {showNoteInput && (
        <View className={styles.noteOverlay}>
          <View className={styles.noteModal}>
            <Text className={styles.noteModalTitle}>记笔记</Text>
            <Text className={styles.noteExhibitName}>📍 {exhibit.name}</Text>
            <Input
              className={styles.noteTitleInput}
              placeholder="输入笔记标题"
              value={noteTitle}
              onInput={(e) => setNoteTitle(e.detail.value)}
            />
            <Textarea
              className={styles.noteContentInput}
              placeholder="记录你对这件展品的感受和想法..."
              value={noteContent}
              onInput={(e) => setNoteContent(e.detail.value)}
              maxlength={1000}
            />
            <View className={styles.noteActions}>
              <View className={styles.noteCancelBtn} onClick={() => setShowNoteInput(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.noteSaveBtn} onClick={handleSaveNote}>
                <Text>保存笔记</Text>
              </View>
            </View>
          </View>
        </View>
      )}

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
