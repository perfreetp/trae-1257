import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { getRouteById, getDifficultyLabel } from '@/data/routes';
import { useAppStore } from '@/store/appStore';
import type { RouteStop, RouteVisitRecord } from '@/types/route';

const parseDurationToMinutes = (durationStr: string): number => {
  const match = durationStr.match(/(\d+(?:\.\d+)?)\s*(小时|分钟|h|min)/i);
  if (!match) return 30;
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.includes('小时') || unit === 'h') return Math.round(value * 60);
  return Math.round(value);
};

const formatElapsedTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}小时${minutes}分`;
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
};

const RouteDetailPage: React.FC = () => {
  const router = useRouter();
  const routeId = router.params.id || 'rt1';
  const route = getRouteById(routeId as string);

  const startRouteVisit = useAppStore(state => state.startRouteVisit);
  const advanceToNextStop = useAppStore(state => state.advanceToNextStop);
  const completeRouteVisit = useAppStore(state => state.completeRouteVisit);
  const getActiveVisitRecord = useAppStore(state => state.getActiveVisitRecord);
  const visitRecords = useAppStore(state => state.visitRecords);

  const [isGuiding, setIsGuiding] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [completedStops, setCompletedStops] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!route) return;
    const active = getActiveVisitRecord(route.id);
    if (active) {
      setIsGuiding(true);
      setCurrentRecordId(active.id);
      setCurrentStopIndex(active.currentStopIndex);
      setCompletedStops(active.completedStops);
      const start = new Date(active.startTime).getTime();
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - start) / 1000));
    }
  }, [route, getActiveVisitRecord, visitRecords]);

  useEffect(() => {
    if (isGuiding) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isGuiding]);

  const currentRecord = currentRecordId ? visitRecords.find(r => r.id === currentRecordId) : null;
  const isLastStop = route && currentStopIndex >= route.stops.length - 1;
  const isAllCompleted = route && currentStopIndex >= route.stops.length;

  const totalMinutes = route ? parseDurationToMinutes(route.duration) : 60;
  const completedMinutes = completedStops.length > 0 && route
    ? route.stops
        .filter(s => completedStops.includes(s.id))
        .reduce((sum, s) => sum + parseDurationToMinutes(s.duration), 0)
    : 0;
  const remainingMinutes = Math.max(0, totalMinutes - completedMinutes);

  const handleStartRoute = () => {
    if (!route) return;
    const record = startRouteVisit(route);
    setIsGuiding(true);
    setCurrentRecordId(record.id);
    setCurrentStopIndex(0);
    setCompletedStops([]);
    setElapsedSeconds(0);
    Taro.showToast({ title: '开始导览', icon: 'success' });
  };

  const handleNextStop = () => {
    if (!currentRecordId || !route) return;
    const currentStop = route.stops[currentStopIndex];
    if (currentStop && currentStop.exhibitId && !completedStops.includes(currentStop.id + '_visited')) {
      Taro.showModal({
        title: '还没听讲解哦',
        content: `您还未查看「${currentStop.name}」的展品讲解，确定要前往下一站吗？`,
        confirmText: '继续前进',
        cancelText: '回去看看',
        success: (res) => {
          if (res.confirm) {
            doNextStop();
          }
        }
      });
    } else {
      doNextStop();
    }
  };

  const doNextStop = () => {
    if (!currentRecordId || !route) return;
    if (isLastStop) {
      advanceToNextStop(currentRecordId);
      setIsGuiding(false);
      setCurrentRecordId(null);
      Taro.showModal({
        title: '导览完成 🎉',
        content: `恭喜完成「${route.name}」全部${route.stops.length}个站点！现在去看看你的参观总结吧～`,
        confirmText: '查看总结',
        cancelText: '稍后再看',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({
              url: `/pages/visit-summary/index?recordId=${currentRecordId}`
            });
          }
        }
      });
      return;
    }
    advanceToNextStop(currentRecordId);
    const nextIndex = currentStopIndex + 1;
    setCurrentStopIndex(nextIndex);
    const stop = route.stops[currentStopIndex];
    if (stop) {
      setCompletedStops(prev => [...prev, stop.id]);
    }
    Taro.showToast({ title: `前往：${route.stops[nextIndex].name}`, icon: 'none' });
  };

  const handleExitGuide = () => {
    if (!currentRecordId || !route) return;
    Taro.showModal({
      title: '退出导览',
      content: '确定要退出导览吗？进度将保存，下次可继续参观。',
      confirmText: '退出',
      cancelText: '继续参观',
      success: (res) => {
        if (res.confirm) {
          setIsGuiding(false);
          Taro.showToast({ title: '进度已保存', icon: 'none' });
        }
      }
    });
  };

  const handleEndRoute = () => {
    if (!currentRecordId || !route) return;
    Taro.showModal({
      title: '结束导览',
      content: '确定要结束并完成这条路线吗？完成后将生成参观总结。',
      confirmText: '完成',
      cancelText: '再看看',
      success: (res) => {
        if (res.confirm) {
          completeRouteVisit(currentRecordId);
          setIsGuiding(false);
          setCurrentRecordId(null);
          Taro.showToast({ title: '导览已完成', icon: 'success' });
          Taro.navigateTo({
            url: `/pages/visit-summary/index?recordId=${currentRecordId}`
          });
        }
      }
    });
  };

  const handleShare = () => {
    Taro.navigateTo({ url: '/pages/share-poster/index' });
  };

  const handleSave = () => {
    Taro.showToast({ title: '已保存到我的路线', icon: 'none' });
  };

  const handleStopClick = (stop: RouteStop) => {
    if (stop.exhibitId) {
      Taro.navigateTo({
        url: `/pages/exhibit-detail/index?id=${stop.exhibitId}`
      });
    } else {
      Taro.showToast({ title: stop.description, icon: 'none' });
    }
  };

  const handleExhibitDetail = (e: React.MouseEvent, exhibitId: string) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/exhibit-detail/index?id=${exhibitId}`
    });
  };

  if (!route) {
    return (
      <View className={styles.page}>
        <Text>路线不存在</Text>
      </View>
    );
  }

  const currentStop = !isAllCompleted ? route.stops[currentStopIndex] : null;
  const nextStop = !isLastStop && !isAllCompleted ? route.stops[currentStopIndex + 1] : null;

  const handleContinueGuide = () => {
    if (!route) return;
    const active = getActiveVisitRecord(route.id);
    if (active) {
      setCurrentRecordId(active.id);
      setIsGuiding(true);
      Taro.showToast({ title: '继续导览', icon: 'success' });
    }
  };

  const hasActiveVisit = route && !!getActiveVisitRecord(route.id);

  return (
    <View className={styles.page}>
      {isGuiding && currentRecord && (
        <View className={styles.guidePanel}>
          <View className={styles.guideHeader}>
            <View className={styles.guideProgress}>
              <Text className={styles.guideProgressText}>
                进度：{Math.min(currentStopIndex + 1, route.stops.length)}/{route.stops.length}
              </Text>
              <View className={styles.guideProgressBar}>
                <View
                  className={styles.guideProgressFill}
                  style={{ width: `${(currentStopIndex / route.stops.length) * 100}%` }}
                />
              </View>
            </View>
            <View className={styles.guideClose} onClick={handleExitGuide}>
              <Text>✕</Text>
            </View>
          </View>

          <View className={styles.guideTimeInfo}>
            <View className={styles.timeItem}>
              <Text className={styles.timeLabel}>已用时间</Text>
              <Text className={styles.timeValue}>{formatElapsedTime(elapsedSeconds)}</Text>
            </View>
            <View className={styles.timeDivider} />
            <View className={styles.timeItem}>
              <Text className={styles.timeLabel}>剩余时间</Text>
              <Text className={styles.timeValue}>
                {remainingMinutes >= 60 ? `${Math.floor(remainingMinutes / 60)}小时${remainingMinutes % 60}分` : `${remainingMinutes}分钟`}
              </Text>
            </View>
          </View>

          {currentStop && !isAllCompleted && (
            <View className={styles.currentStop}>
              <View className={styles.currentStopBadge}>📍 当前站</View>
              <Text className={styles.currentStopName}>{currentStop.name}</Text>
              <Text className={styles.currentStopInfo}>{currentStop.location} · 约{currentStop.duration}</Text>
              <Text className={styles.currentStopDesc}>{currentStop.description}</Text>
              {currentStop.exhibitId && (
                <View
                  className={styles.currentStopBtn}
                  onClick={(e) => handleExhibitDetail(e, currentStop.exhibitId!)}
                >
                  🎧 查看展品讲解
                </View>
              )}
            </View>
          )}

          {nextStop && (
            <View className={styles.nextStop}>
              <Text className={styles.nextStopLabel}>➡️ 下一站</Text>
              <Text className={styles.nextStopName}>{nextStop.name}</Text>
            </View>
          )}

          <View className={styles.guideActions}>
            {!isAllCompleted && (
              <View className={styles.primaryBtn} onClick={handleNextStop}>
                <Text>{isLastStop ? '🏆 完成导览' : '➡️ 前往下一站'}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <ScrollView scrollY className={isGuiding ? styles.scrollWithGuide : ''}>
        <View className={styles.routeHeader}>
          <Text className={styles.routeName}>{route.name}</Text>
          <Text className={styles.routeDesc}>{route.description}</Text>
          <View className={styles.routeStats}>
            <View className={styles.statItem}>
              <Text className={styles.icon}>⏱️</Text>
              <Text>{route.duration}</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.icon}>👣</Text>
              <Text>{route.distance}</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.icon}>🎯</Text>
              <Text>{route.stops.length}个站点</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.icon}>💪</Text>
              <Text>{getDifficultyLabel(route.difficulty)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.tipSection}>
          <View className={styles.tipHeader}>
            <Text className={styles.icon}>💡</Text>
            <Text className={styles.tipTitle}>路线贴士</Text>
          </View>
          <Text className={styles.tipText}>
            建议从入口出发，按照编号顺序参观，不走回头路。每个展品都有语音讲解，记得戴耳机效果更佳哦～
          </Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.accent}>·</Text>
            参观站点（{route.stops.length}站）
          </Text>
          <View className={styles.timeline}>
            {route.stops.map((stop, index) => {
              const isCompleted = completedStops.includes(stop.id);
              const isCurrent = isGuiding && index === currentStopIndex && !isAllCompleted;
              return (
                <View
                  key={stop.id}
                  className={`${styles.timelineItem} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
                >
                  <View className={styles.stopNumber}>
                    {isCompleted ? '✓' : index + 1}
                  </View>
                  <View
                    className={styles.stopContent}
                    onClick={() => handleStopClick(stop)}
                  >
                    <Text className={styles.stopName}>
                      {isCurrent && <Text className={styles.currentDot}>● </Text>}
                      {stop.name}
                    </Text>
                    <Text className={styles.stopInfo}>{stop.location} · 约{stop.duration}</Text>
                    <Text className={styles.stopDesc}>{stop.description}</Text>
                    <View className={styles.stopActions}>
                      {stop.exhibitId && (
                        <View
                          className={styles.actionBtn}
                          onClick={(e) => handleExhibitDetail(e, stop.exhibitId!)}
                        >
                          🎧 展品讲解
                        </View>
                      )}
                      <View className={styles.actionBtn}>📖 查看详情</View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: '200rpx' }} />
      </ScrollView>

      {!isGuiding && (
        <View className={styles.bottomBar}>
          {hasActiveVisit && (
            <View className={styles.continueTip}>
              <Text className={styles.continueTipIcon}>💡</Text>
              <Text className={styles.continueTipText}>
                上次进度：第{currentStopIndex + 1}站 · {formatElapsedTime(elapsedSeconds)}
              </Text>
            </View>
          )}
          <View className={styles.actionItem} onClick={handleSave}>
            <Text className={styles.icon}>⭐</Text>
            <Text className={styles.label}>收藏</Text>
          </View>
          <View className={styles.actionItem} onClick={handleShare}>
            <Text className={styles.icon}>📤</Text>
            <Text className={styles.label}>分享</Text>
          </View>
          <View
            className={`${styles.primaryBtn} ${hasActiveVisit ? styles.continueBtn : ''}`}
            onClick={hasActiveVisit ? handleContinueGuide : handleStartRoute}
          >
            <Text className={styles.icon}>{hasActiveVisit ? '▶️' : '🚶'}</Text>
            <Text>{hasActiveVisit ? '继续导览' : '开始导览'}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default RouteDetailPage;
