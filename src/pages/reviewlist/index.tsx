import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import EmptyState from '@/components/EmptyState';

const ReviewListPage: React.FC = () => {
  const router = useRouter();
  const courseId = router.params.courseId as string;
  const courseTitle = router.params.title ? decodeURIComponent(router.params.title as string) : '';
  const hasFixedCourse = !!courseId;

  const { courses, enrolledCourses, submitTeacherFeedback } = useApp();

  const [activeCourseId, setActiveCourseId] = useState<string>(courseId || '');
  const [activeTab, setActiveTab] = useState<'work' | 'review'>('work');
  const [feedbackModal, setFeedbackModal] = useState<{ visible: boolean; enrolledId: string; studentName: string }>({ visible: false, enrolledId: '', studentName: '' });
  const [feedbackText, setFeedbackText] = useState('');

  const currentCourse = courses.find(c => c.id === activeCourseId);

  // 获取有作品或评价的课程（用来筛选下拉）
  const coursesWithContent = useMemo(() => {
    return courses.filter(c => {
      const list = enrolledCourses.filter(e => e.courseId === c.id);
      return list.some(e => e.workUploaded || e.reviewSubmitted);
    });
  }, [courses, enrolledCourses]);

  // 如果没有指定课程且有内容的课程存在，默认选第一个
  useEffect(() => {
    if (!hasFixedCourse && !activeCourseId && coursesWithContent.length > 0) {
      setActiveCourseId(coursesWithContent[0].id);
    }
  }, [hasFixedCourse, activeCourseId, coursesWithContent]);

  // 当前课程的作品/评价
  const allEntries = useMemo(() => {
    if (!activeCourseId) return [];
    const list = enrolledCourses.filter(e => e.courseId === activeCourseId);
    if (activeTab === 'work') {
      return list.filter(e => e.workUploaded);
    }
    return list.filter(e => e.reviewSubmitted);
  }, [enrolledCourses, activeCourseId, activeTab]);

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Taro.showToast({ title: '请填写反馈内容', icon: 'none' });
      return;
    }
    submitTeacherFeedback(feedbackModal.enrolledId, feedbackText.trim());
    setFeedbackModal({ visible: false, enrolledId: '', studentName: '' });
    setFeedbackText('');
    Taro.showToast({ title: '反馈已发送', icon: 'success' });
  };

  const handleViewImage = (url: string) => {
    Taro.previewImage({ urls: [url] });
  };

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollWrap} scrollY>
        <View className={styles.header}>
          <Text className={styles.headerTitle}>
            {courseTitle ? `${courseTitle} · ` : ''}
            {activeTab === 'work' ? '作品管理' : '评价管理'}
          </Text>
        </View>

        {!courseId && (
          <View className={styles.coursePicker}>
            <Text className={styles.sectionLabel}>选择课程</Text>
            <ScrollView className={styles.courseScroll} scrollX>
              {coursesWithContent.length === 0 ? (
                <Text className={styles.noContentText}>暂无有作品/评价的课程</Text>
              ) : (
                coursesWithContent.map(c => (
                  <View
                    key={c.id}
                    className={classnames(styles.courseChip, activeCourseId === c.id && styles.courseChipActive)}
                    onClick={() => setActiveCourseId(c.id)}
                  >
                    <Image className={styles.courseChipImg} src={c.cover} mode="aspectFill" />
                    <Text className={styles.courseChipTitle}>{c.title}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        )}

        <View className={styles.tabBar}>
          <View
            className={classnames(styles.tabItem, activeTab === 'work' && styles.tabItemActive)}
            onClick={() => setActiveTab('work')}
          >
            🎨 作品
            <Text className={styles.tabCount}>
              {enrolledCourses.filter(e => e.courseId === activeCourseId && e.workUploaded).length}
            </Text>
          </View>
          <View
            className={classnames(styles.tabItem, activeTab === 'review' && styles.tabItemActive)}
            onClick={() => setActiveTab('review')}
          >
            ⭐ 评价
            <Text className={styles.tabCount}>
              {enrolledCourses.filter(e => e.courseId === activeCourseId && e.reviewSubmitted).length}
            </Text>
          </View>
        </View>

        {currentCourse && (
          <View className={styles.courseInfoBar}>
            <Image className={styles.courseThumb} src={currentCourse.cover} mode="aspectFill" />
            <View className={styles.courseInfo}>
              <Text className={styles.courseTitle}>{currentCourse.title}</Text>
              <Text className={styles.courseMeta}>老师：{currentCourse.teacher.name}</Text>
            </View>
          </View>
        )}

        {allEntries.length === 0 ? (
          <EmptyState
            icon={activeTab === 'work' ? '🎨' : '⭐'}
            text={activeTab === 'work' ? '暂无学员上传作品' : '暂无学员提交评价'}
          />
        ) : (
          allEntries.map((enrolled, idx) => (
            <View key={enrolled.id} className={styles.entryCard}>
              <View className={styles.entryHeader}>
                <Image
                  className={styles.studentAvatar}
                  src={`https://picsum.photos/id/${100 + idx}/200/200`}
                  mode="aspectFill"
                />
                <View className={styles.entryInfo}>
                  <Text className={styles.studentName}>{enrolled.studentName}</Text>
                  <Text className={styles.entryTime}>
                    {enrolled.sessionDate} {enrolled.sessionTime}
                  </Text>
                </View>
              </View>

              {activeTab === 'work' && enrolled.workImage && (
                <View
                  className={styles.workImageWrap}
                  onClick={() => handleViewImage(enrolled.workImage!)}
                >
                  <Image className={styles.workImage} src={enrolled.workImage} mode="aspectFill" />
                  <View className={styles.workOverlay}>
                    <Text className={styles.overlayText}>点击查看大图</Text>
                  </View>
                </View>
              )}

              {activeTab === 'review' && (
                <View className={styles.reviewContent}>
                  <View className={styles.reviewRating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Text
                        key={i}
                        className={classnames(
                          styles.star,
                          i < (enrolled.reviewRating || 0) && styles.starActive
                        )}
                      >
                        ★
                      </Text>
                    ))}
                    <Text className={styles.ratingNum}>{enrolled.reviewRating || 0}.0</Text>
                  </View>
                  <Text className={styles.reviewText}>
                    {enrolled.reviewContent || '（无文字评价）'}
                  </Text>
                </View>
              )}

              {enrolled.hasFeedback && enrolled.feedbackContent && (
                <View className={styles.feedbackBox}>
                  <Text className={styles.feedbackLabel}>📝 我的反馈：</Text>
                  <Text className={styles.feedbackText}>{enrolled.feedbackContent}</Text>
                </View>
              )}

              <View className={styles.entryFooter}>
                <Button
                  className={classnames(styles.feedbackBtn, enrolled.hasFeedback ? styles.btnOutline : styles.btnPrimary)}
                  onClick={() => {
                    setFeedbackText(enrolled.feedbackContent || '');
                    setFeedbackModal({
                      visible: true,
                      enrolledId: enrolled.id,
                      studentName: enrolled.studentName
                    });
                  }}
                >
                  {enrolled.hasFeedback ? '修改反馈' : '写反馈'}
                </Button>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {feedbackModal.visible && (
        <View className={styles.modalMask} onClick={() => setFeedbackModal({ visible: false, enrolledId: '', studentName: '' })}>
          <View className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>给 {feedbackModal.studentName} 写反馈</Text>
            <Textarea
              className={styles.modalTextarea}
              placeholder="请输入反馈内容，如：作品完成度很高，色彩搭配很棒..."
              value={feedbackText}
              onInput={(e) => setFeedbackText(e.detail.value)}
            />
            <View className={styles.modalActions}>
              <Button
                className={classnames(styles.modalBtn, styles.modalBtnCancel)}
                onClick={() => setFeedbackModal({ visible: false, enrolledId: '', studentName: '' })}
              >
                取消
              </Button>
              <Button
                className={classnames(styles.modalBtn, styles.modalBtnConfirm)}
                onClick={handleSubmitFeedback}
              >
                发送反馈
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ReviewListPage;
