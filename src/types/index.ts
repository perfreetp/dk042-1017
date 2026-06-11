export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CourseSession {
  id: string;
  date: string;
  time: string;
  capacity: number;
  enrolled: number;
  waitlist: number;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  intro: string;
  certified: boolean;
  rating: number;
}

export interface Course {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  cover: string;
  teacher: Teacher;
  location: string;
  maxStudents: number;
  enrolledCount: number;
  sessions: CourseSession[];
  materialFee: number;
  suitableAge: string;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  status: 'recruiting' | 'ongoing' | 'ended';
}

export interface EnrolledCourse {
  id: string;
  courseId: string;
  courseTitle: string;
  cover: string;
  teacherName: string;
  sessionDate: string;
  sessionTime: string;
  sessionId: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'waitlist';
  waitlistPosition?: number;
  workUploaded: boolean;
  workImage?: string;
  reviewSubmitted: boolean;
  reviewRating?: number;
  reviewContent?: string;
  hasFeedback: boolean;
  feedbackContent?: string;
}

export interface PublishedCourse {
  id: string;
  title: string;
  cover: string;
  enrolledCount: number;
  maxStudents: number;
  status: 'pending' | 'approved' | 'rejected';
  nextSession: string;
  rejectReason?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
  type: 'system' | 'enroll' | 'review' | 'course';
}

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  points: number;
  isTeacher: boolean;
  certified: boolean;
  community: string;
}

export interface Work {
  id: string;
  courseTitle: string;
  image: string;
  uploadedAt: string;
  teacherFeedback?: string;
}

export interface Review {
  id: string;
  courseId: string;
  courseTitle: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface CheckInStudent {
  id: string;
  name: string;
  avatar: string;
  checkedIn: boolean;
  checkedAt?: string;
}
