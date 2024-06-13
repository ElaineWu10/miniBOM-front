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
    path: '/attrManage',
    name: 'attrManage',
    label: '属性管理',
    icon: 'edit',
    url: 'AttrManage'
  },
  {
    path: '/categoryManage',
    name: 'CategoryManage',
    label: '分类管理',
    icon: 'document',
    url: 'CategoryManage'
  },
  {
    label: 'Part&BOM管理',
    icon: 'setting',
    children: [
      {
        path: '/partManage',
        name: 'partManage',
        label: 'Part管理',
        icon: 'setting',
        url: 'PartManage'
      },
      {
        path: '/BOMManage',
        name: 'BOMManage',
        label: 'BOM属性管理',
        icon: 'cpu',
        url: 'BOMManage'
      },
      {
        path: '/inheritManage',
        name: 'inheritManage',
        label: '父子项管理',
        icon: 'connection',
        url: 'InheritManage'
      }
    ]
  }
]

export default MenuData