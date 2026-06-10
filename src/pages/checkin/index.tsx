import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const CheckinPage: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkinTime, setCheckinTime] = useState('');

  const stamps = [
    { id: 1, name: '入口', icon: '🚪', collected: true },
    { id: 2, name: '青铜馆', icon: '🏺', collected: true },
    { id: 3, name: '书画厅', icon: '🖼️', collected: true },
    { id: 4, name: '陶瓷馆', icon: '🏺', collected: true },
    { id: 5, name: '玉器厅', icon: '💎', collected: false },
    { id: 6, name: '民俗厅', icon: '🎭', collected: false },
    { id: 7, name: '特展厅', icon: '⭐', collected: false },
    { id: 8, name: '出口', icon: '🚪', collected: false }
  ];

  const handleCheckin = () => {
    console.log('[Checkin] 点击打卡');
    if (isCheckedIn) {
      Taro.showToast({ title: '今日已打卡', icon: 'none' });
      return;
    }

    Taro.showLoading({ title: '打卡中...' });
    setTimeout(() => {
      Taro.hideLoading();
      setIsCheckedIn(true);
      const now = new Date();
      const timeStr = `${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      setCheckinTime(timeStr);
      Taro.showToast({
        title: '打卡成功！',
        icon: 'success'
      });
    }, 1000);
  };

  const handleStampClick = (stamp: typeof stamps[0]) => {
    console.log('[Checkin] 点击印章:', stamp.name);
    if (!stamp.collected) {
      Taro.showToast({
        title: `前往${stamp.name}解锁印章`,
        icon: 'none'
      });
    }
  };

  const collectedCount = stamps.filter(s => s.collected).length;

  return (
    <View className={styles.page}>
      <View className={styles.stampCard}>
        <View className={`${styles.stampCircle} ${isCheckedIn ? styles.stamped : ''}`}>
          {isCheckedIn ? (
            <View className={styles.stampContent}>
              <Text className={styles.stampIcon}>✅</Text>
              <Text className={styles.stampName}>已打卡</Text>
              <Text className={styles.stampDate}>{checkinTime}</Text>
            </View>
          ) : (
            <View className={styles.stampContent}>
              <Text className={styles.stampIcon}>📍</Text>
              <Text className={styles.stampName}>待打卡</Text>
            </View>
          )}
        </View>
        <Text className={styles.title}>今日打卡</Text>
        <Text className={styles.subtitle}>
          {isCheckedIn ? '恭喜您完成今日打卡，继续探索吧！' : '点击下方按钮，完成今日打卡'}
        </Text>
        <View className={styles.checkinBtn} onClick={handleCheckin}>
          <Text className={styles.icon}>📍</Text>
          <Text>{isCheckedIn ? '今日已打卡' : '立即打卡'}</Text>
        </View>
      </View>

      <View className={styles.stampCollection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.accent}>·</Text>
          我的印章
          <Text className={styles.count}>{collectedCount}/{stamps.length}</Text>
        </Text>
        <View className={styles.stampGrid}>
          {stamps.map(stamp => (
            <View
              key={stamp.id}
              className={styles.stampItem}
              onClick={() => handleStampClick(stamp)}
            >
              <View className={`${styles.stampImg} ${stamp.collected ? styles.collected : styles.locked}`}>
                <Text>{stamp.collected ? stamp.icon : '🔒'}</Text>
              </View>
              <Text className={`${styles.stampName} ${stamp.collected ? styles.collected : ''}`}>
                {stamp.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.tipSection}>
        <Text className={styles.tipTitle}>
          <Text className={styles.icon}>💡</Text>
          打卡小贴士
        </Text>
        <View className={styles.tipList}>
          <View className={styles.tipItem}>• 扫描展品旁的二维码即可打卡</View>
          <View className={styles.tipItem}>• 每个展厅都有专属印章可以收集</View>
          <View className={styles.tipItem}>• 收集全部印章可兑换纪念品</View>
          <View className={styles.tipItem}>• 打卡记录可在"我的"中查看</View>
        </View>
      </View>
    </View>
  );
};

export default CheckinPage;
