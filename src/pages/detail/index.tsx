import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import { formatDate, getStatusColor } from '@/utils';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const courseId = router.params.id;
  const { courses, toggleFavorite, enrollCourse } = useApp();
  const [course, setCourse] = useState(courses.find(c => c.id === courseId));

  useEffect(() => {
    const found = courses.find(c => c.id === courseId);
    setCourse(found);
  }, [courses, courseId]);

  if (!course) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx 32rpx', textAlign: 'center' }}>
          <Text style={{ fontSize: '80rpx' }}>🤔</Text>
          <Text style={{ display: 'block', marginTop: '24rpx', color: '#86909C' }}>课程不存在</Text>
        </View>
      </View>
    );
  }

  const handleFavorite = () => {
    toggleFavorite(course.id);
  };

  const handleEnroll = () => {
    console.log('[Detail] Click enroll');
    Taro.navigateTo({ url: `/pages/enroll/index?id=${course.id}` });
  };

  const totalEnrolled = course.sessions.reduce((sum, s) => sum + s.enrolled, 0);
  const totalCapacity = course.sessions.reduce((sum, s) => sum + s.capacity, 0);
  const isFull = course.enrolledCount >= course.maxStudents;

  return (
    <View className={styles.page}>
      <Image className={styles.cover} src={course.cover} mode="aspectFill" />

      <View className={styles.content}>
        <View className={styles.infoCard}>
          <View className={styles.titleRow}>
            <Text className={styles.title}>{course.title}</Text>
            <View className={styles.favoriteBtn} onClick={handleFavorite}>
              {course.isFavorite ? '❤️' : '🤍'}
            </View>
          </View>

          <View className={styles.tagRow}>
            <View className={classnames(styles.tag, styles.categoryTag)}>
              {course.categoryName}
            </View>
            {course.tags.map((tag, idx) => (
              <View key={idx} className={styles.tag}>{tag}</View>
            ))}
          </View>

          <View className={styles.metaRow}>
            <View className={styles.metaItem}>
              <Text className={styles.metaValue}>⭐ {course.rating}</Text>
              <Text className={styles.metaLabel}>{course.reviewCount}条评价</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.metaValue}>{course.enrolledCount}</Text>
              <Text className={styles.metaLabel}>已报名</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.metaValue}>{course.sessions.length}</Text>
              <Text className={styles.metaLabel}>场次可约</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👨‍🏫</Text>
            老师简介
          </Text>
          <View className={styles.teacherRow}>
            <Image className={styles.teacherAvatar} src={course.teacher.avatar} mode="aspectFill" />
            <View className={styles.teacherInfo}>
              <View className={styles.teacherName}>
                {course.teacher.name}
                {course.teacher.certified && (
                  <View className={styles.certBadge}>✓ 认证</View>
                )}
              </View>
              <Text className={styles.teacherRating}>⭐ {course.teacher.rating} 分</Text>
              <Text className={styles.teacherIntro}>{course.teacher.intro}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📋</Text>
            课程信息
          </Text>
          <View className={styles.infoList}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>📍 上课地点</Text>
              <Text className={styles.infoValue}>{course.location}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>� 人数上限</Text>
              <Text className={styles.infoValue}>{course.maxStudents}人</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>🎒 材料费用</Text>
              <Text className={styles.infoValue} style={{ color: course.materialFee > 0 ? '#FF6B35' : '#00B42A' }}>
                {course.materialFee > 0 ? `¥${course.materialFee}/人` : '免费'}
              </Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>👶 适合年龄</Text>
              <Text className={styles.infoValue}>{course.suitableAge}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📅</Text>
            课时安排
          </Text>
          {course.sessions.map(session => {
            const isSessionFull = session.enrolled >= session.capacity;
            return (
              <View key={session.id} className={styles.sessionItem}>
                <View className={styles.sessionInfo}>
                  <Text className={styles.sessionDate}>{formatDate(session.date)}</Text>
                  <Text className={styles.sessionTime}>🕐 {session.time}</Text>
                </View>
                <View className={styles.sessionCapacity}>
                  <Text className={styles.sessionCount}>
                    {session.enrolled}/{session.capacity}人
                  </Text>
                  <Text className={classnames(styles.sessionStatus, isSessionFull ? styles.statusHot : styles.statusOk)}>
                    {isSessionFull ? '已满员' : '有位置'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📝</Text>
            课程介绍
          </Text>
          <Text className={styles.descText}>{course.description}</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.priceInfo}>
          <Text className={styles.priceLabel}>材料费</Text>
          <Text className={classnames(styles.priceValue, course.materialFee === 0 && styles.freeText)}>
            {course.materialFee > 0 ? `¥${course.materialFee}` : '免费'}
          </Text>
        </View>
        <Button
          className={classnames(styles.enrollBtn, isFull && styles.enrollBtnDisabled)}
          onClick={handleEnroll}
        >
          {isFull ? '已满员，候补' : '立即报名'}
        </Button>
      </View>
    </View>
  );
};

export default DetailPage;
