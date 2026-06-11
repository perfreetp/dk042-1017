import React, { useState } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import EmptyState from '@/components/EmptyState';

const CheckInPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('student');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const { checkInRecords, studentCheckIn, teacherSessions, teacherCheckInStudent } = useApp();

  const tabs = [
    { id: 'student', name: '学员签到' },
    { id: 'teacher', name: '老师核销' }
  ];

  const pendingRecords = checkInRecords.filter(r => !r.checkedIn);
  const doneRecords = checkInRecords.filter(r => r.checkedIn);

  const handleStudentCheckIn = (recordId: string, courseTitle: string) => {
    Taro.showModal({
      title: '确认签到',
      content: `确定要签到「${courseTitle}」吗？`,
      success: (res) => {
        if (res.confirm) {
          studentCheckIn(recordId);
          Taro.showToast({ title: '签到成功 +10积分', icon: 'success' });
        }
      }
    });
  };

  const handleScanCode = () => {
    console.log('[CheckIn] Scan QR code');
    Taro.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log('[CheckIn] Scan result:', res.result);
        if (selectedSession) {
          const session = teacherSessions.find(s => s.id === selectedSession);
          const unchecked = session?.students.find(st => !st.checkedIn);
          if (unchecked) {
            teacherCheckInStudent(selectedSession, unchecked.id);
            Taro.showToast({ title: `已核销：${unchecked.name}`, icon: 'success' });
          } else {
            Taro.showToast({ title: '没有待核销学员', icon: 'none' });
          }
        } else {
          Taro.showToast({ title: '请先选择课程场次', icon: 'none' });
        }
      },
      fail: () => {
        if (selectedSession) {
          const session = teacherSessions.find(s => s.id === selectedSession);
          const unchecked = session?.students.find(st => !st.checkedIn);
          if (unchecked) {
            teacherCheckInStudent(selectedSession, unchecked.id);
            Taro.showToast({ title: `扫码核销成功：${unchecked.name}`, icon: 'success' });
          } else {
            Taro.showToast({ title: '没有待核销学员', icon: 'none' });
          }
        } else {
          Taro.showToast({ title: '请先选择课程场次', icon: 'none' });
        }
      }
    });
  };

  const handleManualCheckIn = (sessionId: string, studentId: string, studentName: string) => {
    Taro.showModal({
      title: '确认核销',
      content: `确定核销学员「${studentName}」吗？`,
      success: (res) => {
        if (res.confirm) {
          teacherCheckInStudent(sessionId, studentId);
          Taro.showToast({ title: '核销成功', icon: 'success' });
        }
      }
    });
  };

  const currentSession = selectedSession
    ? teacherSessions.find(s => s.id === selectedSession)
    : teacherSessions[0];

  const uncheckedStudents = currentSession?.students.filter(s => !s.checkedIn) || [];
  const checkedStudents = currentSession?.students.filter(s => s.checkedIn) || [];

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

      {activeTab === 'student' && (
        <ScrollView className={styles.scrollWrap} scrollY>
          {pendingRecords.length > 0 && (
            <>
              <Text style={{
                fontSize: '28rpx',
                color: '#4E5969',
                marginBottom: '16rpx',
                fontWeight: '500'
              }}>
                待签到 ({pendingRecords.length})
              </Text>
              {pendingRecords.map(record => (
                <View key={record.id} className={styles.checkinCard}>
                  <View className={styles.cardHeader}>
                    <Text className={styles.courseTitle}>{record.courseTitle}</Text>
                    <View
                      className={styles.statusBadge}
                      style={{ backgroundColor: '#FF7D00' }}
                    >
                      待签到
                    </View>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>上课日期</Text>
                    <Text className={styles.infoValue}>{record.date}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>上课时间</Text>
                    <Text className={styles.infoValue}>{record.time}</Text>
                  </View>
                  <View className={styles.actionRow}>
                    <Button
                      className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                      onClick={() => handleStudentCheckIn(record.id, record.courseTitle)}
                    >
                      立即签到
                    </Button>
                  </View>
                </View>
              ))}
            </>
          )}

          {doneRecords.length > 0 && (
            <>
              <Text style={{
                fontSize: '28rpx',
                color: '#4E5969',
                marginBottom: '16rpx',
                marginTop: '24rpx',
                fontWeight: '500'
              }}>
                已签到 ({doneRecords.length})
              </Text>
              {doneRecords.map(record => (
                <View key={record.id} className={styles.checkinCard}>
                  <View className={styles.cardHeader}>
                    <Text className={styles.courseTitle}>{record.courseTitle}</Text>
                    <View
                      className={styles.statusBadge}
                      style={{ backgroundColor: '#00B42A' }}
                    >
                      已签到
                    </View>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>上课日期</Text>
                    <Text className={styles.infoValue}>{record.date}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>上课时间</Text>
                    <Text className={styles.infoValue}>{record.time}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>签到时间</Text>
                    <Text className={styles.infoValue}>{record.checkedAt}</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {checkInRecords.length === 0 && (
            <EmptyState icon="📋" text="暂无签到记录" />
          )}
        </ScrollView>
      )}

      {activeTab === 'teacher' && (
        <ScrollView className={styles.scrollWrap} scrollY>
          <View className={styles.sessionTabs}>
            <Text style={{
              fontSize: '28rpx',
              color: '#4E5969',
              marginBottom: '16rpx',
              fontWeight: '500'
            }}>
              选择课程场次
            </Text>
            <View className={styles.sessionList}>
              {teacherSessions.map(session => {
                const checked = session.students.filter(s => s.checkedIn).length;
                const total = session.students.length;
                return (
                  <View
                    key={session.id}
                    className={classnames(
                      styles.sessionItem,
                      currentSession?.id === session.id && styles.sessionItemActive
                    )}
                    onClick={() => {
                      setSelectedSession(session.id);
                    }}
                  >
                    <View className={styles.sessionInfo}>
                      <Text className={styles.sessionTitle}>{session.courseTitle}</Text>
                      <Text className={styles.sessionMeta}>
                        {session.date} {session.time}
                      </Text>
                      <Text className={styles.sessionMeta}>📍 {session.location}</Text>
                    </View>
                    <View className={styles.sessionProgress}>
                      <Text className={styles.progressValue}>
                        <Text style={{ color: '#00B42A', fontWeight: 'bold' }}>{checked}</Text>
                        <Text style={{ color: '#86909C' }}>/{total}</Text>
                      </Text>
                      <Text className={styles.progressLabel}>已核销</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {currentSession && (
            <>
              <View className={styles.qrcodeSection}>
                <Text className={styles.qrcodeTitle}>扫码核销</Text>
                <View className={styles.qrcode}>
                  <Text className={styles.qrcodeIcon}>📱</Text>
                </View>
                <Text className={styles.qrcodeDesc}>
                  请学员扫描二维码进行签到{'\n'}
                  或在下方列表中手动核销
                </Text>
                <Button
                  className={classnames(styles.scanBtn, styles.actionBtnPrimary)}
                  onClick={handleScanCode}
                >
                  扫码核销
                </Button>
              </View>

              {uncheckedStudents.length > 0 && (
                <View className={styles.studentSection}>
                  <Text style={{
                    fontSize: '28rpx',
                    color: '#4E5969',
                    marginBottom: '16rpx',
                    fontWeight: '500'
                  }}>
                    待核销 ({uncheckedStudents.length})
                  </Text>
                  {uncheckedStudents.map(student => (
                    <View key={student.id} className={styles.studentCard}>
                      <Image className={styles.studentAvatar} src={student.avatar} mode="aspectFill" />
                      <View className={styles.studentInfo}>
                        <Text className={styles.studentName}>{student.name}</Text>
                        <Text className={styles.studentStatus}>等待签到</Text>
                      </View>
                      <Button
                        className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                        onClick={() => handleManualCheckIn(currentSession.id, student.id, student.name)}
                      >
                        核销
                      </Button>
                    </View>
                  ))}
                </View>
              )}

              {checkedStudents.length > 0 && (
                <View className={styles.studentSection}>
                  <Text style={{
                    fontSize: '28rpx',
                    color: '#4E5969',
                    marginBottom: '16rpx',
                    marginTop: '8rpx',
                    fontWeight: '500'
                  }}>
                    已核销 ({checkedStudents.length})
                  </Text>
                  {checkedStudents.map(student => (
                    <View key={student.id} className={classnames(styles.studentCard, styles.studentCardDone)}>
                      <Image className={styles.studentAvatar} src={student.avatar} mode="aspectFill" />
                      <View className={styles.studentInfo}>
                        <Text className={styles.studentName}>{student.name}</Text>
                        <Text className={styles.studentStatusDone}>✓ 已签到 {student.checkedAt}</Text>
                      </View>
                      <View
                        className={styles.statusBadge}
                        style={{ backgroundColor: '#00B42A' }}
                      >
                        已核销
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default CheckInPage;
