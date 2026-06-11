import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/app';

const MinePage: React.FC = () => {
  const { user, enrolledCourses, publishedCourses, courses, notifications } = useApp();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const favoriteCount = courses.filter(c => c.isFavorite).length;

  const menuGroups = [
    {
      title: '我的课程',
      items: [
        { icon: '📚', label: '我报名的课', badge: enrolledCourses.length, action: 'enrolled' },
        { icon: '📖', label: '我开的课', badge: publishedCourses.length, action: 'published' },
        { icon: '⭐', label: '收藏课程', badge: favoriteCount, action: 'favorite' }
      ]
    },
    {
      title: '互动与服务',
      items: [
        { icon: '🔔', label: '通知提醒', badge: unreadCount, action: 'notice' },
        { icon: '🎯', label: '邻里积分', action: 'points' },
        { icon: '✅', label: '签到核销', action: 'checkin' },
        { icon: '📋', label: '资质标记', action: 'certify' },
        { icon: '📝', label: '课程审核', action: 'review' },
        { icon: '💬', label: '投诉反馈', action: 'feedback' }
      ]
    }
  ];

  const handleMenuClick = (action: string) => {
    console.log('[Mine] Menu clicked:', action);
    const routeMap: Record<string, string> = {
      enrolled: '/pages/afterclass/index',
      published: '/pages/manage/index',
      favorite: '',
      notice: '/pages/notice/index',
      points: '/pages/points/index',
      checkin: '/pages/checkin/index',
      certify: '/pages/certify/index',
      review: '/pages/review/index',
      feedback: '/pages/feedback/index'
    };

    const route = routeMap[action];
    if (route) {
      Taro.navigateTo({ url: route });
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  const handleViewPoints = () => {
    console.log('[Mine] View points detail');
    Taro.navigateTo({ url: '/pages/points/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userRow}>
          <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
          <View className={styles.userInfo}>
            <View className={styles.userName}>
              {user.name}
              {user.certified && (
                <View className={styles.certifiedBadge}>✓ 认证老师</View>
              )}
            </View>
            <Text className={styles.community}>🏘 {user.community}</Text>
          </View>
        </View>
      </View>

      <View className={styles.pointsCard}>
        <View className={styles.pointsInfo}>
          <Text className={styles.pointsLabel}>我的邻里积分</Text>
          <Text className={styles.pointsValue}>{user.points}</Text>
        </View>
        <Button className={styles.pointsBtn} onClick={handleViewPoints}>
          积分明细 ›
        </Button>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{enrolledCourses.length}</Text>
          <Text className={styles.statLabel}>我报名的课</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{publishedCourses.length}</Text>
          <Text className={styles.statLabel}>我开的课</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{favoriteCount}</Text>
          <Text className={styles.statLabel}>收藏课程</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{unreadCount}</Text>
          <Text className={styles.statLabel}>未读通知</Text>
        </View>
      </View>

      {menuGroups.map(group => (
        <View key={group.title} className={styles.menuSection}>
          <View className={styles.menuTitle}>{group.title}</View>
          {group.items.map(item => (
            <View key={item.action} className={styles.menuItem} onClick={() => handleMenuClick(item.action)}>
              <View className={styles.menuIcon}>{item.icon}</View>
              <Text className={styles.menuText}>{item.label}</Text>
              {item.badge && item.badge > 0 && (
                <View className={styles.badge}>{item.badge}</View>
              )}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default MinePage;
