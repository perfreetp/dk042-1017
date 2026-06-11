import React, { useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import EmptyState from '@/components/EmptyState';
import { getStatusColor } from '@/utils';

const CheckInPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('student');
  const { checkInRecords, checkIn } = useApp();

  const tabs = [
    { id: 'student', name: '学员签到' },
    { id: 'teacher', name: '老师核销' }
  ];

  const pendingRecords = checkInRecords.filter(r => !r.checkedIn);
  const doneRecords = checkInRecords.filter(r => r.checkedIn);

  const handleCheckIn = (recordId: string, courseTitle: string) => {
    Taro.showModal({
      title: '确认签到',
      content: `确定要签到「${courseTitle}」吗？`,
      success: (res) => {
        if (res.confirm) {
          checkIn(recordId);
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
        Taro.showToast({ title: '签到成功', icon: 'success' });
      },
      fail: () => {
        Taro.showToast({ title: '扫码签到演示成功', icon: 'success' });
      }
    });
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

      {activeTab === 'student' && (
        <>
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
                  <View className={styles.actionRow}>
                    <Button
                      className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                      onClick={() => handleCheckIn(record.id, record.courseTitle)}
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
        </>
      )}

      {activeTab === 'teacher' && (
        <>
          <View className={styles.qrcodeSection}>
            <Text className={styles.qrcodeTitle}>签到二维码</Text>
            <View className={styles.qrcode}>
              <Text className={styles.qrcodeIcon}>📱</Text>
            </View>
            <Text className={styles.qrcodeDesc}>
              请学员扫描二维码进行签到{'\n'}
              或使用下方手动核销功能
            </Text>
          </View>

          <View className={styles.checkinCard}>
            <View className={styles.cardHeader}>
              <Text className={styles.courseTitle}>今日课程</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>课程名称</Text>
              <Text className={styles.infoValue}>书法入门：楷书基础</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>上课时间</Text>
              <Text className={styles.infoValue}>19:00 - 20:30</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>应到人数</Text>
              <Text className={styles.infoValue}>12人</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>已签到</Text>
              <Text className={styles.infoValue} style={{ color: '#00B42A', fontWeight: '500' }}>8人</Text>
            </View>
            <View className={styles.actionRow}>
              <Button
                className={classnames(styles.actionBtn, styles.actionBtnOutline)}
                onClick={handleScanCode}
              >
                扫码核销
              </Button>
              <Button
                className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                onClick={() => {
                  Taro.showToast({ title: '手动核销功能开发中', icon: 'none' });
                }}
              >
                手动核销
              </Button>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default CheckInPage;
