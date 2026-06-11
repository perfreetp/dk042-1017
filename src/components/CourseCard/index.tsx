import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Course } from '@/types';
import { getStatusText, getStatusColor } from '@/utils';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({ url: `/pages/detail/index?id=${course.id}` });
    }
  };

  const progress = Math.round((course.enrolledCount / course.maxStudents) * 100);

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrap}>
        <Image className={styles.cover} src={course.cover} mode="aspectFill" />
        <View className={styles.categoryTag}>{course.categoryName}</View>
        <View 
          className={styles.statusTag}
          style={{ backgroundColor: getStatusColor(course.status) }}
        >
          {getStatusText(course.status)}
        </View>
      </View>
      <View className={styles.content}>
        <Text className={styles.title}>{course.title}</Text>
        <View className={styles.teacherRow}>
          <Image className={styles.teacherAvatar} src={course.teacher.avatar} mode="aspectFill" />
          <Text className={styles.teacherName}>{course.teacher.name}</Text>
          {course.teacher.certified && (
            <View className={styles.certifiedBadge}>认证</View>
          )}
          <Text className={styles.rating}>⭐ {course.rating}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.location}>📍 {course.location}</Text>
        </View>
        <View className={styles.footer}>
          <View className={styles.progressWrap}>
            <View className={styles.progressBar}>
              <View className={styles.progressFill} style={{ width: `${progress}%` }} />
            </View>
            <Text className={styles.progressText}>
              {course.enrolledCount}/{course.maxStudents}人
            </Text>
          </View>
          <View className={styles.feeWrap}>
            {course.materialFee > 0 ? (
              <Text className={styles.fee}>材料费 ¥{course.materialFee}</Text>
            ) : (
              <Text className={styles.free}>免费</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CourseCard;
