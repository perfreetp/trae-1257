export default defineAppConfig({
  pages: [
    'pages/discover/index',
    'pages/guide/index',
    'pages/scan/index',
    'pages/activity/index',
    'pages/mine/index',
    'pages/exhibition-detail/index',
    'pages/exhibit-detail/index',
    'pages/route-detail/index',
    'pages/activity-detail/index',
    'pages/checkin/index',
    'pages/share-poster/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '数字文化馆',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F8F5F0'
  },
  tabBar: {
    color: '#9B9B9B',
    selectedColor: '#8B5A2B',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/discover/index',
        text: '发现'
      },
      {
        pagePath: 'pages/guide/index',
        text: '导览'
      },
      {
        pagePath: 'pages/scan/index',
        text: '扫码'
      },
      {
        pagePath: 'pages/activity/index',
        text: '活动'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
