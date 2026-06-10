import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { activities, reservations, getActivityTypeLabel, getActivityStatusLabel } from '@/data/activities';
import type { Activity, Reservation } from '@/types/activity';

const ActivityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const tabs = [
    { key: 'all', label: '全部活动' },
    { key: 'reservation', label: '我的预约' }
  ];

  const categories = [
    { key: 'all', label: '全部', icon: '🎯', type: '' },
    { key: 'lecture', label: '讲座', icon: '🎤', type: 'lecture' },
    { key: 'workshop', label: '工坊', icon: '🎨', type: 'workshop' },
    { key: 'tour', label: '导览', icon: '🧭', type: 'tour' },
    { key: 'performance', label: '演出', icon: '🎭', type: 'performance' }
  ];

  const handleTabChange = (key: string) => {
    console.log('[Activity] 切换标签:', key);
    setActiveTab(key);
  };

  const handleCategoryChange = (key: string) => {
    console.log('[Activity] 切换分类:', key);
    setActiveCategory(key);
  };

  const handleActivityClick = (activity: Activity) => {
    console.log('[Activity] 点击活动:', activity.title);
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${activity.id}`
    });
  };

  const handleSignUp = (e: React.MouseEvent, activity: Activity) => {
    e.stopPropagation();
    console.log('[Activity] 报名活动:', activity.title);
    Taro.showModal({
      title: '确认报名',
      content: `确定报名参加「${activity.title}」吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '报名成功', icon: 'success' });
        }
      }
    });
  };

  const handleReschedule = (reservation: Reservation) => {
    console.log('[Activity] 预约改签:', reservation.activityTitle);
    Taro.showToast({ title: '改签功能', icon: 'none' });
  };

  const handleCancel = (reservation: Reservation) => {
    console.log('[Activity] 取消预约:', reservation.activityTitle);
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已取消', icon: 'none' });
        }
      }
    });
  };

  const handleFeedback = (reservation: Reservation) => {
    console.log('[Activity] 满意度反馈:', reservation.activityTitle);
    Taro.showToast({ title: '满意度反馈', icon: 'none' });
  };

  const getStatusClass = (status: Activity['status']) => {
    return status;
  };

  const getReservationStatusClass = (status: Reservation['status']) => {
    return status;
  };

  const getReservationStatusLabel = (status: Reservation['status']) => {
    const map = {
      reserved: '已预约',
      cancelled: '已取消',
      completed: '已完成'
    };
    return map[status];
  };

  const filteredActivities = activities.filter(activity => {
    if (activeCategory === 'all') return true;
    return activity.type === activeCategory;
  });

  const isActivityFull = (activity: Activity) => {
    return activity.signedUp >= activity.capacity;
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => handleTabChange(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      {activeTab === 'all' ? (
        <>
          <View className={styles.categorySection}>
            <ScrollView className={styles.categoryScroll} scrollX>
              {categories.map(cat => (
                <View
                  key={cat.key}
                  className={styles.categoryItem}
                  onClick={() => handleCategoryChange(cat.key)}
                >
                  <View className={`${styles.categoryIcon} ${cat.type}`}>
                    <Text>{cat.icon}</Text>
                  </View>
                  <Text className={styles.categoryLabel}>{cat.label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.accent}>·</Text> 精彩活动
              </Text>
            </View>
            <View className={styles.activityList}>
              {filteredActivities.map(activity => (
                <View
                  key={activity.id}
                  className={styles.activityCard}
                  onClick={() => handleActivityClick(activity)}
                >
                  <View className={styles.activityImage}>
                    <Image src={activity.coverImage} mode="aspectFill" />
                    <View className={`${styles.statusBadge} ${styles[getStatusClass(activity.status)]}`}>
                      {getActivityStatusLabel(activity.status)}
                    </View>
                  </View>
                  <View className={styles.activityInfo}>
                    <View>
                      <Text className={styles.activityTitle}>{activity.title}</Text>
                      <Text className={styles.activitySubtitle}>{activity.subtitle}</Text>
                    </View>
                    <View className={styles.activityMeta}>
                      <View className={styles.metaItem}>
                        <Text className={styles.icon}>📅</Text>
                        <Text>{activity.date} {activity.time}</Text>
                      </View>
                      <View className={styles.metaItem}>
                        <Text className={styles.icon}>📍</Text>
                        <Text>{activity.location}</Text>
                      </View>
                    </View>
                    <View className={styles.activityFooter}>
                      <View className={styles.priceInfo}>
                        {activity.price === 0 ? (
                          <Text className={`${styles.price} ${styles.free}`}>免费</Text>
                        ) : (
                          <>
                            <Text className={styles.price}>¥{activity.price}</Text>
                            <Text className={styles.unit}>元/人</Text>
                          </>
                        )}
                      </View>
                      <View
                        className={`${styles.signUpBtn} ${isActivityFull(activity) ? styles.full : ''}`}
                        onClick={(e) => handleSignUp(e, activity)}
                      >
                        {isActivityFull(activity) ? '已满员' : '立即报名'}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View className={styles.section} style={{ marginTop: 24 }}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.accent}>·</Text> 我的预约
            </Text>
          </View>
          {reservations.length > 0 ? (
            reservations.map(reservation => (
              <View key={reservation.id} className={styles.reservationCard}>
                <View className={styles.reservationHeader}>
                  <Text className={styles.reservationTitle}>{reservation.activityTitle}</Text>
                  <View className={`${styles.reservationStatus} ${styles[getReservationStatusClass(reservation.status)]}`}>
                    {getReservationStatusLabel(reservation.status)}
                  </View>
                </View>
                <View className={styles.reservationInfo}>
                  <View className={styles.infoRow}>
                    <Text className={styles.icon}>📅</Text>
                    <Text>{reservation.date} {reservation.time}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.icon}>🎫</Text>
                    <Text>{reservation.ticketCount} 张票</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.icon}>⏰</Text>
                    <Text>预约时间：{reservation.reservationTime}</Text>
                  </View>
                </View>
                <View className={styles.reservationActions}>
                  {reservation.status === 'reserved' && (
                    <>
                      <View
                        className={`${styles.actionBtn} ${styles.secondary}`}
                        onClick={() => handleCancel(reservation)}
                      >
                        取消预约
                      </View>
                      <View
                        className={`${styles.actionBtn} ${styles.primary}`}
                        onClick={() => handleReschedule(reservation)}
                      >
                        预约改签
                      </View>
                    </>
                  )}
                  {reservation.status === 'completed' && (
                    <View
                      className={`${styles.actionBtn} ${styles.primary}`}
                      onClick={() => handleFeedback(reservation)}
                    >
                      满意度反馈
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>暂无预约记录</Text>
              <View
                className={styles.emptyBtn}
                onClick={() => handleTabChange('all')}
              >
                去看看活动
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default ActivityPage;
