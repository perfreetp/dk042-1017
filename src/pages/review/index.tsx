import React, { useState } from 'react';
import { View, Text, Image, Button, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import { getStatusColor, getStatusText } from '@/utils';
import EmptyState from '@/components/EmptyState';

const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const { publishedCourses, reviewCourse } = useApp();

  const tabs = [
    { id: 'pending', name: '待审核' },
    { id: 'approved', name: '已通过' },
    { id: 'rejected', name: '未通过' }
  ];

  const filteredCourses = publishedCourses.filter(c => c.status === activeTab);

  const handleApprove = (courseId: string, courseTitle: string) => {
    Taro.showModal({
      title: '审核通过',
      content: `确定要通过「${courseTitle}」的审核吗？`,
      confirmText: '通过',
      success: (res) => {
        if (res.confirm) {
          reviewCourse(courseId, 'approve');
          Taro.showToast({ title: '已通过审核', icon: 'success' });
        }
      }
    });
  };

  const handleReject = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      Taro.showToast({ title: '请填写驳回原因', icon: 'none' });
      return;
    }
    if (selectedCourse) {
      reviewCourse(selectedCourse, 'reject');
      Taro.showToast({ title: '已驳回', icon: 'success' });
      setSelectedCourse(null);
      setRejectReason('');
    }
  };

  const cancelReject = () => {
    setSelectedCourse(null);
    setRejectReason('');
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

      {activeTab === 'pending' && selectedCourse && (
        <View className={styles.reviewSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📝</Text>
            填写驳回原因
          </Text>
          <Textarea
            className={styles.rejectReason}
            placeholder="请填写驳回原因，方便老师了解问题并修改..."
            value={rejectReason}
            onInput={(e) => setRejectReason(e.detail.value)}
            maxLength={200}
          />
          <View className={styles.actionRow}>
            <Button
              className={classnames(styles.actionBtn, styles.actionBtnReject)}
              onClick={cancelReject}
            >
              取消
            </Button>
            <Button
              className={classnames(styles.actionBtn, styles.actionBtnApprove)}
              onClick={confirmReject}
            >
              确认驳回
            </Button>
          </View>
        </View>
      )}

      {filteredCourses.length === 0 ? (
        <EmptyState 
          icon="📋" 
          text={
            activeTab === 'pending' ? '暂无待审核课程' : 
            activeTab === 'approved' ? '暂无已通过课程' : '暂无未通过课程'
          } 
        />
      ) : (
        filteredCourses.map(course => (
          <View key={course.id} className={styles.courseCard}>
            <Image className={styles.cover} src={course.cover} mode="aspectFill" />
            <View className={styles.courseInfo}>
              <Text className={styles.courseTitle}>{course.title}</Text>
              <Text className={styles.courseMeta}>
                报名：{course.enrolledCount}/{course.maxStudents}人
              </Text>
              <Text className={styles.courseMeta}>
                下次课：{course.nextSession}
              </Text>
              <View
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(course.status) }}
              >
                {getStatusText(course.status)}
              </View>
              {course.status === 'pending' && !selectedCourse && (
                <View className={styles.actionRow}>
                  <Button
                    className={classnames(styles.actionBtn, styles.actionBtnReject)}
                    onClick={() => handleReject(course.id)}
                  >
                    驳回
                  </Button>
                  <Button
                    className={classnames(styles.actionBtn, styles.actionBtnApprove)}
                    onClick={() => handleApprove(course.id, course.title)}
                  >
                    通过
                  </Button>
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
};

export default ReviewPage;
