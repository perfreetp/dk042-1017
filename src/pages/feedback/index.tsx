import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';
import EmptyState from '@/components/EmptyState';
import { getStatusColor, getStatusText } from '@/utils';

const FeedbackPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('submit');
  const { feedbacks, submitFeedback } = useApp();

  const [type, setType] = useState('课程问题');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const feedbackTypes = ['课程问题', '老师问题', '平台建议', '其他投诉'];

  const tabs = [
    { id: 'submit', name: '提交反馈' },
    { id: 'record', name: '反馈记录' }
  ];

  const handleChooseImage = () => {
    if (images.length >= 3) {
      Taro.showToast({ title: '最多上传3张', icon: 'none' });
      return;
    }
    Taro.chooseImage({
      count: 3 - images.length,
      success: (res) => {
        const newImages = res.tempFilePaths || [
          `https://picsum.photos/id/${150 + images.length}/400/400`
        ];
        setImages(prev => [...prev, ...newImages.slice(0, 3 - prev.length)]);
      },
      fail: () => {
        const demo = `https://picsum.photos/id/160/400/400`;
        setImages(prev => [...prev, demo].slice(0, 3));
      }
    });
  };

  const handleDeleteImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入反馈标题', icon: 'none' });
      return;
    }
    if (!content.trim()) {
      Taro.showToast({ title: '请输入反馈内容', icon: 'none' });
      return;
    }

    console.log('[Feedback] Submit:', { type, title, content, contact, images });
    submitFeedback(type, title, content, contact);

    Taro.showToast({ title: '反馈已提交', icon: 'success' });
    setTitle('');
    setContent('');
    setContact('');
    setImages([]);
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

      {activeTab === 'submit' && (
        <>
          <View className={styles.tipCard}>
            <Text className={styles.tipTitle}>💡 温馨提示</Text>
            <Text className={styles.tipText}>
              您的反馈对我们非常重要，我们会认真对待每一条建议和投诉，并在24小时内回复处理结果。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>�</Text>
              反馈类型
            </Text>
            <View className={styles.typeGrid}>
              {feedbackTypes.map(item => (
                <View
                  key={item}
                  className={classnames(styles.typeItem, type === item && styles.typeItemActive)}
                  onClick={() => setType(item)}
                >
                  {item}
                </View>
              ))}
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                <Text className={styles.formLabelRequired}>*</Text>
                反馈标题
              </Text>
              <Input
                className={styles.formInput}
                placeholder="请简要描述您的问题或建议"
                value={title}
                onInput={(e) => setTitle(e.detail.value)}
                maxLength={50}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                <Text className={styles.formLabelRequired}>*</Text>
                反馈内容
              </Text>
              <Textarea
                className={styles.formTextarea}
                placeholder="请详细描述您遇到的问题或建议..."
                value={content}
                onInput={(e) => setContent(e.detail.value)}
                maxLength={500}
              />
              <Text className={styles.wordCount}>{content.length}/500</Text>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>图片凭证（选填）</Text>
              <View className={styles.uploadArea}>
                {images.map((img, idx) => (
                  <View key={idx} className={styles.uploadItem}>
                    <Image className={styles.uploadImg} src={img} mode="aspectFill" />
                    <View className={styles.uploadDelete} onClick={() => handleDeleteImage(idx)}>
                      ×
                    </View>
                  </View>
                ))}
                {images.length < 3 && (
                  <View className={styles.uploadBtn} onClick={handleChooseImage}>
                    <Text className={styles.uploadIcon}>➕</Text>
                    <Text className={styles.uploadText}>上传图片</Text>
                  </View>
                )}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                联系方式（选填）
              </Text>
              <Input
                className={styles.formInput}
                placeholder="手机号/微信号，方便我们联系您"
                value={contact}
                onInput={(e) => setContact(e.detail.value)}
                maxLength={50}
              />
            </View>
          </View>
        </>
      )}

      {activeTab === 'record' && (
        <View className={styles.section}>
          {feedbacks.length === 0 ? (
            <EmptyState icon="📝" text="暂无反馈记录" />
          ) : (
            feedbacks.map(item => (
              <View key={item.id} className={styles.recordItem}>
                <View className={styles.recordHeader}>
                  <Text className={styles.recordTitle}>{item.title}</Text>
                  <View className={styles.recordType}>{item.type}</View>
                  <View 
                    className={styles.recordStatus}
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  >
                    {getStatusText(item.status)}
                  </View>
                </View>
                <Text className={styles.recordMeta}>
                  {item.createdAt}
                  {item.contact && ` · ${item.contact}`}
                </Text>
                <Text className={styles.recordContent}>{item.content}</Text>
                {item.status === 'resolved' && (
                  <View style={{
                    marginTop: '16rpx',
                    padding: '16rpx',
                    background: '#E8F8F5',
                    borderRadius: '12rpx',
                    fontSize: '24rpx',
                    color: '#4E5969',
                    lineHeight: 1.6
                  }}>
                    📩 处理结果：感谢您的反馈，我们已处理完成，如有其他问题欢迎继续反馈。
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      )}

      {activeTab === 'submit' && (
        <View className={styles.bottomBar}>
          <Button
            className={styles.submitBtn}
            onClick={handleSubmit}
          >
            提交反馈
          </Button>
        </View>
      )}
    </View>
  );
};

export default FeedbackPage;
