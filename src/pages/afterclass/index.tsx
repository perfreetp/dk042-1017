import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { enrolledCourses } from '@/data/courses';
import EmptyState from '@/components/EmptyState';
import { getStatusText, getStatusColor } from '@/utils';

const AfterClassPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const tabs = [
    { id: 'upcoming', name: '待上课' },
    { id: 'completed', name: '已完成' }
  ];

  const filteredCourses = enrolledCourses.filter(c => {
    if (activeTab === 'upcoming') return c.status === 'upcoming';
    return c.status === 'completed';
  });

  const handleUpload = (courseId: string, courseTitle: string) => {
    console.log('[AfterClass] Upload work for:', courseId, courseTitle);
    Taro.navigateTo({ url: `/pages/upload/index?id=${courseId}` });
  };

  const handleReview = (courseId: string) => {
    console.log('[AfterClass] Review course:', courseId);
    Taro.navigateTo({ url: `/pages/upload/index?id=${courseId}&type=review` });
  };

  const handleViewFeedback = (courseId: string) => {
    console.log('[AfterClass] View feedback:', courseId);
    Taro.showToast({ title: '查看老师反馈', icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.id}
            className={classnames(styles.tabItem, activeTab === tab.id && styles.tabItemActive)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </View>
        ))}
      </View>

      {filteredCourses.length === 0 ? (
        <EmptyState icon="📚" text={activeTab === 'upcoming' ? '暂无待上课程' : '暂无已完成课程'} />
      ) : (
        filteredCourses.map(course => (
          <View key={course.id} className={styles.courseCard}>
            <View className={styles.cardHeader}>
              <Image className={styles.cover} src={course.cover} mode="aspectFill" />
              <View className={styles.infoWrap}>
                <Text className={styles.title}>{course.courseTitle}</Text>
                <Text className={styles.meta}>授课老师：{course.teacherName}</Text>
                <View
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(course.status) }}
                >
                  {getStatusText(course.status)}
                </View>
              </View>
            </View>

            <View className={styles.timeRow}>
              <Text className={styles.timeLabel}>上课时间：</Text>
              <Text className={styles.timeValue}>
                {course.sessionDate} {course.sessionTime}
              </Text>
            </View>

            {course.hasFeedback && (
              <View className={styles.feedbackSection}>
                <Text className={styles.feedbackLabel}>📝 老师反馈</Text>
                <Text className={styles.feedbackText}>
                  作品完成度很高，色彩搭配很棒，继续保持！下节课可以尝试更复杂的造型。
                </Text>
              </View>
            )}

            <View className={styles.actionRow}>
              {course.status === 'completed' && (
                <>
                  {course.canUpload && (
                    <Button
                      className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                      onClick={() => handleUpload(course.courseId, course.courseTitle)}
                    >
                      上传作品
                    </Button>
                  )}
                  {course.canReview && (
                    <Button
                      className={classnames(styles.actionBtn, course.canUpload ? styles.actionBtnOutline : styles.actionBtnPrimary)}
                      onClick={() => handleReview(course.courseId)}
                    >
                      提交评价
                    </Button>
                  )}
                  {course.hasFeedback && !course.canUpload && !course.canReview && (
                    <Button
                      className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                      onClick={() => handleViewFeedback(course.courseId)}
                    >
                      查看反馈
                    </Button>
                  )}
                </>
              )}
              {course.status === 'upcoming' && (
                <>
                  <Button
                    className={classnames(styles.actionBtn, styles.actionBtnOutline)}
                    onClick={() => {
                      console.log('[AfterClass] Cancel enrollment:', course.id);
                      Taro.showModal({
                        title: '取消报名',
                        content: '确定要取消这门课程的报名吗？',
                        success: (res) => {
                          if (res.confirm) {
                            Taro.showToast({ title: '已取消报名', icon: 'success' });
                          }
                        }
                      });
                    }}
                  >
                    取消报名
                  </Button>
                  <Button
                    className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                    onClick={() => {
                      console.log('[AfterClass] View course detail:', course.courseId);
                      Taro.navigateTo({ url: `/pages/detail/index?id=${course.courseId}` });
                    }}
                  >
                    查看详情
                  </Button>
                </>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
};

export default AfterClassPage;
