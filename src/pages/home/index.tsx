import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { categories } from '@/data/categories';
import CourseCard from '@/components/CourseCard';
import { useApp } from '@/store/app';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { courses, user } = useApp();

  const filters = [
    { id: 'all', name: '全部' },
    { id: 'free', name: '免费' },
    { id: 'new', name: '最新' },
    { id: 'hot', name: '热门' },
    { id: 'nearby', name: '附近' }
  ];

  const filteredCourses = courses.filter(c => {
    if (activeCategory !== 'all' && c.categoryId !== activeCategory) return false;
    if (activeFilter === 'free' && c.materialFee > 0) return false;
    if (activeFilter === 'hot' && c.reviewCount < 50) return false;
    return true;
  });

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? 'all' : categoryId);
    console.log('[Home] Category clicked:', categoryId);
  };

  const handleSearchClick = () => {
    console.log('[Home] Search bar clicked');
    Taro.showToast({ title: '搜索功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.topBar}>
          <View className={styles.location}>
            <Text className={styles.locationIcon}>📍</Text>
            <Text>{user.community}</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: '44rpx' }}>🔔</Text>
        </View>
        <View className={styles.searchBar} onClick={handleSearchClick}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchPlaceholder}>搜索课程、老师...</Text>
        </View>
      </View>

      <ScrollView scrollY enhanced showScrollbar={false}>
        <View className={styles.banner}>
          <View className={styles.bannerContent}>
            <Text className={styles.bannerTitle}>邻里互助，共享技能</Text>
            <Text className={styles.bannerDesc}>教你想学的，学你想教的</Text>
          </View>
          <Text className={styles.bannerEmoji}>🏡</Text>
        </View>

        <View className={styles.categorySection}>
          <Text className={styles.sectionTitle}>课程分类</Text>
          <View className={styles.categoryGrid}>
            {categories.map(cat => (
              <View
                key={cat.id}
                className={styles.categoryItem}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <View
                  className={styles.categoryIcon}
                  style={{
                    backgroundColor: activeCategory === cat.id ? cat.color + '25' : cat.color + '15',
                    border: activeCategory === cat.id ? `2rpx solid ${cat.color}` : 'none'
                  }}
                >
                  <Text>{cat.icon}</Text>
                </View>
                <Text className={styles.categoryName}>{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.courseSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              {activeCategory === 'all' ? '精选课程' : categories.find(c => c.id === activeCategory)?.name}
            </Text>
            <Text className={styles.moreLink}>查看更多 ›</Text>
          </View>

          <ScrollView
            className={styles.filterRow}
            scrollX
            enhanced
            showScrollbar={false}
          >
            {filters.map(f => (
              <View
                key={f.id}
                className={classnames(styles.filterItem, activeFilter === f.id && styles.filterItemActive)}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.name}
              </View>
            ))}
          </ScrollView>

          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;
