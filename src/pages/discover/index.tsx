import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { exhibitions, exhibits } from '@/data/exhibitions';
import type { Exhibition } from '@/types/exhibition';

const DiscoverPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const quickEntries = [
    { key: 'cloud', icon: '☁️', label: '云游展厅', type: 'iconCloud' },
    { key: 'child', icon: '👶', label: '儿童模式', type: 'iconChild' },
    { key: 'ar', icon: '📱', label: 'AR导览', type: 'iconAr' },
    { key: 'checkin', icon: '📍', label: '打卡盖章', type: 'iconCheckin' },
    { key: 'route', icon: '🗺️', label: '路线推荐', type: 'iconRoute' },
    { key: 'activity', icon: '🎉', label: '活动预约', type: 'iconActivity' }
  ];

  const cloudThemes = [
    {
      id: 'ct1',
      name: '丝路云游',
      desc: '敦煌艺术在线体验',
      image: 'https://picsum.photos/id/1061/560/400'
    },
    {
      id: 'ct2',
      name: '瓷韵千年',
      desc: '瓷器精品3D鉴赏',
      image: 'https://picsum.photos/id/1082/560/400'
    },
    {
      id: 'ct3',
      name: '书画天地',
      desc: '名家书画高清欣赏',
      image: 'https://picsum.photos/id/1073/560/400'
    },
    {
      id: 'ct4',
      name: '青铜文明',
      desc: '青铜器全景漫游',
      image: 'https://picsum.photos/id/1025/560/400'
    }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  const handleEntryClick = (key: string) => {
    console.log('[Discover] 点击快捷入口:', key);
    switch (key) {
      case 'cloud':
        Taro.showToast({ title: '云游展厅', icon: 'none' });
        break;
      case 'child':
        Taro.showToast({ title: '儿童模式', icon: 'none' });
        break;
      case 'ar':
        Taro.switchTab({ url: '/pages/scan/index' });
        break;
      case 'checkin':
        Taro.navigateTo({ url: '/pages/checkin/index' });
        break;
      case 'route':
        Taro.switchTab({ url: '/pages/guide/index' });
        break;
      case 'activity':
        Taro.switchTab({ url: '/pages/activity/index' });
        break;
    }
  };

  const handleExhibitionClick = (exhibition: Exhibition) => {
    console.log('[Discover] 点击展览:', exhibition.title);
    Taro.navigateTo({
      url: `/pages/exhibition-detail/index?id=${exhibition.id}`
    });
  };

  const handleSearch = () => {
    console.log('[Discover] 点击搜索');
    Taro.showToast({ title: '搜索功能', icon: 'none' });
  };

  const handleMoreClick = () => {
    console.log('[Discover] 查看更多');
    Taro.showToast({ title: '更多展览', icon: 'none' });
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handleRefresh}
    >
      <View className={styles.header}>
        <View className={styles.welcome}>您好，文博爱好者</View>
        <View className={styles.subTitle}>探索文明瑰宝，感受文化魅力</View>
        <View className={styles.searchBar} onClick={handleSearch}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchText}>搜索展览、展品、活动</Text>
        </View>
      </View>

      <View className={styles.quickEntry}>
        <View className={styles.entryGrid}>
          {quickEntries.map(item => (
            <View
              key={item.key}
              className={styles.entryItem}
              onClick={() => handleEntryClick(item.key)}
            >
              <View className={`${styles.entryIcon} ${styles[item.type]}`}>
                <Text>{item.icon}</Text>
              </View>
              <Text className={styles.entryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text> 主题云游
          </Text>
          <View className={styles.sectionMore} onClick={handleMoreClick}>
            <Text>全部</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>
        <ScrollView className={styles.cloudList} scrollX>
          {cloudThemes.map(theme => (
            <View key={theme.id} className={styles.cloudCard}>
              <View className={styles.cloudImage}>
                <Image src={theme.image} mode="aspectFill" />
              </View>
              <View className={styles.cloudInfo}>
                <Text className={styles.cloudName}>{theme.name}</Text>
                <Text className={styles.cloudDesc}>{theme.desc}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text> 热门展览
          </Text>
          <View className={styles.sectionMore} onClick={handleMoreClick}>
            <Text>更多</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>
        <View className={styles.exhibitionList}>
          {exhibitions.slice(0, 4).map(exhibition => (
            <View
              key={exhibition.id}
              className={styles.exhibitionCard}
              onClick={() => handleExhibitionClick(exhibition)}
            >
              <View className={styles.exhibitionImage}>
                <Image src={exhibition.coverImage} mode="aspectFill" />
              </View>
              <View className={styles.exhibitionInfo}>
                <View>
                  <Text className={styles.exhibitionTitle}>{exhibition.title}</Text>
                  <Text className={styles.exhibitionSubtitle}>{exhibition.subtitle}</Text>
                </View>
                <View className={styles.exhibitionMeta}>
                  {exhibition.isHot && <Text className={`${styles.tag} ${styles.tagHot}`}>热门</Text>}
                  {exhibition.isNew && <Text className={`${styles.tag} ${styles.tagNew}`}>新展</Text>}
                  <Text className={styles.metaItem}>
                    <Text className={styles.icon}>📍</Text>
                    {exhibition.location}
                  </Text>
                  <Text className={styles.metaItem}>
                    <Text className={styles.icon}>🖼️</Text>
                    {exhibition.exhibitCount}件展品
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DiscoverPage;
