import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import EmptyState from '@/components/EmptyState';
import { getStatusText, getStatusColor } from '@/utils';

const AfterClassPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const { enrolledCourses, cancelEnrollment, reviews } = useApp();

  const tabs = [
    { id: 'upcoming', name: '待上课' },
    { id: 'completed', name: '已完成' }
  ];

  const filteredCourses = enrolledCourses.filter(c => {
    if (activeTab === 'upcoming') return c.status === 'upcoming' || c.status === 'cancelled';
    return c.status === 'completed';
  });

  const handleUpload = (courseId: string) => {
    console.log('[AfterClass] Upload work for:', courseId);
    Taro.navigateTo({ url: `/pages/upload/index?id=${courseId}&type=work` });
  };

  const handleReview = (courseId: string) => {
    console.log('[AfterClass] Review course:', courseId);
    Taro.navigateTo({ url: `/pages/upload/index?id=${courseId}&type=review` });
  };

  const handleViewFeedback = (courseId: string) => {
    console.log('[AfterClass] View feedback:', courseId);
    const review = reviews.find(r => r.courseId === courseId);
    if (review) {
      Taro.showModal({
        title: '您的评价',
        content: `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}\n${review.content}`,
        showCancel: false
      });
    } else {
      Taro.showToast({ title: '暂无反馈', icon: 'none' });
    }
  };

  const handleCancel = (enrolledId: string, courseTitle: string) => {
    console.log('[AfterClass] Cancel enrollment:', enrolledId);
    Taro.showModal({
      title: '取消报名',
      content: `确定要取消「${courseTitle}」的报名吗？`,
      confirmText: '确定取消',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          cancelEnrollment(enrolledId);
          Taro.showToast({ title: '已取消报名', icon: 'success' });
        }
      }
    });
  };

  const handleViewDetail = (courseId: string) => {
    console.log('[AfterClass] View course detail:', courseId);
    Taro.navigateTo({ url: `/pages/detail/index?id=${courseId}` });
  };

  const getReviewOfCourse = (courseId: string) => {
    return reviews.find(r => r.courseId === courseId);
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
        <EmptyState 
          icon="📚" 
          text={activeTab === 'upcoming' ? '暂无待上课程，快去报名吧~' : '暂无已完成课程'} 
        />
      ) : (
        filteredCourses.map(course => {
          const isCancelled = course.status === 'cancelled';
          const review = getReviewOfCourse(course.courseId);
          const hasSubmitted = !course.canUpload && !course.canReview;

          return (
            <View 
              key={course.id} 
              className={classnames(styles.courseCard, isCancelled && styles.cancelledCard)}
            >
              <View className={styles.cardHeader}>
                <Image className={styles.cover} src={course.cover} mode="aspectFill" />
                <View className={styles.infoWrap}>
                  <View>
                    <Text className={styles.title}>
                      {course.courseTitle}
                      {hasSubmitted && course.status === 'completed' && (
                        <Text className={styles.submittedTag}>✓ 已提交</Text>
                      )}
                    </Text>
                    <Text className={styles.meta}>授课老师：{course.teacherName}</Text>
                  </View>
                  {isCancelled ? (
                    <View className={styles.cancelledTag}>已取消</View>
                  ) : (
                    <View
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(course.status) }}
                    >
                      {getStatusText(course.status)}
                    </View>
                  )}
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

              {review && (
                <View className={styles.workSection}>
                  <Text className={styles.workLabel}>⭐ 我的评价</Text>
                  <Text style={{ fontSize: '28rpx', color: '#4E5969' }}>
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                    {' '}
                    {review.content}
                  </Text>
                </View>
              )}

              <View className={styles.actionRow}>
                {course.status === 'completed' && !isCancelled && (
                  <>
                    {course.canUpload && (
                      <Button
                        className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                        onClick={() => handleUpload(course.courseId)}
                      >
                        上传作品
                      </Button>
                    )}
                    {course.canReview && (
                      <Button
                        className={classnames(
                          styles.actionBtn, 
                          course.canUpload ? styles.actionBtnOutline : styles.actionBtnPrimary
                        )}
                        onClick={() => handleReview(course.courseId)}
                      >
                        提交评价
                      </Button>
                    )}
                    {!course.canUpload && !course.canReview && course.hasFeedback && (
                      <>
                        <Button
                          className={classnames(styles.actionBtn, styles.actionBtnOutline)}
                          onClick={() => handleViewFeedback(course.courseId)}
                        >
                          查看评价
                        </Button>
                        <Button
                          className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                          onClick={() => handleViewDetail(course.courseId)}
                        >
                          课程详情
                        </Button>
                      </>
                    )}
                    {!course.canUpload && !course.canReview && !course.hasFeedback && (
                      <Button
                        className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                        onClick={() => handleViewDetail(course.courseId)}
                      >
                        课程详情
                      </Button>
                    )}
                  </>
                )}
                {course.status === 'upcoming' && !isCancelled && (
                  <>
                    <Button
                      className={classnames(styles.actionBtn, styles.actionBtnOutline)}
                      onClick={() => handleCancel(course.id, course.courseTitle)}
                    >
                      取消报名
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                      onClick={() => handleViewDetail(course.courseId)}
                    >
                      查看详情
                    </Button>
                  </>
                )}
                {isCancelled && (
                  <Button
                    className={classnames(styles.actionBtn, styles.actionBtnOutline)}
                    onClick={() => handleViewDetail(course.courseId)}
                  >
                    重新报名
                  </Button>
                )}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
};

export default AfterClassPage;
