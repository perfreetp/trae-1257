import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { userInfo, checkInRecords, favoriteItems } from '@/data/user';
import { useAppStore } from '@/store/appStore';
import type { VisitNote, TimelineRecord } from '@/types/user';

const MinePage: React.FC = () => {
  const notes = useAppStore(state => state.notes);
  const timeline = useAppStore(state => state.timeline);
  const visitRecords = useAppStore(state => state.visitRecords);

  const [activeTab, setActiveTab] = useState<'notes' | 'timeline'>('timeline');

  const menuItems = [
    { key: 'checkin', icon: '📍', label: '打卡盖章', type: 'iconCheckin' },
    { key: 'note', icon: '📝', label: '参观笔记', type: 'iconNote' },
    { key: 'favorite', icon: '⭐', label: '我的收藏', type: 'iconFavorite' },
    { key: 'share', icon: '📤', label: '分享海报', type: 'iconShare' },
    { key: 'feedback', icon: '💬', label: '满意度反馈', type: 'iconFeedback' },
    { key: 'setting', icon: '⚙️', label: '设置', type: 'iconSetting' }
  ];

  const stampList = [
    ...checkInRecords.slice(0, 4).map(item => ({
      ...item,
      collected: true
    })),
    ...Array(4).fill(null).map((_, i) => ({
      id: `locked-${i}`,
      locationName: `未解锁${i + 1}`,
      stampImage: '',
      collected: false
    }))
  ];

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'checkin':
        Taro.navigateTo({ url: '/pages/checkin/index' });
        break;
      case 'note':
        setActiveTab('notes');
        break;
      case 'favorite':
        Taro.showToast({ title: '我的收藏', icon: 'none' });
        break;
      case 'share':
        Taro.navigateTo({ url: '/pages/share-poster/index' });
        break;
      case 'feedback':
        Taro.switchTab({ url: '/pages/activity/index' });
        break;
      case 'setting':
        Taro.showToast({ title: '设置', icon: 'none' });
        break;
    }
  };

  const handleStampClick = (stamp: any) => {
    if (stamp.collected) {
      Taro.showToast({ title: stamp.locationName, icon: 'none' });
    } else {
      Taro.showToast({ title: '前往打卡解锁', icon: 'none' });
    }
  };

  const handleNoteClick = (note: VisitNote) => {
    Taro.showToast({ title: note.title, icon: 'none' });
  };

  const handleTimelineClick = (record: TimelineRecord) => {
    switch (record.itemType) {
      case 'exhibit':
        Taro.navigateTo({ url: `/pages/exhibit-detail/index?id=${record.itemId}` });
        break;
      case 'route':
        Taro.navigateTo({ url: `/pages/route-detail/index?id=${record.itemId}` });
        break;
      case 'activity':
        Taro.navigateTo({ url: `/pages/activity-detail/index?id=${record.itemId}` });
        break;
    }
  };

  const handleMoreStamp = () => {
    Taro.navigateTo({ url: '/pages/checkin/index' });
  };

  const handleMoreNote = () => {
    setActiveTab('notes');
  };

  const handleMoreTimeline = () => {
    setActiveTab('timeline');
  };

  const getTimelineItemClass = (type: TimelineRecord['type']) => {
    const map: Record<string, string> = {
      route_complete: styles.typeRoute,
      scan_exhibit: styles.typeScan,
      activity_signup: styles.typeSignup,
      activity_feedback: styles.typeFeedback,
      note_create: styles.typeNote,
      activity_cancel: styles.typeCancel,
      activity_reschedule: styles.typeReschedule
    };
    return map[type] || '';
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.profileHeader}>
        <View className={styles.profileTop}>
          <View className={styles.avatar}>
            <Image src={userInfo.avatar} mode="aspectFill" />
          </View>
          <View className={styles.userInfo}>
            <Text className={styles.nickname}>{userInfo.nickname}</Text>
            <View className={styles.levelInfo}>
              <Text className={styles.levelBadge}>Lv.{userInfo.level}</Text>
              <Text className={styles.points}>{userInfo.points} 积分</Text>
            </View>
          </View>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{userInfo.visitCount}</Text>
            <Text className={styles.statLabel}>参观次数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{userInfo.checkinCount}</Text>
            <Text className={styles.statLabel}>打卡印章</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{userInfo.favoriteCount}</Text>
            <Text className={styles.statLabel}>收藏藏品</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{notes.length}</Text>
            <Text className={styles.statLabel}>参观笔记</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.menuTitle}>常用功能</Text>
        <View className={styles.menuList}>
          {menuItems.map(item => (
            <View
              key={item.key}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.key)}
            >
              <View className={`${styles.menuIcon} ${styles[item.type]}`}>
                <Text>{item.icon}</Text>
              </View>
              <Text className={styles.menuText}>{item.label}</Text>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.stampSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text> 我的印章
          </Text>
          <View className={styles.sectionMore} onClick={handleMoreStamp}>
            <Text>全部</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>
        <View className={styles.stampGrid}>
          {stampList.map(stamp => (
            <View
              key={stamp.id}
              className={`${styles.stampItem} ${stamp.collected ? styles.collected : styles.locked}`}
              onClick={() => handleStampClick(stamp)}
            >
              <View className={`${styles.stampImage} ${!stamp.collected ? styles.locked : ''}`}>
                {stamp.collected ? (
                  <Image src={stamp.stampImage || ''} mode="aspectFill" />
                ) : (
                  <Text>🔒</Text>
                )}
              </View>
              <Text className={styles.stampName}>{stamp.locationName}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.recordSection}>
        <View className={styles.tabHeader}>
          <View
            className={`${styles.tabItem} ${activeTab === 'timeline' ? styles.active : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Text>参观记录</Text>
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'notes' ? styles.active : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <Text>参观笔记</Text>
          </View>
        </View>

        {activeTab === 'timeline' && (
          <View className={styles.timelineList}>
            {timeline.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📋</Text>
                <Text className={styles.emptyText}>暂无参观记录</Text>
                <Text className={styles.emptyHint}>参观展品、报名活动都会在这里留下记录</Text>
              </View>
            ) : (
              timeline.map(record => (
                <View
                  key={record.id}
                  className={styles.timelineItem}
                  onClick={() => handleTimelineClick(record)}
                >
                  <View className={`${styles.timelineIcon} ${getTimelineItemClass(record.type)}`}>
                    <Text>{record.icon}</Text>
                  </View>
                  <View className={styles.timelineContent}>
                    <View className={styles.timelineHeader}>
                      <Text className={styles.timelineTitle}>{record.title}</Text>
                      <Text className={styles.timelineTime}>{record.timestamp}</Text>
                    </View>
                    <Text className={styles.timelineDesc}>{record.description}</Text>
                  </View>
                  <Text className={styles.timelineArrow}>›</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'notes' && (
          <View className={styles.notesList}>
            {notes.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📝</Text>
                <Text className={styles.emptyText}>暂无笔记</Text>
                <Text className={styles.emptyHint}>在展品详情页可以记录你的参观感受</Text>
              </View>
            ) : (
              notes.map(note => (
                <View
                  key={note.id}
                  className={styles.noteCard}
                  onClick={() => handleNoteClick(note)}
                >
                  <View className={styles.noteHeader}>
                    <Text className={styles.noteTitle}>{note.title}</Text>
                    <Text className={styles.noteTime}>{note.createTime}</Text>
                  </View>
                  <Text className={styles.noteContent}>{note.content}</Text>
                  {note.exhibitName && (
                    <Text className={styles.noteTag}>📍 {note.exhibitName}</Text>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </View>

      <View style={{ height: '40rpx' }} />
    </ScrollView>
  );
};

export default MinePage;
