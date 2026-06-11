import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Course, EnrolledCourse, PublishedCourse, Review, UserInfo, Notification } from '@/types';
import { courses as initialCourses, enrolledCourses as initialEnrolled, publishedCourses as initialPublished } from '@/data/courses';
import { currentUser as initialUser, notifications as initialNotifications } from '@/data/user';

interface Feedback {
  id: string;
  type: string;
  title: string;
  content: string;
  contact: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'resolved';
}

interface CertifyRecord {
  id: string;
  realName: string;
  skill: string;
  certificate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface CheckInRecord {
  id: string;
  courseTitle: string;
  date: string;
  checkedIn: boolean;
  checkedAt?: string;
}

interface AppState {
  courses: Course[];
  enrolledCourses: EnrolledCourse[];
  publishedCourses: PublishedCourse[];
  user: UserInfo;
  notifications: Notification[];
  reviews: Review[];
  feedbacks: Feedback[];
  certifyRecords: CertifyRecord[];
  checkInRecords: CheckInRecord[];
}

interface AppContextType extends AppState {
  enrollCourse: (courseId: string, sessionId: string, studentName: string, phone: string, isWaitlist: boolean) => boolean;
  cancelEnrollment: (enrolledId: string) => void;
  toggleFavorite: (courseId: string) => void;
  submitReview: (courseId: string, rating: number, content: string, imageUrl?: string) => void;
  submitWork: (enrolledId: string, imageUrl: string) => void;
  submitFeedback: (type: string, title: string, content: string, contact: string) => void;
  submitCertify: (realName: string, skill: string, certificate: string) => void;
  checkIn: (recordId: string) => void;
  reviewCourse: (courseId: string, action: 'approve' | 'reject') => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>(initialEnrolled);
  const [publishedCourses, setPublishedCourses] = useState<PublishedCourse[]>(initialPublished);
  const [user, setUser] = useState<UserInfo>(initialUser);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 'f001',
      type: '课程问题',
      title: '课程时间安排不合理',
      content: '建议把周六的课程调整到周日，周六要带孩子上补习班。',
      contact: '138****8888',
      createdAt: '2026-06-05',
      status: 'resolved'
    }
  ]);
  const [certifyRecords, setCertifyRecords] = useState<CertifyRecord[]>([]);
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([
    { id: 'c001', courseTitle: '亲子创意黏土手工课', date: '2026-06-08', checkedIn: true, checkedAt: '14:02' },
    { id: 'c002', courseTitle: '中老年肩颈康复训练', date: '2026-06-07', checkedIn: true, checkedAt: '09:05' },
    { id: 'c003', courseTitle: '家庭烘焙：曲奇与小蛋糕', date: '2026-06-20', checkedIn: false },
    { id: 'c004', courseTitle: '智能手机与电脑入门', date: '2026-06-17', checkedIn: false }
  ]);

  const enrollCourse = useCallback((courseId: string, sessionId: string, studentName: string, phone: string, isWaitlist: boolean) => {
    console.log('[AppContext] enrollCourse:', { courseId, sessionId, studentName, isWaitlist });
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;

    const session = course.sessions.find(s => s.id === sessionId);
    if (!session) return false;

    if (!isWaitlist && session.enrolled >= session.capacity) {
      return false;
    }

    const newEnrolled: EnrolledCourse = {
      id: `e${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      cover: course.cover,
      teacherName: course.teacher.name,
      sessionDate: session.date,
      sessionTime: session.time,
      status: 'upcoming',
      canUpload: false,
      canReview: false,
      hasFeedback: false
    };

    setEnrolledCourses(prev => [newEnrolled, ...prev]);

    if (!isWaitlist) {
      setCourses(prev => prev.map(c => {
        if (c.id === courseId) {
          return {
            ...c,
            enrolledCount: c.enrolledCount + 1,
            sessions: c.sessions.map(s => 
              s.id === sessionId ? { ...s, enrolled: s.enrolled + 1 } : s
            )
          };
        }
        return c;
      }));
    }

    const newNotice: Notification = {
      id: `n${Date.now()}`,
      title: isWaitlist ? '候补报名成功' : '报名成功通知',
      content: `您已${isWaitlist ? '候补报名' : '成功报名'}「${course.title}」${session.date} ${session.time}场次，${isWaitlist ? '有位置时会通知您。' : '请准时参加。'}`,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
      type: 'enroll'
    };
    setNotifications(prev => [newNotice, ...prev]);

    return true;
  }, [courses]);

  const cancelEnrollment = useCallback((enrolledId: string) => {
    console.log('[AppContext] cancelEnrollment:', enrolledId);
    
    const enrolled = enrolledCourses.find(e => e.id === enrolledId);
    if (!enrolled) return;

    setEnrolledCourses(prev => 
      prev.map(e => e.id === enrolledId ? { ...e, status: 'cancelled' as const } : e)
    );

    setCourses(prev => prev.map(c => {
      if (c.id === enrolled.courseId) {
        return {
          ...c,
          enrolledCount: Math.max(0, c.enrolledCount - 1),
          sessions: c.sessions.map(s => {
            if (s.date === enrolled.sessionDate && s.time === enrolled.sessionTime) {
              return { ...s, enrolled: Math.max(0, s.enrolled - 1) };
            }
            return s;
          })
        };
      }
      return c;
    }));

    const newNotice: Notification = {
      id: `n${Date.now()}`,
      title: '取消报名成功',
      content: `您已取消「${enrolled.courseTitle}」的报名。`,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
      type: 'system'
    };
    setNotifications(prev => [newNotice, ...prev]);
  }, [enrolledCourses]);

  const toggleFavorite = useCallback((courseId: string) => {
    console.log('[AppContext] toggleFavorite:', courseId);
    setCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  }, []);

  const submitReview = useCallback((courseId: string, rating: number, content: string, imageUrl?: string) => {
    console.log('[AppContext] submitReview:', { courseId, rating, content });
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const newReview: Review = {
      id: `r${Date.now()}`,
      courseId,
      courseTitle: course.title,
      rating,
      content,
      createdAt: new Date().toLocaleString('zh-CN')
    };
    setReviews(prev => [newReview, ...prev]);

    setEnrolledCourses(prev => prev.map(e => 
      e.courseId === courseId && e.status === 'completed'
        ? { ...e, canReview: false, hasFeedback: true }
        : e
    ));

    const newNotice: Notification = {
      id: `n${Date.now()}`,
      title: '评价提交成功',
      content: `感谢您对「${course.title}」的评价，老师会尽快查看！`,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
      type: 'review'
    };
    setNotifications(prev => [newNotice, ...prev]);
  }, [courses]);

  const submitWork = useCallback((enrolledId: string, imageUrl: string) => {
    console.log('[AppContext] submitWork:', { enrolledId, imageUrl });
    
    setEnrolledCourses(prev => prev.map(e => 
      e.id === enrolledId ? { ...e, canUpload: false, hasFeedback: true } : e
    ));

    const enrolled = enrolledCourses.find(e => e.id === enrolledId);
    if (enrolled) {
      const newNotice: Notification = {
        id: `n${Date.now()}`,
        title: '作品上传成功',
        content: `您的「${enrolled.courseTitle}」作品已上传，等待老师点评。`,
        time: new Date().toLocaleString('zh-CN'),
        read: false,
        type: 'review'
      };
      setNotifications(prev => [newNotice, ...prev]);
    }
  }, [enrolledCourses]);

  const submitFeedback = useCallback((type: string, title: string, content: string, contact: string) => {
    console.log('[AppContext] submitFeedback:', { type, title, content });
    
    const newFeedback: Feedback = {
      id: `f${Date.now()}`,
      type,
      title,
      content,
      contact,
      createdAt: new Date().toLocaleString('zh-CN'),
      status: 'pending'
    };
    setFeedbacks(prev => [newFeedback, ...prev]);

    const newNotice: Notification = {
      id: `n${Date.now()}`,
      title: '投诉反馈已提交',
      content: '您的反馈已收到，工作人员会在24小时内处理。',
      time: new Date().toLocaleString('zh-CN'),
      read: false,
      type: 'system'
    };
    setNotifications(prev => [newNotice, ...prev]);
  }, []);

  const submitCertify = useCallback((realName: string, skill: string, certificate: string) => {
    console.log('[AppContext] submitCertify:', { realName, skill });
    
    const newRecord: CertifyRecord = {
      id: `c${Date.now()}`,
      realName,
      skill,
      certificate,
      status: 'pending',
      submittedAt: new Date().toLocaleString('zh-CN')
    };
    setCertifyRecords(prev => [newRecord, ...prev]);

    const newNotice: Notification = {
      id: `n${Date.now()}`,
      title: '资质认证已提交',
      content: '您的老师资质认证已提交审核，预计1-3个工作日内完成。',
      time: new Date().toLocaleString('zh-CN'),
      read: false,
      type: 'system'
    };
    setNotifications(prev => [newNotice, ...prev]);
  }, []);

  const checkIn = useCallback((recordId: string) => {
    console.log('[AppContext] checkIn:', recordId);
    
    setCheckInRecords(prev => prev.map(r => 
      r.id === recordId ? { 
        ...r, 
        checkedIn: true, 
        checkedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      } : r
    ));

    const record = checkInRecords.find(r => r.id === recordId);
    if (record) {
      setUser(prev => ({ ...prev, points: prev.points + 10 }));

      const newNotice: Notification = {
        id: `n${Date.now()}`,
        title: '签到成功',
        content: `「${record.courseTitle}」签到成功，获得10邻里积分！`,
        time: new Date().toLocaleString('zh-CN'),
        read: false,
        type: 'system'
      };
      setNotifications(prev => [newNotice, ...prev]);
    }
  }, [checkInRecords]);

  const reviewCourse = useCallback((courseId: string, action: 'approve' | 'reject') => {
    console.log('[AppContext] reviewCourse:', { courseId, action });
    
    setPublishedCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, status: action === 'approve' ? 'approved' as const : 'rejected' as const } : c
    ));

    const course = publishedCourses.find(c => c.id === courseId);
    if (course) {
      const newNotice: Notification = {
        id: `n${Date.now()}`,
        title: `课程审核${action === 'approve' ? '通过' : '未通过'}`,
        content: `您的课程「${course.title}」审核${action === 'approve' ? '已通过，快去招生吧！' : '未通过，请修改后重新提交。'}`,
        time: new Date().toLocaleString('zh-CN'),
        read: false,
        type: 'system'
      };
      setNotifications(prev => [newNotice, ...prev]);
    }
  }, [publishedCourses]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const value: AppContextType = {
    courses,
    enrolledCourses,
    publishedCourses,
    user,
    notifications,
    reviews,
    feedbacks,
    certifyRecords,
    checkInRecords,
    enrollCourse,
    cancelEnrollment,
    toggleFavorite,
    submitReview,
    submitWork,
    submitFeedback,
    submitCertify,
    checkIn,
    reviewCourse,
    markNotificationRead
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
