import React, { useState } from 'react';
import { View, Text, Image, Textarea, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/app';

const UploadPage: React.FC = () => {
  const router = useRouter();
  const enrolledId = router.params.id;
  const type = router.params.type || 'work';
  const { courses, enrolledCourses, submitWork, submitReview } = useApp();

  const [mode, setMode] = useState<'work' | 'review'>(type === 'review' ? 'review' : 'work');
  const [images, setImages] = useState<string[]>([]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  const enrolled = enrolledCourses.find(e => e.id === enrolledId);
  const course = enrolled ? courses.find(c => c.id === enrolled.courseId) : undefined;

  const ratingLabels = ['很差', '较差', '一般', '满意', '非常满意'];

  const handleChooseImage = () => {
    if (images.length >= 9) {
      Taro.showToast({ title: '最多上传9张图片', icon: 'none' });
      return;
    }
    Taro.chooseImage({
      count: 9 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFilePaths || [
          `https://picsum.photos/id/${250 + images.length}/400/400`
        ];
        setImages(prev => [...prev, ...newImages.slice(0, 9 - prev.length)]);
        console.log('[Upload] Images selected:', newImages.length);
      },
      fail: () => {
        const demoImages = [
          `https://picsum.photos/id/292/400/400`,
          `https://picsum.photos/id/431/400/400`,
        ];
        setImages(prev => [...prev, ...demoImages.slice(0, 9 - prev.length)]);
      }
    });
  };

  const handleDeleteImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (mode === 'work' && images.length === 0) {
      Taro.showToast({ title: '请至少上传一张作品图片', icon: 'none' });
      return;
    }
    if (mode === 'review' && !content.trim()) {
      Taro.showToast({ title: '请填写评价内容', icon: 'none' });
      return;
    }

    console.log('[Upload] Submit:', { mode, images, rating, content });

    if (mode === 'work' && enrolled) {
      submitWork(enrolled.id, images[0]);
    } else if (mode === 'review' && enrolled) {
      submitReview(enrolled.id, rating, content, images[0]);
    }

    Taro.showToast({ 
      title: mode === 'work' ? '作品上传成功' : '评价提交成功', 
      icon: 'success' 
    });

    setTimeout(() => {
      Taro.switchTab({ url: '/pages/afterclass/index' });
    }, 1500);
  };

  const displayCourse = course || {
    title: enrolled?.courseTitle || '课程',
    cover: enrolled?.cover || '',
    teacher: { name: enrolled?.teacherName || '老师' }
  };

  return (
    <View className={styles.page}>
      <View className={styles.modeTab}>
        <View
          className={classnames(styles.modeTabItem, mode === 'work' && styles.modeTabItemActive)}
          onClick={() => setMode('work')}
        >
          🎨 上传作品
        </View>
        <View
          className={classnames(styles.modeTabItem, mode === 'review' && styles.modeTabItemActive)}
          onClick={() => setMode('review')}
        >
          ⭐ 提交评价
        </View>
      </View>

      <View className={styles.courseCard}>
        <Image className={styles.cover} src={displayCourse.cover} mode="aspectFill" />
        <View className={styles.courseInfo}>
          <Text className={styles.courseTitle}>{displayCourse.title}</Text>
          <Text className={styles.courseTeacher}>
            👨‍🏫 {displayCourse.teacher?.name || enrolled?.teacherName}
          </Text>
        </View>
      </View>

      {mode === 'work' && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🖼️</Text>
            作品照片
          </Text>
          <View className={styles.uploadArea}>
            {images.map((img, idx) => (
              <View key={idx} className={styles.uploadItem}>
                <Image className={styles.uploadImg} src={img} mode="aspectFill" />
                <View className={styles.uploadDelete} onClick={() => handleDeleteImage(idx)}>
                  ×
                </View>
              </View>
            ))}
            {images.length < 9 && (
              <View className={styles.uploadBtn} onClick={handleChooseImage}>
                <Text className={styles.uploadIcon}>➕</Text>
                <Text className={styles.uploadText}>添加图片</Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: '24rpx', color: '#86909C', marginTop: '16rpx' }}>
            最多上传9张，建议上传清晰的作品照片
          </Text>
        </View>
      )}

      {mode === 'review' && (
        <>
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>⭐</Text>
              课程评分
            </Text>
            <View className={styles.ratingSection}>
              <Text className={styles.ratingText}>点击星星进行评分</Text>
              <View className={styles.stars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Text
                    key={star}
                    className={classnames(
                      styles.star,
                      star <= rating ? styles.starActive : styles.starInactive
                    )}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </Text>
                ))}
              </View>
              <Text className={styles.ratingLabel}>{ratingLabels[rating - 1]}</Text>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📝</Text>
              评价内容
            </Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="分享您的课程体验，帮助其他邻居更好地了解这门课..."
              value={content}
              onInput={(e) => setContent(e.detail.value)}
              maxLength={500}
            />
            <Text className={styles.wordCount}>{content.length}/500</Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🖼️</Text>
              配图（选填）
            </Text>
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
                  <Text className={styles.uploadText}>添加图片</Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.submitBtn)}
          onClick={handleSubmit}
        >
          {mode === 'work' ? '提交作品' : '提交评价'}
        </Button>
      </View>
    </View>
  );
};

export default UploadPage;
