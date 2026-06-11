import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import { getStatusText, getStatusColor } from '@/utils';
import EmptyState from '@/components/EmptyState';

const StudentsPage: React.FC = () => {
  const router = useRouter();
  const courseId = router.params.courseId as string;
  const courseTitle = router.params.title ? decodeURIComponent(router.params.title as string) : '';

  const { courses, enrolledCourses, submitTeacherFeedback } = useApp();

  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'enrolled' | 'waitlist' | 'cancelled'>('enrolled');
  const [feedbackModal, setFeedbackModal] = useState<{ visible: boolean; enrolledId: string; studentName: string }>({ visible: false, enrolledId: '', studentName: '' });
  const [feedbackText, setFeedbackText] = useState('');

  const course = courses.find(c => c.id === courseId) || courses[0];

  const sessions = course?.sessions || [];
  const currentSessionId = activeSessionId || sessions[0]?.id || '';

  useEffect(() => {
    if (!activeSessionId && sessions.length > 0) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const sessionStudents = useMemo(() => {
    return enrolledCourses.filter(e => e.courseId === (course?.id || '') && e.sessionId === currentSessionId);
  }, [enrolledCourses, course?.id, currentSessionId]);

  const enrolledStudents = sessionStudents.filter(s => s.status === 'upcoming');
  const waitlistStudents = sessionStudents.filter(s => s.status === 'waitlist');
  const cancelledStudents = sessionStudents.filter(s => s.status === 'cancelled');

  const displayStudents =
    activeTab === 'enrolled' ? enrolledStudents :
    activeTab === 'waitlist' ? waitlistStudents : cancelledStudents;

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

  const handleViewWork = (enrolled: any) => {
    if (enrolled.workUploaded && enrolled.workImage) {
      Taro.previewImage({ urls: [enrolled.workImage] });
    } else {
      Taro.showToast({ title: '该学员暂未上传作品', icon: 'none' });
    }
  };

  const handleViewReview = (enrolled: any) => {
    if (enrolled.reviewSubmitted || enrolled.reviewContent) {
      Taro.showModal({
        title: '学员评价',
        content: `评分：${'★'.repeat(enrolled.reviewRating || 0)}${'☆'.repeat(5 - (enrolled.reviewRating || 0))}\n评价：${enrolled.reviewContent || '无'}`,
        showCancel: false
      });
    } else {
      Taro.showToast({ title: '该学员暂未提交评价', icon: 'none' });
    }
  };

  const tabs = [
    { id: 'enrolled', name: '已报名', count: enrolledStudents.length },
    { id: 'waitlist', name: '候补', count: waitlistStudents.length },
    { id: 'cancelled', name: '已取消', count: cancelledStudents.length }
  ];

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollWrap} scrollY>
        <View className={styles.header}>
          <Text className={styles.headerTitle}>{courseTitle || course?.title || '学员管理'}</Text>
          {currentSession && (
            <View className={styles.sessionOverview}>
              <Text className={styles.sessionText}>
                📅 {currentSession.date} {currentSession.time}
              </Text>
              <Text className={styles.capacityText}>
                名额 {currentSession.enrolled}/{currentSession.capacity} · 候补 {currentSession.waitlist}
              </Text>
            </View>
          )}
        </View>

        <View className={styles.sessionTabs}>
          <Text className={styles.sectionLabel}>选择场次</Text>
          <ScrollView className={styles.sessionScroll} scrollX>
            {sessions.map(s => (
              <View
                key={s.id}
                className={classnames(styles.sessionChip, currentSessionId === s.id && styles.sessionChipActive)}
                onClick={() => setActiveSessionId(s.id)}
              >
                <Text className={styles.sessionChipDate}>{s.date.slice(5)}</Text>
                <Text className={styles.sessionChipTime}>{s.time.slice(0, 5)}</Text>
                <View
                  className={styles.sessionChipStatus}
                  style={{ backgroundColor: s.enrolled >= s.capacity ? '#F53F3F' : '#00B42A' }}
                >
                  {s.enrolled}/{s.capacity}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className={styles.tabBar}>
          {tabs.map(tab => (
            <View
              key={tab.id}
              className={classnames(styles.tabItem, activeTab === tab.id && styles.tabItemActive)}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.name}
              {tab.count > 0 && <Text className={styles.tabCount}>{tab.count}</Text>}
            </View>
          ))}
        </View>

        {displayStudents.length === 0 ? (
          <EmptyState
            icon="👥"
            text={
              activeTab === 'enrolled' ? '暂无报名学员' :
              activeTab === 'waitlist' ? '暂无候补学员' : '暂无取消记录'
            }
          />
        ) : (
          displayStudents.map((enrolled, idx) => (
            <View key={enrolled.id} className={styles.studentCard}>
              <View className={styles.studentHeader}>
                <Image
                  className={styles.studentAvatar}
                  src={`https://picsum.photos/id/${100 + idx}/200/200`}
                  mode="aspectFill"
                />
                <View className={styles.studentBasic}>
                  <Text className={styles.studentName}>学员 #{idx + 1}</Text>
                  <View
                    className={styles.studentStatus}
                    style={{ backgroundColor: getStatusColor(enrolled.status) }}
                  >
                    {getStatusText(enrolled.status)}
                  </View>
                  {enrolled.status === 'waitlist' && enrolled.waitlistPosition && (
                    <Text className={styles.waitlistPos}>候补第 {enrolled.waitlistPosition} 位</Text>
                  )}
                </View>
              </View>

              <View className={styles.statusGrid}>
                <View className={classnames(styles.statusItem, enrolled.workUploaded && styles.statusItemOk)}>
                  <Text className={styles.statusIcon}>{enrolled.workUploaded ? '✅' : '⬜'}</Text>
                  <Text className={styles.statusText}>作品</Text>
                </View>
                <View className={classnames(styles.statusItem, enrolled.reviewSubmitted && styles.statusItemOk)}>
                  <Text className={styles.statusIcon}>{enrolled.reviewSubmitted ? '✅' : '⬜'}</Text>
                  <Text className={styles.statusText}>评价</Text>
                </View>
                <View className={classnames(styles.statusItem, enrolled.status === 'completed' && styles.statusItemOk)}>
                  <Text className={styles.statusIcon}>{enrolled.status === 'completed' ? '✅' : '⬜'}</Text>
                  <Text className={styles.statusText}>签到</Text>
                </View>
                <View className={classnames(styles.statusItem, enrolled.hasFeedback && styles.statusItemOk)}>
                  <Text className={styles.statusIcon}>{enrolled.hasFeedback ? '✅' : '⬜'}</Text>
                  <Text className={styles.statusText}>反馈</Text>
                </View>
              </View>

              {enrolled.hasFeedback && enrolled.feedbackContent && (
                <View className={styles.feedbackBox}>
                  <Text className={styles.feedbackLabel}>📝 我的反馈：</Text>
                  <Text className={styles.feedbackText}>{enrolled.feedbackContent}</Text>
                </View>
              )}

              <View className={styles.actionRow}>
                {(enrolled.status === 'upcoming' || enrolled.status === 'completed') && (
                  <>
                    <Button
                      className={classnames(styles.actionBtn, enrolled.workUploaded ? styles.btnPrimary : styles.btnDisabled)}
                      onClick={() => handleViewWork(enrolled)}
                    >
                      作品
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, enrolled.reviewSubmitted ? styles.btnPrimary : styles.btnDisabled)}
                      onClick={() => handleViewReview(enrolled)}
                    >
                      评价
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnHighlight)}
                      onClick={() => setFeedbackModal({ visible: true, enrolledId: enrolled.id, studentName: `学员 #${idx + 1}` })}
                    >
                      {enrolled.hasFeedback ? '修改反馈' : '写反馈'}
                    </Button>
                  </>
                )}
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

export default StudentsPage;
