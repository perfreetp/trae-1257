import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { getActivityById, getActivityTypeLabel } from '@/data/activities';
import { useAppStore } from '@/store/appStore';
import type { Reservation } from '@/types/activity';

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.id || 'a1';
  const activity = getActivityById(activityId as string);
  const addReservation = useAppStore(state => state.addReservation);
  const reservations = useAppStore(state => state.reservations);
  const cancelReservation = useAppStore(state => state.cancelReservation);
  const rescheduleReservation = useAppStore(state => state.rescheduleReservation);
  const [hasSignedUp, setHasSignedUp] = useState(false);

  const myReservation = useMemo(() => {
    if (!activity) return null;
    return reservations.find(r => r.activityId === activity.id);
  }, [activity, reservations]);

  const checkIfSignedUp = () => {
    if (!activity) return false;
    return reservations.some(r => r.activityId === activity.id && r.status === 'reserved');
  };

  const isActivityFull = () => {
    if (!activity) return true;
    return activity.signedUp >= activity.capacity;
  };

  const handleSignup = () => {
    if (!activity) return;
    if (isActivityFull()) {
      Taro.showToast({ title: '活动已报满', icon: 'none' });
      return;
    }
    if (checkIfSignedUp() || hasSignedUp) {
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
          setHasSignedUp(true);
          Taro.showToast({ title: '报名成功', icon: 'success' });
        }
      }
    });
  };

  const handleCancel = () => {
    if (!myReservation) return;
    Taro.showModal({
      title: '确认取消',
      content: `确定要取消「${myReservation.activityTitle}」的预约吗？`,
      success: (res) => {
        if (res.confirm) {
          cancelReservation(myReservation.id);
          Taro.showToast({ title: '已取消预约', icon: 'success' });
        }
      }
    });
  };

  const handleReschedule = () => {
    if (!myReservation) return;
    const availableDates = ['2026-07-05', '2026-07-12', '2026-07-19'];
    Taro.showActionSheet({
      itemList: availableDates.map(d => `${d} ${myReservation.time}`),
      success: (res) => {
        rescheduleReservation(myReservation.id, availableDates[res.tapIndex], myReservation.time);
        Taro.showToast({ title: '改签成功', icon: 'success' });
      }
    });
  };

  const handleShare = () => {
    Taro.navigateTo({ url: '/pages/share-poster/index' });
  };

  const handleRemind = () => {
    Taro.showToast({ title: '已设置提醒', icon: 'none' });
  };

  if (!activity) {
    return (
      <View className={styles.page}>
        <Text>活动不存在</Text>
      </View>
    );
  }

  const statusText: Record<string, string> = {
    ongoing: '报名中',
    upcoming: '即将开始',
    ended: '已结束'
  };

  const isSignedUp = checkIfSignedUp() || hasSignedUp;
  const activityFull = isActivityFull();

  const getReservationStatusLabel = (reservation: Reservation) => {
    if (reservation.status === 'completed' && reservation.feedback) return '已反馈';
    const map = { reserved: '已预约', cancelled: '已取消', completed: '已完成' };
    return map[reservation.status];
  };

  const getDisplayDate = () => {
    if (myReservation) {
      return {
        current: `${myReservation.date} ${myReservation.time}`,
        original: myReservation.rescheduleHistory && myReservation.rescheduleHistory.length > 0
          ? `${myReservation.rescheduleHistory[myReservation.rescheduleHistory.length - 1].oldDate} ${myReservation.rescheduleHistory[myReservation.rescheduleHistory.length - 1].oldTime}`
          : null
      };
    }
    return {
      current: `${activity.date} ${activity.time}`,
      original: null
    };
  };

  const displayDate = getDisplayDate();

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.coverImage}>
          <Image src={activity.coverImage} mode="aspectFill" />
        </View>

        <View className={styles.activityInfo}>
          <View className={styles.statusRow}>
            <View className={`${styles.statusBadge} ${styles[activity.status]}`}>
              {statusText[activity.status] || '报名中'}
            </View>
            {myReservation && (
              <View className={`${styles.reservationStatusBadge} ${styles[myReservation.status]}`}>
                {getReservationStatusLabel(myReservation)}
              </View>
            )}
          </View>
          <Text className={styles.title}>{activity.title}</Text>
          <View className={styles.category}>{getActivityTypeLabel(activity.type)}</View>
          {myReservation?.rescheduleHistory && myReservation.rescheduleHistory.length > 0 && (
            <View className={styles.rescheduleHint}>
              <Text className={styles.rescheduleIcon}>📅</Text>
              <Text className={styles.rescheduleText}>
                已改签 {myReservation.rescheduleHistory.length} 次
              </Text>
            </View>
          )}
          <View className={styles.metaList}>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📅</Text>
              <View className={styles.dateInfo}>
                <Text className={styles.currentDate}>{displayDate.current}</Text>
                {displayDate.original && (
                  <Text className={styles.oldDate}>
                    原：{displayDate.original}
                  </Text>
                )}
              </View>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📍</Text>
              <Text>{activity.location}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>👥</Text>
              <Text>已报名 {activity.signedUp}/{activity.capacity} 人</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>⏱️</Text>
              <Text>活动时长：{activity.duration}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text>
            活动介绍
          </Text>
          <Text className={styles.sectionContent}>{activity.description}</Text>
        </View>

        {activity.guest && (
          <View className={`${styles.section} ${styles.guestSection}`}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.accent}>·</Text>
              主讲嘉宾
            </Text>
            <View className={styles.guestCard}>
              <View className={styles.avatar}>
                <Image src={activity.guest.avatar} mode="aspectFill" />
              </View>
              <View className={styles.guestInfo}>
                <Text className={styles.name}>{activity.guest.name}</Text>
                <Text className={styles.title}>{activity.guest.title}</Text>
                <Text className={styles.bio}>{activity.guest.bio}</Text>
              </View>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text>
            温馨提示
          </Text>
          <Text className={styles.sectionContent}>
            1. 请提前15分钟到达活动现场签到{'\n'}
            2. 活动期间请将手机调至静音{'\n'}
            3. 如需取消预约，请提前24小时操作{'\n'}
            4. 儿童请在家长陪同下参与
          </Text>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.priceInfo}>
          {activity.price === 0 ? (
            <Text className={styles.price}>免费</Text>
          ) : (
            <>
              <Text className={styles.price}>¥{activity.price}</Text>
              <Text className={styles.priceLabel}>/人</Text>
            </>
          )}
        </View>
        {myReservation?.status === 'reserved' ? (
          <>
            <View className={styles.secondaryBtn} onClick={handleCancel}>
              <Text>取消预约</Text>
            </View>
            <View className={styles.primaryBtn} onClick={handleReschedule}>
              <Text>预约改签</Text>
            </View>
          </>
        ) : myReservation?.status === 'cancelled' ? (
          <View className={`${styles.primaryBtn} ${styles.cancelled}`}>
            <Text>已取消</Text>
          </View>
        ) : myReservation?.status === 'completed' && !myReservation.feedback ? (
          <View className={styles.primaryBtn}>
            <Text>满意度反馈</Text>
          </View>
        ) : myReservation?.status === 'completed' && myReservation.feedback ? (
          <View className={`${styles.primaryBtn} ${styles.feedbackDone}`}>
            <Text>已反馈 ⭐{myReservation.feedback.rating}</Text>
          </View>
        ) : (
          <>
            <View className={styles.secondaryBtn} onClick={handleRemind}>
              <Text>🔔 提醒</Text>
            </View>
            <View
              className={`${styles.primaryBtn} ${(activity.status === 'ended' || activityFull) ? styles.disabled : ''}`}
              onClick={(activity.status !== 'ended' && !activityFull) ? handleSignup : undefined}
            >
              <Text>
                {activity.status === 'ended' ? '已结束' :
                  activityFull ? '已满员' : '立即报名'}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ActivityDetailPage;
