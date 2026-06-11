import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import { getStatusText, getStatusColor } from '@/utils';

const PublishPage: React.FC = () => {
  const { publishedCourses, user } = useApp();

  const handlePublish = () => {
    console.log('[Publish] Click publish course');
    if (!user.certified) {
      Taro.showModal({
        title: '尚未认证资质',
        content: '发布课程前请先完成老师资质认证，是否前往认证？',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: '/pages/certify/index' });
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
    Taro.navigateTo({ url: '/pages/certify/index' });
  };

  const handleViewStudents = (courseId: string, courseTitle: string) => {
    console.log('[Publish] View students:', courseId);
    Taro.navigateTo({ url: `/pages/students/index?courseId=${courseId}&title=${encodeURIComponent(courseTitle)}` });
  };

  const handleViewReviews = (courseId: string, courseTitle: string) => {
    console.log('[Publish] View reviews:', courseId);
    Taro.navigateTo({ url: `/pages/reviewlist/index?courseId=${courseId}&title=${encodeURIComponent(courseTitle)}` });
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
            {user.certified ? '✅' : '📋'}
          </Text>
          <Text className={styles.statusText}>
            {user.certified ? '已完成老师资质认证' : '尚未完成老师资质认证'}
          </Text>
          {!user.certified && (
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
            <View key={course.id} className={classnames(styles.myCourseCard, course.status === 'rejected' && styles.rejectedCard)}>
              <Image className={styles.cover} src={course.cover} mode="aspectFill" />
              <View className={styles.courseInfo}>
                <Text className={styles.courseTitle}>{course.title}</Text>
                <Text className={styles.courseMeta}>
                  报名：{course.enrolledCount}/{course.maxStudents}人
                </Text>
                <Text className={styles.courseMeta}>
                  下次课：{course.nextSession}
                </Text>
                {course.status === 'rejected' && course.rejectReason && (
                  <View className={styles.rejectBox}>
                    <Text className={styles.rejectLabel}>📝 驳回原因：</Text>
                    <Text className={styles.rejectText}>{course.rejectReason}</Text>
                  </View>
                )}
                <View className={styles.courseFooter}>
                  <View
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(course.status) }}
                  >
                    {getStatusText(course.status)}
                  </View>
                  <View className={styles.actionBtns}>
                    {course.status === 'approved' && (
                      <>
                        <Button
                          className={styles.secondaryBtn}
                          onClick={() => handleViewStudents(course.id, course.title)}
                        >
                          学员
                        </Button>
                        <Button
                          className={styles.secondaryBtn}
                          onClick={() => handleViewReviews(course.id, course.title)}
                        >
                          评价
                        </Button>
                      </>
                    )}
                    <Button className={styles.manageBtn} onClick={() => handleManage(course.id)}>
                      管理
                    </Button>
                  </View>
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
