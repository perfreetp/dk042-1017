import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input, Textarea, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import { formatDate } from '@/utils';

const EnrollPage: React.FC = () => {
  const router = useRouter();
  const courseId = router.params.id;
  const { courses, enrollCourse } = useApp();
  
  const [course, setCourse] = useState(courses.find(c => c.id === courseId));
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [remark, setRemark] = useState('');
  const [isWaitlist, setIsWaitlist] = useState(false);

  useEffect(() => {
    const found = courses.find(c => c.id === courseId);
    setCourse(found);
    if (found && found.sessions.length > 0) {
      const availableSession = found.sessions.find(s => s.enrolled < s.capacity);
      if (availableSession) {
        setSelectedSession(availableSession.id);
        setIsWaitlist(false);
      } else if (found.sessions.length > 0) {
        setSelectedSession(found.sessions[0].id);
        setIsWaitlist(true);
      }
    }
  }, [courses, courseId]);

  useEffect(() => {
    if (course && selectedSession) {
      const session = course.sessions.find(s => s.id === selectedSession);
      if (session) {
        setIsWaitlist(session.enrolled >= session.capacity);
      }
    }
  }, [selectedSession, course]);

  if (!course) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx 0', textAlign: 'center' }}>
          <Text style={{ fontSize: '80rpx' }}>🤔</Text>
          <Text style={{ display: 'block', marginTop: '24rpx', color: '#86909C' }}>课程不存在</Text>
        </View>
      </View>
    );
  }

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
  };

  const handleSubmit = () => {
    if (!selectedSession) {
      Taro.showToast({ title: '请选择场次', icon: 'none' });
      return;
    }
    if (!studentName.trim()) {
      Taro.showToast({ title: '请输入学员姓名', icon: 'none' });
      return;
    }
    if (!phone.trim()) {
      Taro.showToast({ title: '请输入联系方式', icon: 'none' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    console.log('[Enroll] Submit enrollment:', { courseId, selectedSession, studentName, phone, isWaitlist });
    
    const success = enrollCourse(course.id, selectedSession, studentName, phone, isWaitlist);
    
    if (success) {
      Taro.showToast({ 
        title: isWaitlist ? '候补报名成功' : '报名成功', 
        icon: 'success' 
      });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/afterclass/index' });
      }, 1500);
    } else {
      Taro.showToast({ title: '报名失败，请重试', icon: 'none' });
    }
  };

  const selectedSessionData = course.sessions.find(s => s.id === selectedSession);
  const allFull = course.sessions.every(s => s.enrolled >= s.capacity);

  return (
    <View className={styles.page}>
      <View className={styles.courseHeader}>
        <Image className={styles.cover} src={course.cover} mode="aspectFill" />
        <View className={styles.courseInfo}>
          <Text className={styles.courseTitle}>{course.title}</Text>
          <Text className={styles.courseTeacher}>�‍🏫 {course.teacher.name}</Text>
          <Text className={classnames(styles.courseFee, course.materialFee === 0 && styles.freeFee)}>
            {course.materialFee > 0 ? `材料费 ¥${course.materialFee}` : '免费课程'}
          </Text>
        </View>
      </View>

      {(allFull || isWaitlist) && (
        <View className={styles.waitlistTip}>
          <Text className={styles.waitlistIcon}>💡</Text>
          <Text className={styles.waitlistText}>
            当前场次已满员，您可以选择候补报名。如有人取消报名，系统将按候补顺序依次通知您。
          </Text>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📅</Text>
          选择场次
        </Text>
        <View className={styles.sessionList}>
          {course.sessions.map(session => {
            const isFull = session.enrolled >= session.capacity;
            const isActive = selectedSession === session.id;
            return (
              <View
                key={session.id}
                className={classnames(
                  styles.sessionItem,
                  isActive && styles.sessionItemActive,
                )}
                onClick={() => handleSessionSelect(session.id)}
              >
                <View className={styles.sessionLeft}>
                  <Text className={styles.sessionDate}>{formatDate(session.date)}</Text>
                  <Text className={styles.sessionTime}>🕐 {session.time}</Text>
                </View>
                <View className={styles.sessionRight}>
                  <Text className={styles.sessionCount}>
                    {session.enrolled}/{session.capacity}人
                  </Text>
                  <Text className={classnames(
                    styles.sessionStatus,
                    isFull ? styles.statusHot : styles.statusOk
                  )}>
                    {isFull ? '已满员' : '有位置'}
                  </Text>
                </View>
                {isActive && (
                  <Text className={styles.checkIcon}>✅</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📝</Text>
          学员信息
        </Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>
            学员姓名
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入学员姓名"
            value={studentName}
            onInput={(e) => setStudentName(e.detail.value)}
            maxLength={20}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>
            联系电话
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入手机号码"
            type="number"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
            maxLength={11}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            备注信息（选填）
          </Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="如有特殊需求或注意事项请在此说明..."
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
            maxLength={200}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.submitBtn, !selectedSession && styles.submitBtnDisabled)}
          onClick={handleSubmit}
        >
          {isWaitlist ? '确认候补报名' : '确认报名'}
        </Button>
      </View>
    </View>
  );
};

export default EnrollPage;
