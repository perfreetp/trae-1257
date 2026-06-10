import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { userInfo, checkInRecords, favoriteItems } from '@/data/user';
import { useAppStore } from '@/store/appStore';
import type { VisitNote, TimelineRecord } from '@/types/user';

const getDateKey = (timestamp: string): string => {
  return timestamp.split(' ')[0];
};

const getTodayStr = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const MinePage: React.FC = () => {
  const notes = useAppStore(state => state.notes);
  const timeline = useAppStore(state => state.timeline);
  const visitRecords = useAppStore(state => state.visitRecords);
  const checkInRecordsData = checkInRecords;

  const [activeTab, setActiveTab] = useState<'calendar' | 'timeline' | 'notes'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());

  const inProgressVisits = useMemo(() => {
    return visitRecords.filter(r => r.status === 'in_progress');
  }, [visitRecords]);

  const completedVisitRecords = useMemo(() => {
    return visitRecords.filter(r => r.status === 'completed');
  }, [visitRecords]);

  const recordsByDate = useMemo(() => {
    const map: Record<string, TimelineRecord[]> = {};

    timeline.forEach(record => {
      const dateKey = getDateKey(record.timestamp);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(record);
    });

    completedVisitRecords.forEach(record => {
      if (record.endTime) {
        const dateKey = getDateKey(record.endTime);
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push({
          id: `vr_${record.id}`,
          type: 'route_complete',
          title: `路线参观完成`,
          description: `完成「${record.routeName}」全部${record.startStops.length}个站点`,
          itemId: record.routeId,
          itemType: 'route',
          timestamp: record.endTime,
          icon: '🏆'
        });
      }
    });

    notes.forEach(note => {
      const dateKey = getDateKey(note.createTime);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push({
        id: `note_${note.id}`,
        type: 'note_create',
        title: `笔记已保存`,
        description: `「${note.title}」${note.exhibitName ? ` - ${note.exhibitName}` : ''}`,
        itemId: note.exhibitId || note.id,
        itemType: note.exhibitId ? 'exhibit' : 'activity',
        timestamp: note.createTime,
        icon: '📝'
      });
    });

    checkInRecordsData.forEach(record => {
      const dateKey = getDateKey(record.date);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push({
        id: `ci_${record.id}`,
        type: 'scan_exhibit',
        title: `打卡盖章`,
        description: `在「${record.locationName}」完成打卡，获得 ${record.points} 积分`,
        itemId: record.id,
        itemType: 'exhibit',
        timestamp: record.date,
        icon: '📍'
      });
    });

    Object.keys(map).forEach(dateKey => {
      map[dateKey].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    });

    return map;
  }, [timeline, completedVisitRecords, notes, checkInRecordsData]);

  const getCalendarDays = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayWeek = firstDay.getDay();

    const days: Array<{ date: string; day: number; isCurrentMonth: boolean; hasRecord: boolean; isSelected: boolean; isToday: boolean }> = [];

    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevMonth = month - 1 === 0 ? 12 : month - 1;
      const prevYear = month - 1 === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: dateStr,
        day,
        isCurrentMonth: false,
        hasRecord: !!recordsByDate[dateStr]?.length,
        isSelected: dateStr === selectedDate,
        isToday: dateStr === getTodayStr()
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        date: dateStr,
        day: i,
        isCurrentMonth: true,
        hasRecord: !!recordsByDate[dateStr]?.length,
        isSelected: dateStr === selectedDate,
        isToday: dateStr === getTodayStr()
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month + 1 > 12 ? 1 : month + 1;
      const nextYear = month + 1 > 12 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        date: dateStr,
        day: i,
        isCurrentMonth: false,
        hasRecord: !!recordsByDate[dateStr]?.length,
        isSelected: dateStr === selectedDate,
        isToday: dateStr === getTodayStr()
      });
    }

    return days;
  };

  const selectedDayRecords = useMemo(() => {
    return recordsByDate[selectedDate] || [];
  }, [recordsByDate, selectedDate]);

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const prev = month - 1;
    if (prev <= 0) {
      setCurrentMonth(`${year - 1}-12`);
    } else {
      setCurrentMonth(`${year}-${String(prev).padStart(2, '0')}`);
    }
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const next = month + 1;
    if (next > 12) {
      setCurrentMonth(`${year + 1}-01`);
    } else {
      setCurrentMonth(`${year}-${String(next).padStart(2, '0')}`);
    }
  };

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

  const handleContinueVisit = (routeId: string) => {
    Taro.navigateTo({ url: `/pages/route-detail/index?id=${routeId}` });
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
        {inProgressVisits.length > 0 && (
          <View className={styles.inProgressSection}>
            <Text className={styles.inProgressTitle}>
              <Text className={styles.accent}>·</Text> 未完成行程
            </Text>
            {inProgressVisits.map(visit => (
              <View
                key={visit.id}
                className={styles.inProgressCard}
                onClick={() => handleContinueVisit(visit.routeId)}
              >
                <View className={styles.inProgressIcon}>🚶</View>
                <View className={styles.inProgressInfo}>
                  <Text className={styles.inProgressRouteName}>{visit.routeName}</Text>
                  <Text className={styles.inProgressProgress}>
                    进度：{visit.currentStopIndex}/{visit.startStops.length} 站 · 开始于 {visit.startTime.split(' ')[1]}
                  </Text>
                </View>
                <View className={styles.inProgressBtn}>
                  <Text>继续导览 ›</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View className={styles.tabHeader}>
          <View
            className={`${styles.tabItem} ${activeTab === 'calendar' ? styles.active : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Text>参观日历</Text>
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'timeline' ? styles.active : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Text>全部记录</Text>
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'notes' ? styles.active : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <Text>参观笔记</Text>
          </View>
        </View>

        {activeTab === 'calendar' && (
          <View className={styles.calendarSection}>
            <View className={styles.calendarHeader}>
              <View className={styles.calendarNav} onClick={handlePrevMonth}>
                <Text>‹</Text>
              </View>
              <Text className={styles.calendarTitle}>
                {currentMonth.split('-')[0]}年{currentMonth.split('-')[1]}月
              </Text>
              <View className={styles.calendarNav} onClick={handleNextMonth}>
                <Text>›</Text>
              </View>
            </View>
            <View className={styles.weekDays}>
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <Text key={day} className={styles.weekDay}>{day}</Text>
              ))}
            </View>
            <View className={styles.calendarGrid}>
              {getCalendarDays().map(day => (
                <View
                  key={day.date}
                  className={`${styles.calendarDay} ${!day.isCurrentMonth ? styles.otherMonth : ''} ${day.isSelected ? styles.selected : ''} ${day.isToday ? styles.today : ''}`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <Text className={styles.dayNumber}>{day.day}</Text>
                  {day.hasRecord && <View className={styles.recordDot} />}
                </View>
              ))}
            </View>

            <View className={styles.selectedDaySection}>
              <View className={styles.selectedDayHeader}>
                <Text className={styles.selectedDate}>{selectedDate}</Text>
                <Text className={styles.selectedCount}>
                  {selectedDayRecords.length} 条记录
                </Text>
              </View>
              {selectedDayRecords.length === 0 ? (
                <View className={styles.emptyDay}>
                  <Text className={styles.emptyDayText}>当天暂无记录</Text>
                </View>
              ) : (
                <View className={styles.dayTimeline}>
                  {selectedDayRecords.map(record => (
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
                          <Text className={styles.timelineTime}>{record.timestamp.split(' ')[1]}</Text>
                        </View>
                        <Text className={styles.timelineDesc}>{record.description}</Text>
                      </View>
                      <Text className={styles.timelineArrow}>›</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

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
