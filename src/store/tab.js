//组件间通信  VueX

export default {
    state: {
        tabList: [
            {
                path: '/home',
                name: 'home',
                label: '首页',
                icon: 's-home',
                url: 'Home/Home'
            }
        ],//面包屑的数据:点了哪个路由,首页是一定有的
        menu: [],
    },
    mutations: {
        //更新面包屑的数据
        SelectMenu(state, item) {
            // 如果点击的不在面包屑数据中,则添加
            const index = state.tabList.findIndex(val => val.name === item.name)
            if (index === -1) {
                state.tabList.push(item)
            }else {
                state.tabList.splice(index+1);
            }
        }
        
    }
}