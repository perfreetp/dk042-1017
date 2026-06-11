import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Course, EnrolledCourse, PublishedCourse, Review, UserInfo, Notification, CheckInStudent } from '@/types';
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
  reply?: string;
}

interface CertifyRecord {
  id: string;
  realName: string;
  skill: string;
  certificate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectReason?: string;
}

interface CheckInRecord {
  id: string;
  courseTitle: string;
  date: string;
  time: string;
  checkedIn: boolean;
  checkedAt?: string;
}

interface TeacherCheckInSession {
  id: string;
  courseTitle: string;
  date: string;
  time: string;
  location: string;
  students: CheckInStudent[];
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
  teacherSessions: TeacherCheckInSession[];
}

interface AppContextType extends AppState {
  enrollCourse: (courseId: string, sessionId: string, studentName: string, phone: string, isWaitlist: boolean) => boolean;
  cancelEnrollment: (enrolledId: string) => void;
  cancelWaitlist: (enrolledId: string) => void;
  toggleFavorite: (courseId: string) => void;
  submitReview: (enrolledId: string, rating: number, content: string, imageUrl?: string) => void;
  submitWork: (enrolledId: string, imageUrl: string) => void;
  submitFeedback: (type: string, title: string, content: string, contact: string) => void;
  submitCertify: (realName: string, skill: string, certificate: string) => void;
  studentCheckIn: (recordId: string) => void;
  teacherCheckInStudent: (sessionId: string, studentId: string) => void;
  reviewCourse: (courseId: string, action: 'approve' | 'reject', rejectReason?: string) => void;
  markNotificationRead: (id: string) => void;
  submitTeacherFeedback: (enrolledId: string, feedback: string) => void;
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
      status: 'resolved',
      reply: '已收到您的建议，我们会在下期课程中调整时间安排，感谢您的反馈！'
    }
  ]);
  const [certifyRecords, setCertifyRecords] = useState<CertifyRecord[]>([]);
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([
    { id: 'c001', courseTitle: '亲子创意黏土手工课', date: '2026-06-08', time: '14:00-15:30', checkedIn: true, checkedAt: '14:02' },
    { id: 'c002', courseTitle: '中老年肩颈康复训练', date: '2026-06-07', time: '09:00-10:00', checkedIn: true, checkedAt: '09:05' },
    { id: 'c003', courseTitle: '家庭烘焙：曲奇与小蛋糕', date: '2026-06-20', time: '10:00-12:00', checkedIn: false },
    { id: 'c004', courseTitle: '智能手机与电脑入门', date: '2026-06-17', time: '14:00-16:00', checkedIn: false }
  ]);
  const [teacherSessions, setTeacherSessions] = useState<TeacherCheckInSession[]>([
    {
      id: 'ts001',
      courseTitle: '亲子创意黏土手工课',
      date: '2026-06-15',
      time: '14:00-15:30',
      location: '3号楼2单元 社区活动室',
      students: [
        { id: 'st001', name: '张小明', avatar: 'https://picsum.photos/id/64/100/100', checkedIn: true, checkedAt: '13:55' },
        { id: 'st002', name: '李小红', avatar: 'https://picsum.photos/id/65/100/100', checkedIn: true, checkedAt: '14:00' },
        { id: 'st003', name: '王小宝', avatar: 'https://picsum.photos/id/66/100/100', checkedIn: false },
        { id: 'st004', name: '赵小美', avatar: 'https://picsum.photos/id/67/100/100', checkedIn: false },
        { id: 'st005', name: '刘小豆', avatar: 'https://picsum.photos/id/68/100/100', checkedIn: false }
      ]
    },
    {
      id: 'ts002',
      courseTitle: '家庭烘焙：曲奇与小蛋糕',
      date: '2026-06-20',
      time: '10:00-12:00',
      location: '5号楼1单元 陈老师家',
      students: [
        { id: 'st006', name: '陈阿姨', avatar: 'https://picsum.photos/id/177/100/100', checkedIn: false },
        { id: 'st007', name: '刘大姐', avatar: 'https://picsum.photos/id/1027/100/100', checkedIn: false },
        { id: 'st008', name: '王奶奶', avatar: 'https://picsum.photos/id/1012/100/100', checkedIn: false }
      ]
    }
  ]);

  const addNotification = useCallback((title: string, content: string, type: Notification['type'] = 'system') => {
    const newNotice: Notification = {
      id: `n${Date.now()}`,
      title,
      content,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
      type
    };
    setNotifications(prev => [newNotice, ...prev]);
  }, []);

  const enrollCourse = useCallback((courseId: string, sessionId: string, studentName: string, phone: string, isWaitlist: boolean) => {
    console.log('[AppContext] enrollCourse:', { courseId, sessionId, studentName, isWaitlist });
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;

    const session = course.sessions.find(s => s.id === sessionId);
    if (!session) return false;

    if (!isWaitlist && session.enrolled >= session.capacity) {
      return false;
    }

    if (isWaitlist) {
      const waitlistCount = enrolledCourses.filter(
        e => e.courseId === courseId && e.sessionId === sessionId && e.status === 'waitlist'
      ).length;

      const newEnrolled: EnrolledCourse = {
        id: `e${Date.now()}`,
        courseId: course.id,
        courseTitle: course.title,
        cover: course.cover,
        teacherName: course.teacher.name,
        sessionDate: session.date,
        sessionTime: session.time,
        sessionId: session.id,
        status: 'waitlist',
        waitlistPosition: waitlistCount + 1,
        workUploaded: false,
        reviewSubmitted: false,
        hasFeedback: false
      };

      setEnrolledCourses(prev => [newEnrolled, ...prev]);
      setCourses(prev => prev.map(c => {
        if (c.id === courseId) {
          return {
            ...c,
            sessions: c.sessions.map(s =>
              s.id === sessionId ? { ...s, waitlist: s.waitlist + 1 } : s
            )
          };
        }
        return c;
      }));
      addNotification('候补报名成功', `您已候补报名「${course.title}」${session.date} ${session.time}场次，当前第${waitlistCount + 1}位，有位置时会通知您。`, 'enroll');
    } else {
      const newEnrolled: EnrolledCourse = {
        id: `e${Date.now()}`,
        courseId: course.id,
        courseTitle: course.title,
        cover: course.cover,
        teacherName: course.teacher.name,
        sessionDate: session.date,
        sessionTime: session.time,
        sessionId: session.id,
        status: 'upcoming',
        workUploaded: false,
        reviewSubmitted: false,
        hasFeedback: false
      };

      setEnrolledCourses(prev => [newEnrolled, ...prev]);
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
      addNotification('报名成功通知', `您已成功报名「${course.title}」${session.date} ${session.time}场次，请准时参加。`, 'enroll');
    }

    return true;
  }, [courses, enrolledCourses, addNotification]);

  const promoteWaitlist = useCallback((courseId: string, sessionId: string) => {
    setEnrolledCourses(prev => {
      const waitlistForSession = prev
        .filter(e => e.courseId === courseId && e.sessionId === sessionId && e.status === 'waitlist')
        .sort((a, b) => (a.waitlistPosition || 999) - (b.waitlistPosition || 999));

      if (waitlistForSession.length === 0) return prev;

      const toPromote = waitlistForSession[0];
      const updated = prev.map(e => {
        if (e.id === toPromote.id) {
          return { ...e, status: 'upcoming' as const, waitlistPosition: undefined };
        }
        if (e.courseId === courseId && e.sessionId === sessionId && e.status === 'waitlist' && e.id !== toPromote.id) {
          return { ...e, waitlistPosition: (e.waitlistPosition || 1) - 1 };
        }
        return e;
      });

      const course = courses.find(c => c.id === courseId);
      if (course && toPromote) {
        addNotification(
          '候补转成功',
          `恭喜！您候补的「${toPromote.courseTitle}」${toPromote.sessionDate} ${toPromote.sessionTime}场次有位了，已自动转成报名成功！`,
          'enroll'
        );
      }

      return updated;
    });

    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          enrolledCount: c.enrolledCount + 1,
          sessions: c.sessions.map(s =>
            s.id === sessionId
              ? { ...s, waitlist: Math.max(0, s.waitlist - 1), enrolled: s.enrolled + 1 }
              : s
          )
        };
      }
      return c;
    }));
  }, [courses, addNotification]);

  const cancelEnrollment = useCallback((enrolledId: string) => {
    console.log('[AppContext] cancelEnrollment:', enrolledId);
    
    const enrolled = enrolledCourses.find(e => e.id === enrolledId);
    if (!enrolled) return;

    setEnrolledCourses(prev =>
      prev.map(e => e.id === enrolledId ? { ...e, status: 'cancelled' as const } : e)
    );

    if (enrolled.status === 'upcoming') {
      setCourses(prev => prev.map(c => {
        if (c.id === enrolled.courseId) {
          return {
            ...c,
            enrolledCount: Math.max(0, c.enrolledCount - 1),
            sessions: c.sessions.map(s =>
              s.id === enrolled.sessionId ? { ...s, enrolled: Math.max(0, s.enrolled - 1) } : s
            )
          };
        }
        return c;
      }));

      setTimeout(() => {
        promoteWaitlist(enrolled.courseId, enrolled.sessionId);
      }, 300);
    }

    addNotification('取消报名成功', `您已取消「${enrolled.courseTitle}」的报名。`, 'system');
  }, [enrolledCourses, promoteWaitlist, addNotification]);

  const cancelWaitlist = useCallback((enrolledId: string) => {
    console.log('[AppContext] cancelWaitlist:', enrolledId);
    
    const enrolled = enrolledCourses.find(e => e.id === enrolledId);
    if (!enrolled || enrolled.status !== 'waitlist') return;

    setEnrolledCourses(prev =>
      prev.map(e => {
        if (e.id === enrolledId) {
          return { ...e, status: 'cancelled' as const, waitlistPosition: undefined };
        }
        if (e.courseId === enrolled.courseId && e.sessionId === enrolled.sessionId && e.status === 'waitlist' && (e.waitlistPosition || 0) > (enrolled.waitlistPosition || 0)) {
          return { ...e, waitlistPosition: (e.waitlistPosition || 1) - 1 };
        }
        return e;
      })
    );

    setCourses(prev => prev.map(c => {
      if (c.id === enrolled.courseId) {
        return {
          ...c,
          sessions: c.sessions.map(s =>
            s.id === enrolled.sessionId ? { ...s, waitlist: Math.max(0, s.waitlist - 1) } : s
          )
        };
      }
      return c;
    }));

    addNotification('取消候补成功', `您已取消「${enrolled.courseTitle}」的候补报名。`, 'system');
  }, [enrolledCourses, addNotification]);

  const toggleFavorite = useCallback((courseId: string) => {
    console.log('[AppContext] toggleFavorite:', courseId);
    setCourses(prev => prev.map(c =>
      c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  }, []);

  const submitReview = useCallback((enrolledId: string, rating: number, content: string, imageUrl?: string) => {
    console.log('[AppContext] submitReview:', { enrolledId, rating, content });
    
    const enrolled = enrolledCourses.find(e => e.id === enrolledId);
    if (!enrolled) return;

    const newReview: Review = {
      id: `r${Date.now()}`,
      courseId: enrolled.courseId,
      courseTitle: enrolled.courseTitle,
      rating,
      content,
      createdAt: new Date().toLocaleString('zh-CN')
    };
    setReviews(prev => [newReview, ...prev]);

    setEnrolledCourses(prev => prev.map(e =>
      e.id === enrolledId
        ? { ...e, reviewSubmitted: true, reviewRating: rating, reviewContent: content }
        : e
    ));

    addNotification('评价提交成功', `感谢您对「${enrolled.courseTitle}」的评价，老师会尽快查看！`, 'review');
  }, [enrolledCourses, addNotification]);

  const submitWork = useCallback((enrolledId: string, imageUrl: string) => {
    console.log('[AppContext] submitWork:', { enrolledId, imageUrl });
    
    const enrolled = enrolledCourses.find(e => e.id === enrolledId);
    if (!enrolled) return;

    setEnrolledCourses(prev => prev.map(e =>
      e.id === enrolledId
        ? { ...e, workUploaded: true, workImage: imageUrl }
        : e
    ));

    addNotification('作品上传成功', `您的「${enrolled.courseTitle}」作品已上传，等待老师点评。`, 'review');
  }, [enrolledCourses, addNotification]);

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
    addNotification('投诉反馈已提交', '您的反馈已收到，工作人员会在24小时内处理。', 'system');
  }, [addNotification]);

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
    addNotification('资质认证已提交', '您的老师资质认证已提交审核，预计1-3个工作日内完成。', 'system');
  }, [addNotification]);

  const studentCheckIn = useCallback((recordId: string) => {
    console.log('[AppContext] studentCheckIn:', recordId);
    
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
      addNotification('签到成功', `「${record.courseTitle}」签到成功，获得10邻里积分！`, 'system');
    }
  }, [checkInRecords, addNotification]);

  const teacherCheckInStudent = useCallback((sessionId: string, studentId: string) => {
    console.log('[AppContext] teacherCheckInStudent:', { sessionId, studentId });
    
    setTeacherSessions(prev => prev.map(session => {
      if (session.id !== sessionId) return session;
      return {
        ...session,
        students: session.students.map(st =>
          st.id === studentId
            ? { ...st, checkedIn: true, checkedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
            : st
        )
      };
    }));
  }, []);

  const reviewCourse = useCallback((courseId: string, action: 'approve' | 'reject', rejectReason?: string) => {
    console.log('[AppContext] reviewCourse:', { courseId, action, rejectReason });
    
    setPublishedCourses(prev => prev.map(c =>
      c.id === courseId
        ? { ...c, status: action === 'approve' ? 'approved' as const : 'rejected' as const, rejectReason }
        : c
    ));

    const course = publishedCourses.find(c => c.id === courseId);
    if (course) {
      const msg = action === 'approve'
        ? `您的课程「${course.title}」审核已通过，快去招生吧！`
        : `您的课程「${course.title}」审核未通过，原因：${rejectReason || '请修改后重新提交。'}`;
      addNotification(`课程审核${action === 'approve' ? '通过' : '未通过'}`, msg, 'system');
    }
  }, [publishedCourses, addNotification]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const submitTeacherFeedback = useCallback((enrolledId: string, feedback: string) => {
    console.log('[AppContext] submitTeacherFeedback:', { enrolledId, feedback });

    const enrolled = enrolledCourses.find(e => e.id === enrolledId);
    if (!enrolled) return;

    setEnrolledCourses(prev => prev.map(e =>
      e.id === enrolledId
        ? { ...e, hasFeedback: true, feedbackContent: feedback }
        : e
    ));

    addNotification(
      '收到老师反馈',
      `您的「${enrolled.courseTitle}」收到老师的新反馈，快去查看吧！`,
      'review'
    );
  }, [enrolledCourses, addNotification]);

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
    teacherSessions,
    enrollCourse,
    cancelEnrollment,
    cancelWaitlist,
    toggleFavorite,
    submitReview,
    submitWork,
    submitFeedback,
    submitCertify,
    studentCheckIn,
    teacherCheckInStudent,
    reviewCourse,
    markNotificationRead,
    submitTeacherFeedback
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
