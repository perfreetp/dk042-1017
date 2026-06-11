import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import { getStatusColor, getStatusText } from '@/utils';
import EmptyState from '@/components/EmptyState';

const ManagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { publishedCourses } = useApp();

  const tabs = [
    { id: 'all', name: '全部' },
    { id: 'approved', name: '已通过' },
    { id: 'pending', name: '待审核' },
    { id: 'rejected', name: '未通过' }
  ];

  const filteredCourses = activeTab === 'all'
    ? publishedCourses
    : publishedCourses.filter(c => c.status === activeTab);

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollWrap} scrollY>
        <View className={styles.header}>
          <Text className={styles.headerTitle}>我开的课</Text>
          <Text className={styles.headerSubtitle}>共 {publishedCourses.length} 门课程</Text>
        </View>

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
          <EmptyState icon="📚" text="暂无课程，快去发布新课程吧~" />
        ) : (
          filteredCourses.map(course => (
          <View key={course.id} className={styles.courseCard}>
            <Image className={styles.cover} src={course.cover} mode="aspectFill" />
            <View className={styles.courseInfo}>
              <View className={styles.titleRow}>
                <Text className={styles.courseTitle}>{course.title}</Text>
                <View
                  className={styles.statusBadge} style={{ backgroundColor: getStatusColor(course.status) }>
                  {getStatusText(course.status)}
                </View>
              </View>
              <Text className={styles.courseMeta}>
                报名进度：{course.enrolledCount}/{course.maxStudents}人
              </Text>
              <Text className={styles.courseMeta}>下次开课：{course.nextSession}</Text>
              {course.status === 'rejected' && course.rejectReason && (
                <View className={styles.rejectBox}>
                  <Text className={styles.rejectLabel}>📝 驳回原因：</Text>
                  <Text className={styles.rejectText}>{course.rejectReason}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ManagePage;
