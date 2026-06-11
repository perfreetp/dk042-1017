import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import EmptyState from '@/components/EmptyState';
import { getStatusText, getStatusColor } from '@/utils';

const AfterClassPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const { enrolledCourses, cancelEnrollment, cancelWaitlist, reviews } = useApp();

  const tabs = [
    { id: 'upcoming', name: '待上课' },
    { id: 'waitlist', name: '候补中' },
    { id: 'completed', name: '已完成' }
  ];

  const filteredCourses = enrolledCourses.filter(c => {
    if (activeTab === 'upcoming') return c.status === 'upcoming' || c.status === 'cancelled';
    if (activeTab === 'waitlist') return c.status === 'waitlist';
    return c.status === 'completed';
  });

  const handleUpload = (enrolledId: string) => {
    console.log('[AfterClass] Upload work for:', enrolledId);
    Taro.navigateTo({ url: `/pages/upload/index?id=${enrolledId}&type=work` });
  };

  const handleReview = (enrolledId: string) => {
    console.log('[AfterClass] Review course:', enrolledId);
    Taro.navigateTo({ url: `/pages/upload/index?id=${enrolledId}&type=review` });
  };

  const handleViewDetail = (courseId: string) => {
    console.log('[AfterClass] View course detail:', courseId);
    Taro.navigateTo({ url: `/pages/detail/index?id=${courseId}` });
  };

  const handleCancelEnrollment = (enrolledId: string, courseTitle: string) => {
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

  const handleCancelWaitlist = (enrolledId: string, courseTitle: string) => {
    console.log('[AfterClass] Cancel waitlist:', enrolledId);
    Taro.showModal({
      title: '取消候补',
      content: `确定要取消「${courseTitle}」的候补报名吗？`,
      confirmText: '确定取消',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          cancelWaitlist(enrolledId);
          Taro.showToast({ title: '已取消候补', icon: 'success' });
        }
      }
    });
  };

  const renderStatusTags = (course) => {
    const tags = [];
    if (course.workUploaded) {
      tags.push(<Text key="work" className={styles.submittedTagGreen}>✓ 作品已上传</Text>);
    }
    if (course.reviewSubmitted) {
      tags.push(<Text key="review" className={styles.submittedTagOrange}>✓ 评价已提交</Text>);
    }
    return tags;
  };

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollWrap} scrollY>
        <View className={styles.tabBar}>
          {tabs.map(tab => (
            <View
              key={tab.id}
              className={classnames(styles.tabItem, activeTab === tab.id && styles.tabItemActive)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
              {tab.id === 'waitlist' && enrolledCourses.filter(e => e.status === 'waitlist').length > 0 && (
                <Text className={styles.tabBadge}>
                  {enrolledCourses.filter(e => e.status === 'waitlist').length}
                </Text>
              )}
            </View>
          ))}
        </View>

        {filteredCourses.length === 0 ? (
          <EmptyState
            icon={activeTab === 'waitlist' ? '⏳' : activeTab === 'upcoming' ? '📚' : '✅'}
            text={
              activeTab === 'upcoming' ? '暂无待上课程，快去报名吧~' :
              activeTab === 'waitlist' ? '暂无候补课程，满员课程可报名候补哦~' :
              '暂无已完成课程'
            }
          />
        ) : (
          filteredCourses.map(course => {
            const isCancelled = course.status === 'cancelled';
            const isWaitlist = course.status === 'waitlist';
            const review = reviews.find(r => r.courseId === course.courseId);

            return (
              <View
                key={course.id}
                className={classnames(
                  styles.courseCard,
                  isCancelled && styles.cancelledCard,
                  isWaitlist && styles.waitlistCard
                )}
              >
                <View className={styles.cardHeader}>
                  <Image className={styles.cover} src={course.cover} mode="aspectFill" />
                  <View className={styles.infoWrap}>
                    <View className={styles.titleRow}>
                      <Text className={styles.title}>{course.courseTitle}</Text>
                      {renderStatusTags(course)}
                    </View>
                    <Text className={styles.meta}>授课老师：{course.teacherName}</Text>
                  </View>
                  {isCancelled ? (
                    <View className={styles.cancelledTag}>已取消</View>
                  ) : isWaitlist ? (
                    <View className={styles.waitlistBadge}>
                      第{course.waitlistPosition}位
                    </View>
                  ) : (
                    <View
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(course.status) }}
                    >
                      {getStatusText(course.status)}
                    </View>
                  )}
                </View>

                <View className={styles.timeRow}>
                  <Text className={styles.timeLabel}>
                    {isWaitlist ? '候补场次：' : '上课时间：'}
                  </Text>
                  <Text className={styles.timeValue}>
                    {course.sessionDate} {course.sessionTime}
                  </Text>
                </View>

                {isWaitlist && (
                  <View className={styles.waitlistInfo}>
                    <Text className={styles.waitlistText}>
                      ⏳ 您正在候补该课程，当前排在第 <Text style={{ color: '#FF6B35', fontWeight: 'bold' }}>{course.waitlistPosition}</Text> 位，
                      有学员取消时会自动为您转正并发送通知。
                    </Text>
                  </View>
                )}

                {course.workImage && (
                  <View className={styles.workSection}>
                    <Text className={styles.workLabel}>🎨 我的作品</Text>
                    <Image className={styles.workImage} src={course.workImage} mode="aspectFill" />
                  </View>
                )}

                {(course.reviewSubmitted || review) && (
                  <View className={styles.workSection}>
                    <Text className={styles.workLabel}>⭐ 我的评价</Text>
                    <View style={{ fontSize: '28rpx', color: '#4E5969' }}>
                      <Text style={{ color: '#FFB300' }}>
                        {'★'.repeat(course.reviewRating || review?.rating || 0)}
                        {'☆'.repeat(5 - (course.reviewRating || review?.rating || 0))}
                      </Text>
                      <Text>{course.reviewContent || review?.content || ''}</Text>
                    </View>
                  </View>
                )}

                {course.hasFeedback && (
                  <View className={styles.feedbackSection}>
                    <Text className={styles.feedbackLabel}>📝 老师反馈</Text>
                    <Text className={styles.feedbackText}>
                      {course.feedbackContent || '作品完成度很高，色彩搭配很棒，继续保持！'}
                    </Text>
                  </View>
                )}

                <View className={styles.actionRow}>
                  {course.status === 'completed' && !isCancelled && (
                    <>
                      {!course.workUploaded && (
                        <Button
                          className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                          onClick={() => handleUpload(course.id)}
                        >
                          上传作品
                        </Button>
                      )}
                      {!course.reviewSubmitted && (
                        <Button
                          className={classnames(
                            styles.actionBtn,
                            !course.workUploaded ? styles.actionBtnOutline : styles.actionBtnPrimary
                          )}
                          onClick={() => handleReview(course.id)}
                        >
                          提交评价
                        </Button>
                      )}
                      {course.workUploaded && course.reviewSubmitted && (
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
                        onClick={() => handleCancelEnrollment(course.id, course.courseTitle)}
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
                  {isWaitlist && (
                    <>
                      <Button
                        className={classnames(styles.actionBtn, styles.actionBtnOutline)}
                        onClick={() => handleCancelWaitlist(course.id, course.courseTitle)}
                      >
                        取消候补
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
      </ScrollView>
    </View>
  );
};

export default AfterClassPage;
