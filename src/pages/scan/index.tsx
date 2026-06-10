import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { exhibits, getExhibitById } from '@/data/exhibitions';
import { useAppStore } from '@/store/appStore';

const getNowTimeStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const ScanPage: React.FC = () => {
  const [isLightOn, setIsLightOn] = useState(false);
  const [showArOverlay, setShowArOverlay] = useState(false);
  const [arExhibit, setArExhibit] = useState(exhibits[0]);
  const addTimelineRecord = useAppStore(state => state.addTimelineRecord);

  const scanHistory = [
    { id: 'h1', exhibitId: 'e1', name: '敦煌飞天壁画', desc: '唐代·莫高窟第320窟', time: '今天 14:30' },
    { id: 'h2', exhibitId: 'e3', name: '司母戊鼎', desc: '商代晚期', time: '今天 11:20' },
    { id: 'h3', exhibitId: 'e5', name: '汝窑天青釉盘', desc: '北宋·汝官窑', time: '昨天 15:45' }
  ];

  const addScanTimeline = (exhibit: typeof exhibits[0]) => {
    addTimelineRecord({
      id: `tl_${Date.now()}`,
      type: 'scan_exhibit',
      title: '扫码查看展品',
      description: `通过AR识别查看「${exhibit.name}」`,
      itemId: exhibit.id,
      itemType: 'exhibit',
      timestamp: getNowTimeStr(),
      icon: '📷'
    });
  };

  const handleScanCode = () => {
    const mockExhibit = exhibits[Math.floor(Math.random() * exhibits.length)];
    setArExhibit(mockExhibit);
    setShowArOverlay(true);
    addScanTimeline(mockExhibit);
  };

  const handleArScan = () => {
    const mockExhibit = exhibits.find(e => e.arEnabled) || exhibits[0];
    setArExhibit(mockExhibit);
    setShowArOverlay(true);
    addScanTimeline(mockExhibit);
  };

  const handleCloseAr = () => {
    setShowArOverlay(false);
  };

  const handleGoToExhibit = (exhibitId: string) => {
    setShowArOverlay(false);
    Taro.navigateTo({
      url: `/pages/exhibit-detail/index?id=${exhibitId}`
    });
  };

  const handleAlbum = () => {
    Taro.showToast({ title: '从相册选择', icon: 'none' });
  };

  const handleLight = () => {
    setIsLightOn(!isLightOn);
    Taro.showToast({ title: isLightOn ? '闪光灯已关闭' : '闪光灯已开启', icon: 'none' });
  };

  const handleHistoryClick = (item: typeof scanHistory[0]) => {
    Taro.navigateTo({
      url: `/pages/exhibit-detail/index?id=${item.exhibitId}`
    });
  };

  const handleMoreClick = () => {
    Taro.showToast({ title: '更多记录', icon: 'none' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      {showArOverlay && (
        <View className={styles.arOverlay}>
          <View className={styles.arCamera}>
            <Image src={arExhibit.image} mode="aspectFill" className={styles.arBgImage} />
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
              <Text className={styles.arExhibitName}>{arExhibit.name}</Text>
              <Text className={styles.arExhibitSubtitle}>{arExhibit.subtitle}</Text>
              <View className={styles.arInfoGrid}>
                <View className={styles.arInfoItem}>
                  <Text className={styles.arInfoIcon}>⏰</Text>
                  <Text className={styles.arInfoLabel}>年代</Text>
                  <Text className={styles.arInfoValue}>{arExhibit.era}</Text>
                </View>
                <View className={styles.arInfoItem}>
                  <Text className={styles.arInfoIcon}>📋</Text>
                  <Text className={styles.arInfoLabel}>类别</Text>
                  <Text className={styles.arInfoValue}>{arExhibit.category}</Text>
                </View>
                <View className={styles.arInfoItem}>
                  <Text className={styles.arInfoIcon}>📍</Text>
                  <Text className={styles.arInfoLabel}>位置</Text>
                  <Text className={styles.arInfoValue}>{arExhibit.location}</Text>
                </View>
                <View className={styles.arInfoItem}>
                  <Text className={styles.arInfoIcon}>🎧</Text>
                  <Text className={styles.arInfoLabel}>讲解</Text>
                  <Text className={styles.arInfoValue}>{arExhibit.audioDuration}</Text>
                </View>
              </View>
              <View className={styles.arActions}>
                <View className={styles.arListenBtn} onClick={() => handleGoToExhibit(arExhibit.id)}>
                  <Text>🎧 收听讲解</Text>
                </View>
                <View className={styles.arDetailBtn} onClick={() => handleGoToExhibit(arExhibit.id)}>
                  <Text>📖 查看详情</Text>
                </View>
              </View>
            </View>
            <View className={styles.arCloseBtn} onClick={handleCloseAr}>
              <Text>✕</Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.scanArea} onClick={handleScanCode}>
        <View className={styles.scanFrame}>
          <View className={`${styles.corner} ${styles.topLeft}`} />
          <View className={`${styles.corner} ${styles.topRight}`} />
          <View className={`${styles.corner} ${styles.bottomLeft}`} />
          <View className={`${styles.corner} ${styles.bottomRight}`} />
          <View className={styles.scanLine} />
        </View>
        <Text className={styles.scanTip}>将展品二维码放入框内，自动识别</Text>
      </View>

      <View className={styles.scanActions}>
        <View className={styles.actionItem} onClick={handleArScan}>
          <View className={`${styles.actionIcon} ${styles.iconAr}`}>
            <Text>📱</Text>
          </View>
          <Text className={styles.actionLabel}>AR识别</Text>
        </View>
        <View className={styles.actionItem} onClick={handleAlbum}>
          <View className={`${styles.actionIcon} ${styles.iconAlbum}`}>
            <Text>🖼️</Text>
          </View>
          <Text className={styles.actionLabel}>相册</Text>
        </View>
        <View className={styles.actionItem} onClick={handleLight}>
          <View className={`${styles.actionIcon} ${styles.iconLight}`}>
            <Text>{isLightOn ? '💡' : '🔦'}</Text>
          </View>
          <Text className={styles.actionLabel}>闪光灯</Text>
        </View>
      </View>

      <View className={styles.arBanner}>
        <View className={styles.arContent}>
          <Text className={styles.arTitle}>AR 增强现实导览</Text>
          <Text className={styles.arDesc}>
            打开摄像头对准展品，{'\n'}
            文物信息、历史背景立体呈现
          </Text>
          <View className={styles.arButton} onClick={handleArScan}>
            <Text className={styles.btnIcon}>✨</Text>
            <Text>立即体验</Text>
          </View>
        </View>
        <Text className={styles.arDecoration}>📱</Text>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text> 扫码历史
          </Text>
          <View className={styles.sectionMore} onClick={handleMoreClick}>
            <Text>全部</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>
        <View className={styles.historyList}>
          {scanHistory.map(item => {
            const exhibit = exhibits.find(e => e.id === item.exhibitId);
            return (
              <View
                key={item.id}
                className={styles.historyItem}
                onClick={() => handleHistoryClick(item)}
              >
                <View className={styles.historyImage}>
                  <Image src={exhibit?.image || ''} mode="aspectFill" />
                </View>
                <View className={styles.historyInfo}>
                  <Text className={styles.historyName}>{item.name}</Text>
                  <Text className={styles.historyDesc}>{item.desc}</Text>
                </View>
                <Text className={styles.historyTime}>{item.time}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.tipList}>
          <Text className={styles.tipTitle}>扫码小贴士</Text>
          <View className={styles.tipItem}>
            <Text className={styles.tipIndex}>1</Text>
            <Text className={styles.tipText}>展品旁的二维码牌，使用扫一扫即可获取详细信息</Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIndex}>2</Text>
            <Text className={styles.tipText}>支持语音讲解、文字字幕、儿童版三种讲解模式</Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIndex}>3</Text>
            <Text className={styles.tipText}>部分展品支持AR功能，可查看3D模型和细节放大</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ScanPage;
