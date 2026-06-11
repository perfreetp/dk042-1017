import { Course, EnrolledCourse, PublishedCourse } from '@/types';

export const courses: Course[] = [
  {
    id: 'c001',
    title: '亲子创意黏土手工课',
    categoryId: 'craft',
    categoryName: '亲子手工',
    cover: 'https://picsum.photos/id/225/600/400',
    teacher: {
      id: 't001',
      name: '王老师',
      avatar: 'https://picsum.photos/id/64/200/200',
      intro: '8年幼儿美术教育经验，擅长亲子手工设计，曾获市优秀幼儿教师称号',
      certified: true,
      rating: 4.9
    },
    location: '3号楼2单元 社区活动室',
    maxStudents: 12,
    enrolledCount: 8,
    sessions: [
      { id: 's001', date: '2026-06-15', time: '14:00-15:30', capacity: 12, enrolled: 4, waitlist: 2 },
      { id: 's002', date: '2026-06-22', time: '14:00-15:30', capacity: 12, enrolled: 4, waitlist: 0 }
    ],
    materialFee: 30,
    suitableAge: '4-10岁亲子',
    description: '通过黏土创作培养孩子动手能力和创造力，家长和孩子共同完成作品，增进亲子感情。课程包含基础塑形技巧和创意主题制作。',
    tags: ['亲子', '创意', '黏土'],
    rating: 4.9,
    reviewCount: 56,
    isFavorite: true,
    status: 'recruiting'
  },
  {
    id: 'c002',
    title: '手机摄影零基础入门',
    categoryId: 'photo',
    categoryName: '手机摄影',
    cover: 'https://picsum.photos/id/3/600/400',
    teacher: {
      id: 't002',
      name: '李老师',
      avatar: 'https://picsum.photos/id/91/200/200',
      intro: '资深摄影师，10年专业摄影经验，擅长人像、风光摄影，多家机构特聘讲师',
      certified: true,
      rating: 4.8
    },
    location: '社区文化中心 多功能厅',
    maxStudents: 20,
    enrolledCount: 15,
    sessions: [
      { id: 's003', date: '2026-06-18', time: '19:00-20:30', capacity: 20, enrolled: 15, waitlist: 3 }
    ],
    materialFee: 0,
    suitableAge: '16岁以上',
    description: '从零开始学习手机摄影，掌握构图、光线、色彩等基础知识，学会使用修图软件，拍出专业水准的照片。',
    tags: ['零基础', '实用', '生活记录'],
    rating: 4.8,
    reviewCount: 89,
    isFavorite: false,
    status: 'recruiting'
  },
  {
    id: 'c003',
    title: '家庭烘焙：曲奇与小蛋糕',
    categoryId: 'bake',
    categoryName: '烘焙',
    cover: 'https://picsum.photos/id/292/600/400',
    teacher: {
      id: 't003',
      name: '陈老师',
      avatar: 'https://picsum.photos/id/177/200/200',
      intro: '高级西点师，曾任职于知名五星级酒店，5年烘焙教学经验',
      certified: true,
      rating: 5.0
    },
    location: '5号楼1单元 陈老师家',
    maxStudents: 8,
    enrolledCount: 6,
    sessions: [
      { id: 's004', date: '2026-06-20', time: '10:00-12:00', capacity: 8, enrolled: 6, waitlist: 0 },
      { id: 's005', date: '2026-06-27', time: '10:00-12:00', capacity: 8, enrolled: 0, waitlist: 0 }
    ],
    materialFee: 50,
    suitableAge: '18岁以上',
    description: '学习经典曲奇和戚风小蛋糕的制作方法，从材料配比到烘焙技巧全流程教学，作品可带回家与家人分享。',
    tags: ['美食', '实用', '小班教学'],
    rating: 5.0,
    reviewCount: 127,
    isFavorite: true,
    status: 'recruiting'
  },
  {
    id: 'c004',
    title: '尤克里里入门：一周弹唱',
    categoryId: 'music',
    categoryName: '乐器',
    cover: 'https://picsum.photos/id/659/600/400',
    teacher: {
      id: 't004',
      name: '赵老师',
      avatar: 'https://picsum.photos/id/338/200/200',
      intro: '音乐教育专业毕业，擅长尤克里里和吉他教学，教学风格轻松活泼',
      certified: true,
      rating: 4.7
    },
    location: '社区文化中心 音乐教室',
    maxStudents: 10,
    enrolledCount: 7,
    sessions: [
      { id: 's006', date: '2026-06-16', time: '19:30-21:00', capacity: 10, enrolled: 7, waitlist: 1 }
    ],
    materialFee: 0,
    suitableAge: '8岁以上',
    description: '尤克里里简单易学，一周掌握基础和弦和弹唱技巧，学会3首流行歌曲。乐器可自备或向老师租赁。',
    tags: ['音乐', '入门', '弹唱'],
    rating: 4.7,
    reviewCount: 42,
    isFavorite: false,
    status: 'recruiting'
  },
  {
    id: 'c005',
    title: '中老年肩颈康复训练',
    categoryId: 'rehab',
    categoryName: '运动康复',
    cover: 'https://picsum.photos/id/1025/600/400',
    teacher: {
      id: 't005',
      name: '刘医生',
      avatar: 'https://picsum.photos/id/1027/200/200',
      intro: '三甲医院康复科主治医师，15年临床经验，专注运动损伤与老年康复',
      certified: true,
      rating: 4.9
    },
    location: '社区卫生站 康复室',
    maxStudents: 15,
    enrolledCount: 12,
    sessions: [
      { id: 's007', date: '2026-06-14', time: '09:00-10:00', capacity: 15, enrolled: 12, waitlist: 0 }
    ],
    materialFee: 0,
    suitableAge: '45岁以上',
    description: '针对中老年常见肩颈问题设计的康复训练课程，通过科学运动缓解疼痛，改善活动度，预防职业病。',
    tags: ['健康', '中老年', '康复'],
    rating: 4.9,
    reviewCount: 203,
    isFavorite: false,
    status: 'ongoing'
  },
  {
    id: 'c006',
    title: '智能手机与电脑入门',
    categoryId: 'computer',
    categoryName: '电脑入门',
    cover: 'https://picsum.photos/id/160/600/400',
    teacher: {
      id: 't006',
      name: '孙老师',
      avatar: 'https://picsum.photos/id/1012/200/200',
      intro: '计算机专业硕士，多年IT培训经验，擅长用通俗易懂的方式讲解技术',
      certified: true,
      rating: 4.8
    },
    location: '社区文化中心 电脑教室',
    maxStudents: 18,
    enrolledCount: 10,
    sessions: [
      { id: 's008', date: '2026-06-17', time: '14:00-16:00', capacity: 18, enrolled: 10, waitlist: 0 }
    ],
    materialFee: 0,
    suitableAge: '中老年',
    description: '专为中老年人设计的数码入门课，涵盖微信使用、手机支付、视频通话、电脑基础操作等实用内容。',
    tags: ['实用', '中老年', '数码'],
    rating: 4.8,
    reviewCount: 78,
    isFavorite: false,
    status: 'recruiting'
  },
  {
    id: 'c007',
    title: '儿童英语口语启蒙',
    categoryId: 'language',
    categoryName: '语言学习',
    cover: 'https://picsum.photos/id/1025/600/400',
    teacher: {
      id: 't007',
      name: 'Emily老师',
      avatar: 'https://picsum.photos/id/659/200/200',
      intro: '英语专业八级，6年少儿英语教学经验，外教资源丰富',
      certified: true,
      rating: 4.9
    },
    location: '4号楼3单元 社区活动室',
    maxStudents: 10,
    enrolledCount: 9,
    sessions: [
      { id: 's009', date: '2026-06-19', time: '15:00-16:30', capacity: 10, enrolled: 9, waitlist: 5 }
    ],
    materialFee: 20,
    suitableAge: '5-10岁',
    description: '趣味英语启蒙，通过游戏、歌曲、故事让孩子爱上英语，纯正发音教学，培养语感和表达能力。',
    tags: ['英语', '儿童', '启蒙'],
    rating: 4.9,
    reviewCount: 156,
    isFavorite: true,
    status: 'recruiting'
  },
  {
    id: 'c008',
    title: '剪纸艺术：中国传统工艺',
    categoryId: 'craft',
    categoryName: '亲子手工',
    cover: 'https://picsum.photos/id/582/600/400',
    teacher: {
      id: 't008',
      name: '周老师',
      avatar: 'https://picsum.photos/id/1027/200/200',
      intro: '非物质文化遗产剪纸传承人，从事剪纸艺术创作与教学20余年',
      certified: true,
      rating: 5.0
    },
    location: '社区文化中心 手工教室',
    maxStudents: 16,
    enrolledCount: 11,
    sessions: [
      { id: 's010', date: '2026-06-21', time: '14:00-16:00', capacity: 16, enrolled: 11, waitlist: 0 }
    ],
    materialFee: 15,
    suitableAge: '8岁以上亲子',
    description: '学习中国传统剪纸艺术，从基础纹样到吉祥图案，感受传统文化魅力，作品可装裱装饰家居。',
    tags: ['传统', '手工', '文化'],
    rating: 5.0,
    reviewCount: 89,
    isFavorite: false,
    status: 'recruiting'
  },
  {
    id: 'c009',
    title: '家庭烘焙：面包基础',
    categoryId: 'bake',
    categoryName: '烘焙',
    cover: 'https://picsum.photos/id/312/600/400',
    teacher: {
      id: 't003',
      name: '陈老师',
      avatar: 'https://picsum.photos/id/177/200/200',
      intro: '高级西点师，曾任职于知名五星级酒店，5年烘焙教学经验',
      certified: true,
      rating: 5.0
    },
    location: '5号楼1单元 陈老师家',
    maxStudents: 6,
    enrolledCount: 6,
    sessions: [
      { id: 's011', date: '2026-06-24', time: '10:00-12:00', capacity: 6, enrolled: 6, waitlist: 4 }
    ],
    materialFee: 45,
    suitableAge: '18岁以上',
    description: '学习基础面包制作，掌握揉面、发酵、整形技巧，做出松软可口的吐司、餐包和全麦面包。',
    tags: ['面包', '烘焙', '小班'],
    rating: 4.9,
    reviewCount: 67,
    isFavorite: false,
    status: 'recruiting'
  },
  {
    id: 'c010',
    title: '手机摄影进阶：人像拍摄',
    categoryId: 'photo',
    categoryName: '手机摄影',
    cover: 'https://picsum.photos/id/91/600/400',
    teacher: {
      id: 't002',
      name: '李老师',
      avatar: 'https://picsum.photos/id/91/200/200',
      intro: '资深摄影师，10年专业摄影经验，擅长人像、风光摄影',
      certified: true,
      rating: 4.8
    },
    location: '社区花园',
    maxStudents: 10,
    enrolledCount: 5,
    sessions: [
      { id: 's012', date: '2026-06-23', time: '16:00-18:00', capacity: 10, enrolled: 5, waitlist: 0 }
    ],
    materialFee: 0,
    suitableAge: '16岁以上',
    description: '进阶课程，学习人像拍摄技巧，包括构图、用光、美姿引导，掌握手机人像模式和后期修图要点。',
    tags: ['进阶', '人像', '户外'],
    rating: 4.7,
    reviewCount: 34,
    isFavorite: false,
    status: 'recruiting'
  }
];

export const enrolledCourses: EnrolledCourse[] = [
  {
    id: 'e001',
    courseId: 'c001',
    courseTitle: '亲子创意黏土手工课',
    cover: 'https://picsum.photos/id/225/600/400',
    teacherName: '王老师',
    sessionDate: '2026-06-08',
    sessionTime: '14:00-15:30',
    sessionId: 's001',
    status: 'completed',
    workUploaded: false,
    reviewSubmitted: false,
    hasFeedback: true,
    feedbackContent: '作品完成度很高，色彩搭配很棒，继续保持！下节课可以尝试更复杂的造型。'
  },
  {
    id: 'e002',
    courseId: 'c005',
    courseTitle: '中老年肩颈康复训练',
    cover: 'https://picsum.photos/id/1025/600/400',
    teacherName: '刘医生',
    sessionDate: '2026-06-07',
    sessionTime: '09:00-10:00',
    sessionId: 's007',
    status: 'completed',
    workUploaded: true,
    workImage: 'https://picsum.photos/id/1025/400/400',
    reviewSubmitted: false,
    hasFeedback: false
  },
  {
    id: 'e003',
    courseId: 'c003',
    courseTitle: '家庭烘焙：曲奇与小蛋糕',
    cover: 'https://picsum.photos/id/292/600/400',
    teacherName: '陈老师',
    sessionDate: '2026-06-20',
    sessionTime: '10:00-12:00',
    sessionId: 's004',
    status: 'upcoming',
    workUploaded: false,
    reviewSubmitted: false,
    hasFeedback: false
  },
  {
    id: 'e004',
    courseId: 'c006',
    courseTitle: '智能手机与电脑入门',
    cover: 'https://picsum.photos/id/160/600/400',
    teacherName: '孙老师',
    sessionDate: '2026-06-17',
    sessionTime: '14:00-16:00',
    sessionId: 's008',
    status: 'upcoming',
    workUploaded: false,
    reviewSubmitted: false,
    hasFeedback: false
  },
  {
    id: 'e005',
    courseId: 'c007',
    courseTitle: '儿童英语口语启蒙',
    cover: 'https://picsum.photos/id/1025/600/400',
    teacherName: 'Emily老师',
    sessionDate: '2026-06-19',
    sessionTime: '15:00-16:30',
    sessionId: 's009',
    status: 'waitlist',
    waitlistPosition: 2,
    workUploaded: false,
    reviewSubmitted: false,
    hasFeedback: false
  },
  {
    id: 'e006',
    courseId: 'c009',
    courseTitle: '家庭烘焙：面包基础',
    cover: 'https://picsum.photos/id/312/600/400',
    teacherName: '陈老师',
    sessionDate: '2026-06-24',
    sessionTime: '10:00-12:00',
    sessionId: 's011',
    status: 'waitlist',
    waitlistPosition: 1,
    workUploaded: false,
    reviewSubmitted: false,
    hasFeedback: false
  }
];

export const publishedCourses: PublishedCourse[] = [
  {
    id: 'p001',
    title: '书法入门：楷书基础',
    cover: 'https://picsum.photos/id/598/600/400',
    enrolledCount: 12,
    maxStudents: 15,
    status: 'approved',
    nextSession: '2026-06-18 19:00'
  },
  {
    id: 'p002',
    title: '围棋启蒙班',
    cover: 'https://picsum.photos/id/1/600/400',
    enrolledCount: 0,
    maxStudents: 10,
    status: 'pending',
    nextSession: '2026-06-25 14:00'
  }
];
