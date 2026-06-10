import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { activities, getActivityTypeLabel, getActivityStatusLabel } from '@/data/activities';
import { useAppStore } from '@/store/appStore';
import type { Activity, Reservation } from '@/types/activity';

const ActivityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  const reservations = useAppStore(state => state.reservations);
  const addReservation = useAppStore(state => state.addReservation);
  const cancelReservation = useAppStore(state => state.cancelReservation);
  const rescheduleReservation = useAppStore(state => state.rescheduleReservation);
  const submitFeedback = useAppStore(state => state.submitFeedback);

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
    setActiveTab(key);
  };

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
  };

  const handleActivityClick = (activity: Activity) => {
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${activity.id}`
    });
  };

  const handleSignUp = (e: React.MouseEvent, activity: Activity) => {
    e.stopPropagation();
    if (activity.signedUp >= activity.capacity) {
      Taro.showToast({ title: '活动已报满', icon: 'none' });
      return;
    }
    const alreadyReserved = reservations.some(r => r.activityId === activity.id && r.status === 'reserved');
    if (alreadyReserved) {
      Taro.showToast({ title: '您已报名此活动', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认报名',
      content: `确定报名参加「${activity.title}」吗？${activity.price === 0 ? '本活动免费' : `费用：¥${activity.price}/人`}`,
      success: (res) => {
        if (res.confirm) {
          const now = new Date();
          const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          addReservation({
            id: `r_${Date.now()}`,
            activityId: activity.id,
            activityTitle: activity.title,
            date: activity.date,
            time: activity.time,
            status: 'reserved',
            ticketCount: 1,
            reservationTime: timeStr
          });
          Taro.showToast({ title: '报名成功', icon: 'success' });
        }
      }
    });
  };

  const handleCancel = (reservation: Reservation) => {
    Taro.showModal({
      title: '确认取消',
      content: `确定要取消「${reservation.activityTitle}」的预约吗？`,
      success: (res) => {
        if (res.confirm) {
          cancelReservation(reservation.id);
          Taro.showToast({ title: '已取消预约', icon: 'success' });
        }
      }
    });
  };

  const handleReschedule = (reservation: Reservation) => {
    const activity = activities.find(a => a.id === reservation.activityId);
    const availableDates = ['2026-07-05', '2026-07-12', '2026-07-19'];
    Taro.showActionSheet({
      itemList: availableDates.map(d => `${d} ${reservation.time}`),
      success: (res) => {
        rescheduleReservation(reservation.id, availableDates[res.tapIndex], reservation.time);
        Taro.showToast({ title: '改签成功', icon: 'success' });
      }
    });
  };

  const handleFeedback = (reservation: Reservation) => {
    setFeedbackId(reservation.id);
    setFeedbackRating(5);
    setFeedbackComment('');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackId) return;
    if (!feedbackComment.trim()) {
      Taro.showToast({ title: '请输入反馈内容', icon: 'none' });
      return;
    }
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    submitFeedback(feedbackId, {
      rating: feedbackRating,
      comment: feedbackComment,
      submitTime: timeStr
    });
    setFeedbackId(null);
    Taro.showToast({ title: '感谢您的反馈', icon: 'success' });
  };

  const getStatusClass = (status: Activity['status']) => status;

  const getReservationStatusLabel = (status: Reservation['status'], hasFeedback?: boolean) => {
    if (status === 'completed' && hasFeedback) return '已反馈';
    const map = { reserved: '已预约', cancelled: '已取消', completed: '已完成' };
    return map[status];
  };

  const getReservationStatusClass = (status: Reservation['status'], hasFeedback?: boolean) => {
    if (status === 'completed' && hasFeedback) return 'feedbacked';
    return status;
  };

  const filteredActivities = activities.filter(activity => {
    if (activeCategory === 'all') return true;
    return activity.type === activeCategory;
  });

  const isActivityFull = (activity: Activity) => activity.signedUp >= activity.capacity;

  const getActivityReservation = (activityId: string) => {
    return reservations.find(r => r.activityId === activityId);
  };

  const getSignUpBtnText = (activity: Activity) => {
    if (isActivityFull(activity)) return '已满员';
    const reservation = getActivityReservation(activity.id);
    if (reservation) {
      if (reservation.status === 'reserved') return '已预约';
      if (reservation.status === 'cancelled') return '已取消';
      if (reservation.status === 'completed' && reservation.feedback) return '已反馈';
      if (reservation.status === 'completed') return '已完成';
    }
    return '立即报名';
  };

  const getSignUpBtnClass = (activity: Activity) => {
    if (isActivityFull(activity)) return styles.full;
    const reservation = getActivityReservation(activity.id);
    if (reservation) {
      if (reservation.status === 'reserved') return styles.reserved;
      if (reservation.status === 'cancelled') return styles.cancelled;
      if (reservation.status === 'completed') return styles.completed;
    }
    return '';
  };

  const currentFeedbackReservation = reservations.find(r => r.id === feedbackId);

  return (
    <ScrollView className={styles.page} scrollY>
      {feedbackId && currentFeedbackReservation ? (
        <View className={styles.feedbackModal}>
          <View className={styles.feedbackContent}>
            <Text className={styles.feedbackTitle}>满意度反馈</Text>
            <Text className={styles.feedbackActivity}>{currentFeedbackReservation.activityTitle}</Text>
            <View className={styles.ratingSection}>
              <Text className={styles.ratingLabel}>评分</Text>
              <View className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <View key={star} className={styles.starBtn} onClick={() => setFeedbackRating(star)}>
                    <Text style={{ fontSize: 40 }}>{star <= feedbackRating ? '⭐' : '☆'}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className={styles.commentSection}>
              <Text className={styles.commentLabel}>留言</Text>
              <Textarea
                className={styles.commentTextarea}
                placeholder="请输入您的感受和建议..."
                value={feedbackComment}
                onInput={(e) => setFeedbackComment(e.detail.value)}
                maxlength={500}
              />
            </View>
            <View className={styles.feedbackActions}>
              <View className={styles.cancelFeedbackBtn} onClick={() => setFeedbackId(null)}>
                <Text>取消</Text>
              </View>
              <View className={styles.submitFeedbackBtn} onClick={handleSubmitFeedback}>
                <Text>提交反馈</Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}

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
                  className={`${styles.activityCard} ${isActivityFull(activity) ? styles.full : ''}`}
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
                        className={`${styles.signUpBtn} ${getSignUpBtnClass(activity)}`}
                        onClick={(e) => handleSignUp(e, activity)}
                      >
                        {getSignUpBtnText(activity)}
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
              <View
                key={reservation.id}
                className={`${styles.reservationCard} ${styles.ticketCard} ${reservation.status === 'cancelled' ? styles.cancelledTicket : ''}`}
              >
                <View className={styles.ticketStub}>
                  <Text className={styles.ticketStubTitle}>数字文化馆</Text>
                  <Text className={styles.ticketStubId}>ID: {reservation.id.slice(-6)}</Text>
                </View>
                <View className={styles.ticketMain}>
                  <View className={styles.ticketHeader}>
                    <View className={styles.ticketTitleRow}>
                      <Text className={styles.reservationTitle}>{reservation.activityTitle}</Text>
                      <View className={`${styles.reservationStatus} ${styles[getReservationStatusClass(reservation.status, !!reservation.feedback)]}`}>
                        {getReservationStatusLabel(reservation.status, !!reservation.feedback)}
                      </View>
                    </View>
                    {reservation.rescheduleHistory && reservation.rescheduleHistory.length > 0 && (
                      <View className={styles.rescheduleHint}>
                        <Text className={styles.rescheduleIcon}>📅</Text>
                        <Text className={styles.rescheduleText}>
                          已改签 {reservation.rescheduleHistory.length} 次
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className={styles.reservationInfo}>
                    <View className={styles.infoRow}>
                      <Text className={styles.icon}>📅</Text>
                      <View className={styles.dateInfo}>
                        <Text className={styles.currentDate}>{reservation.date} {reservation.time}</Text>
                        {reservation.rescheduleHistory && reservation.rescheduleHistory.length > 0 && (
                          <Text className={styles.oldDate}>
                            原：{reservation.rescheduleHistory[reservation.rescheduleHistory.length - 1].oldDate} {reservation.rescheduleHistory[reservation.rescheduleHistory.length - 1].oldTime}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.icon}>🎫</Text>
                      <Text>{reservation.ticketCount} 张票</Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.icon}>⏰</Text>
                      <Text>预约时间：{reservation.reservationTime}</Text>
                    </View>
                    {reservation.feedback && (
                      <View className={styles.infoRow}>
                        <Text className={styles.icon}>⭐</Text>
                        <Text className={styles.feedbackInfo}>
                          评分 {reservation.feedback.rating} 分 · {reservation.feedback.comment.slice(0, 20)}{reservation.feedback.comment.length > 20 ? '...' : ''}
                        </Text>
                      </View>
                    )}
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
                    {reservation.status === 'cancelled' && (
                      <View className={`${styles.actionBtn} ${styles.cancelled}`}>
                        已取消
                      </View>
                    )}
                    {reservation.status === 'completed' && !reservation.feedback && (
                      <View
                        className={`${styles.actionBtn} ${styles.primary}`}
                        onClick={() => handleFeedback(reservation)}
                      >
                        满意度反馈
                      </View>
                    )}
                    {reservation.status === 'completed' && reservation.feedback && (
                      <View className={`${styles.actionBtn} ${styles.feedbackDone}`}>
                        已反馈 ⭐{reservation.feedback.rating}
                      </View>
                    )}
                  </View>
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
