// 左侧导航栏页面名称
//icon在elementui中能查找：https://element.eleme.cn/#/zh-CN/component/icon#icon-tu-biao
const MenuData= [
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 's-home',
    url: 'Home/Home'
  },
  {
    path: '/mall',
    name: 'mall',
    label: '数据管理',
    icon: 'video-play',
    url: 'MallManage/MallManage'
  },
  {
    path: '/user',
    name: 'user',
    label: '用户管理',
    icon: 'user',
    url: 'UserManage/UserManage'
  },
  {
    label: '其他',
    icon: 'location',
    children: [
      {
        path: '/page1',
        name: 'page1',
        label: '页面1',
        icon: 'setting',
        url: 'Other/PageOne'
      },
      {
        path: '/page2',
        name: 'page2',
        label: '页面2',
        icon: 'setting',
        url: 'Other/PageTwo'
      }
    ]
  }
]

export default MenuData