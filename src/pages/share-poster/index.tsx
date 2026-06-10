import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const SharePosterPage: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState(0);

  const templates = [
    { name: '新中式·典雅', gradient: 'linear-gradient(180deg, #F8F5F0 0%, #EFE8DC 50%, #E6D7C0 100%)' },
    { name: '深夜·静谧', gradient: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)' },
    { name: '暖阳·活力', gradient: 'linear-gradient(180deg, #FFECD2 0%, #FCB69F 100%)' },
    { name: '青碧·清新', gradient: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)' }
  ];

  const handleTemplateSelect = (index: number) => {
    console.log('[SharePoster] 选择模板:', templates[index].name);
    setActiveTemplate(index);
  };

  const handleSave = () => {
    console.log('[SharePoster] 保存海报');
    Taro.showLoading({ title: '生成中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: '已保存到相册',
        icon: 'success'
      });
    }, 1500);
  };

  const handleShare = () => {
    console.log('[SharePoster] 分享海报');
    Taro.showShareMenu({
      withShareTicket: true
    });
    Taro.showToast({
      title: '点击右上角分享',
      icon: 'none'
    });
  };

  const handleGenerateNote = () => {
    console.log('[SharePoster] 生成参观日记');
    Taro.showToast({
      title: '生成参观日记',
      icon: 'none'
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.posterPreview}>
        <View className={styles.posterContent} style={{ background: templates[activeTemplate].gradient }}>
          <View className={styles.posterHeader}>
            <Text className={styles.logo}>🏛️</Text>
            <Text className={styles.museumName}>华夏文化馆</Text>
          </View>

          <Text className={styles.posterTitle}>青铜时代的瑰宝</Text>
          <Text className={styles.posterSubtitle}>商周青铜器精品展</Text>

          <View className={styles.posterImage}>
            <Image src="https://picsum.photos/seed/cultural6/600/800" mode="aspectFill" />
          </View>

          <View className={styles.posterInfo}>
            <View className={styles.infoRow}>
              <Text className={styles.label}>展览地点</Text>
              <Text className={styles.value}>一楼 青铜馆</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.label}>展期</Text>
              <Text className={styles.value}>2024.01.01 - 2024.06.30</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.label}>参观时间</Text>
              <Text className={styles.value}>2024.03.15 10:30</Text>
            </View>
          </View>

          <View className={styles.posterFooter}>
            <View className={styles.qrcode}>📱</View>
            <View className={styles.footerText}>
              扫描二维码
              {'\n'}
              开启云游之旅
            </View>
            <View className={styles.stamp}>
              <Text className={styles.stampText}>打卡</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.templateSelector}>
        <Text className={styles.selectorTitle}>
          <Text className={styles.accent}>·</Text>
          选择海报风格
        </Text>
        <View className={styles.templateList}>
          {templates.map((template, index) => (
            <View
              key={index}
              className={`${styles.templateItem} ${activeTemplate === index ? styles.active : ''}`}
              style={{ background: template.gradient }}
              onClick={() => handleTemplateSelect(index)}
            />
          ))}
        </View>
      </View>

      <View className={styles.bottomActions}>
        <View className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleSave}>
          <Text className={styles.icon}>💾</Text>
          <Text>保存</Text>
        </View>
        <View className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleGenerateNote}>
          <Text className={styles.icon}>📝</Text>
          <Text>日记</Text>
        </View>
        <View className={`${styles.actionBtn} ${styles.primary}`} onClick={handleShare}>
          <Text className={styles.icon}>📤</Text>
          <Text>分享</Text>
        </View>
      </View>
    </View>
  );
};

export default SharePosterPage;
