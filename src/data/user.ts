import { UserInfo, Notification } from '@/types';

export const currentUser: UserInfo = {
  id: 'u001',
  name: '李小明',
  avatar: 'https://picsum.photos/id/1005/200/200',
  points: 1280,
  isTeacher: true,
  certified: true,
  community: '阳光花园小区'
};

export const notifications: Notification[] = [
  {
    id: 'n001',
    title: '报名成功通知',
    content: '您已成功报名「亲子创意黏土手工课」，请准时参加。',
    time: '2026-06-10 14:30',
    read: false,
    type: 'enroll'
  },
  {
    id: 'n002',
    title: '课程提醒',
    content: '您报名的「智能手机与电脑入门」将于明天14:00开始，请提前准备。',
    time: '2026-06-16 09:00',
    read: false,
    type: 'course'
  },
  {
    id: 'n003',
    title: '老师回复了您的作品',
    content: '陈老师对您的烘焙作品「曲奇饼干」进行了点评，快去看看吧！',
    time: '2026-06-12 10:15',
    read: true,
    type: 'review'
  },
  {
    id: 'n004',
    title: '课程审核通过',
    content: '您发布的「书法入门：楷书基础」已通过审核，开始招生吧！',
    time: '2026-06-08 16:00',
    read: true,
    type: 'system'
  },
  {
    id: 'n005',
    title: '邻里积分+50',
    content: '恭喜您完成「亲子创意黏土手工课」，获得邻里积分50分！',
    time: '2026-06-08 16:30',
    read: true,
    type: 'system'
  }
];
