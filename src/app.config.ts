export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/afterclass/index',
    'pages/publish/index',
    'pages/mine/index',
    'pages/detail/index',
    'pages/enroll/index',
    'pages/upload/index',
    'pages/manage/index',
    'pages/notice/index',
    'pages/points/index',
    'pages/feedback/index',
    'pages/certify/index',
    'pages/review/index',
    'pages/checkin/index',
    'pages/students/index',
    'pages/reviewlist/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF6B35',
    navigationBarTitleText: '邻居技能课堂',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF8F0'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#FF6B35',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/afterclass/index',
        text: '课后'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
