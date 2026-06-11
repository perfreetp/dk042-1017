import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { publishedCourses } from '@/data/courses';
import { currentUser } from '@/data/user';
import { getStatusText, getStatusColor } from '@/utils';

const PublishPage: React.FC = () => {
  const handlePublish = () => {
    console.log('[Publish] Click publish course');
    if (!currentUser.certified) {
      Taro.showModal({
        title: '尚未认证资质',
        content: '发布课程前请先完成老师资质认证，是否前往认证？',
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '前往资质认证', icon: 'none' });
          }
        }
      });
    } else {
      Taro.showToast({ title: '发布课程功能开发中', icon: 'none' });
    }
  };

  const handleManage = (courseId: string) => {
    console.log('[Publish] Manage course:', courseId);
    Taro.navigateTo({ url: `/pages/manage/index?id=${courseId}` });
  };

  const handleCertify = () => {
    console.log('[Publish] Click certify');
    Taro.showToast({ title: '资质认证功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.publishCard}>
        <Text className={styles.publishTitle}>分享你的技能</Text>
        <Text className={styles.publishDesc}>成为邻居老师，开设小班课，收获邻里积分与尊重</Text>
        <Button className={styles.publishBtn} onClick={handlePublish}>
          ＋ 发布新课程
        </Button>

        <View className={styles.teacherStatus}>
          <Text className={styles.statusIcon}>
            {currentUser.certified ? '✅' : '📋'}
          </Text>
          <Text className={styles.statusText}>
            {currentUser.certified ? '已完成老师资质认证' : '尚未完成老师资质认证'}
          </Text>
          {!currentUser.certified && (
            <Text className={styles.statusLink} onClick={handleCertify}>
              去认证
            </Text>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>我发布的课程</Text>
          <Text className={styles.sectionMore} onClick={() => Taro.navigateTo({ url: '/pages/manage/index' })}>
            全部管理 ›
          </Text>
        </View>

        {publishedCourses.length === 0 ? (
          <View style={{ padding: '60rpx 0', textAlign: 'center', color: '#86909C' }}>
            还没有发布课程
          </View>
        ) : (
          publishedCourses.map(course => (
            <View key={course.id} className={styles.myCourseCard}>
              <Image className={styles.cover} src={course.cover} mode="aspectFill" />
              <View className={styles.courseInfo}>
                <Text className={styles.courseTitle}>{course.title}</Text>
                <Text className={styles.courseMeta}>
                  报名：{course.enrolledCount}/{course.maxStudents}人
                </Text>
                <Text className={styles.courseMeta}>
                  下次课：{course.nextSession}
                </Text>
                <View className={styles.courseFooter}>
                  <View
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(course.status) }}
                  >
                    {getStatusText(course.status)}
                  </View>
                  <Button className={styles.manageBtn} onClick={() => handleManage(course.id)}>
                    管理
                  </Button>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipTitle}>💡 发布课程须知</Text>
        <Text className={styles.tipText}>
          1. 需完成老师资质认证后方可发布课程{'\n'}
          2. 课程内容需符合社区规范，提交后需审核{'\n'}
          3. 课程发布后可获得邻里积分奖励{'\n'}
          4. 请确保上课地点安全、适宜
        </Text>
      </View>
    </View>
  );
};

export default PublishPage;
