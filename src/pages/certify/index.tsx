import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import { getStatusColor, getStatusText } from '@/utils';

const CertifyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('apply');
  const { certifyRecords, submitCertify, user } = useApp();
  
  const [realName, setRealName] = useState('');
  const [skill, setSkill] = useState('');
  const [intro, setIntro] = useState('');
  const [certImages, setCertImages] = useState<string[]>([]);

  const tabs = [
    { id: 'apply', name: '提交认证' },
    { id: 'record', name: '认证记录' }
  ];

  const handleChooseImage = () => {
    if (certImages.length >= 3) {
      Taro.showToast({ title: '最多上传3张', icon: 'none' });
      return;
    }
    Taro.chooseImage({
      count: 3 - certImages.length,
      success: (res) => {
        const newImages = res.tempFilePaths || [
          `https://picsum.photos/id/${100 + certImages.length}/400/400`
        ];
        setCertImages(prev => [...prev, ...newImages.slice(0, 3 - prev.length)]);
      },
      fail: () => {
        const demo = `https://picsum.photos/id/1025/400/400`;
        setCertImages(prev => [...prev, demo].slice(0, 3));
      }
    });
  };

  const handleDeleteImage = (index: number) => {
    setCertImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!realName.trim()) {
      Taro.showToast({ title: '请输入真实姓名', icon: 'none' });
      return;
    }
    if (!skill.trim()) {
      Taro.showToast({ title: '请输入擅长技能', icon: 'none' });
      return;
    }
    if (certImages.length === 0) {
      Taro.showToast({ title: '请上传资质证明', icon: 'none' });
      return;
    }

    console.log('[Certify] Submit:', { realName, skill, intro, certImages });
    submitCertify(realName, skill, certImages[0]);
    
    Taro.showToast({ title: '认证已提交', icon: 'success' });
    setRealName('');
    setSkill('');
    setIntro('');
    setCertImages([]);
    setTimeout(() => setActiveTab('record'), 1500);
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

      {activeTab === 'apply' && (
        <>
          <View className={styles.tipCard}>
            <Text className={styles.tipTitle}>💡 资质认证说明</Text>
            <Text className={styles.tipText}>
              完成老师资质认证后，您可以发布课程并获得更多曝光。请上传真实有效的资质证明，我们会在1-3个工作日内完成审核。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📋</Text>
              基本信息
            </Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                <Text className={styles.formLabelRequired}>*</Text>
                真实姓名
              </Text>
              <Input
                className={styles.formInput}
                placeholder="请输入您的真实姓名"
                value={realName}
                onInput={(e) => setRealName(e.detail.value)}
                maxLength={20}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                <Text className={styles.formLabelRequired}>*</Text>
                擅长技能
              </Text>
              <Input
                className={styles.formInput}
                placeholder="如：烘焙、摄影、乐器、书法等"
                value={skill}
                onInput={(e) => setSkill(e.detail.value)}
                maxLength={30}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>个人简介</Text>
              <Textarea
                className={styles.formTextarea}
                placeholder="简单介绍一下您的教学经验和专业背景..."
                value={intro}
                onInput={(e) => setIntro(e.detail.value)}
                maxLength={200}
              />
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🪪</Text>
              资质证明
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#86909C', marginBottom: '24rpx' }}>
              请上传教师资格证、专业证书、获奖证书等证明材料（最多3张）
            </Text>
            <View className={styles.uploadArea}>
              {certImages.map((img, idx) => (
                <View key={idx} className={styles.uploadItem}>
                  <Image className={styles.uploadImg} src={img} mode="aspectFill" />
                  <View className={styles.uploadDelete} onClick={() => handleDeleteImage(idx)}>
                    ×
                  </View>
                </View>
              ))}
              {certImages.length < 3 && (
                <View className={styles.uploadBtn} onClick={handleChooseImage}>
                  <Text className={styles.uploadIcon}>➕</Text>
                  <Text className={styles.uploadText}>上传证书</Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {activeTab === 'record' && (
        <View className={styles.section}>
          {user.certified && (
            <View style={{ 
              background: 'linear-gradient(135deg, #E8F8F5 0%, #D1F2EB 100%)',
              padding: '24rpx',
              borderRadius: '16rpx',
              marginBottom: '24rpx'
            }}>
              <Text style={{ color: '#4ECDC4', fontWeight: 'bold', fontSize: '32rpx' }}>
                ✓ 您已通过资质认证
              </Text>
              <Text style={{ color: '#86909C', fontSize: '24rpx', marginTop: '8rpx' }}>
                可以发布课程啦~
              </Text>
            </View>
          )}
          
          {certifyRecords.length === 0 ? (
            <View style={{ padding: '60rpx 0', textAlign: 'center', color: '#86909C' }}>
              暂无认证记录
            </View>
          ) : (
            certifyRecords.map(record => (
              <View key={record.id} className={styles.recordItem}>
                <View className={styles.recordHeader}>
                  <Text className={styles.recordTitle}>{record.skill}</Text>
                  <View 
                    className={styles.recordStatus}
                    style={{ backgroundColor: getStatusColor(record.status) }}
                  >
                    {getStatusText(record.status)}
                  </View>
                </View>
                <Text className={styles.recordMeta}>
                  申请人：{record.realName} · {record.submittedAt}
                </Text>
                <Text className={styles.recordContent}>
                  {record.status === 'pending' 
                    ? '您的认证申请正在审核中，请耐心等待...' 
                    : record.status === 'approved' 
                    ? '恭喜！您的资质认证已通过审核，现在可以发布课程了。'
                    : '很抱歉，您的认证未通过，请补充材料后重新提交。'
                  }
                </Text>
              </View>
            ))
          )}
        </View>
      )}

      {activeTab === 'apply' && (
        <View className={styles.bottomBar}>
          <Button
            className={styles.submitBtn}
            onClick={handleSubmit}
          >
            提交认证
          </Button>
        </View>
      )}
    </View>
  );
};

export default CertifyPage;
