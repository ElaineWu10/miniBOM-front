<!-- 左侧导航栏组件 -->

<template>
  <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
    :collapse="isCollapse" text-color="#fff">
    <h3> miniBOM </h3>
    <el-menu-item @click="clickItem(item)" v-for="item in noChildren" :key="item.name" :index="item.name">
        <!-- 这里是字体图标,用模板字符串拼接,注意要动态绑定 -->
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{item.label}}</span>
    </el-menu-item>

    <el-submenu v-for="item in hasChildren" :key="item.label" :index="item.label">
        <template slot="title">
            <i :class="`el-icon-${item.icon}`"></i>
            <span slot="title">{{ item.label }}</span>
        </template>
        <el-menu-item-group v-for="subItem in item.children" :key="subItem.name">
            <el-menu-item @click="clickItem(subItem)" :index="subItem.name">{{ subItem.label }}</el-menu-item>
        </el-menu-item-group>
    </el-submenu>
</el-menu>
</template>

<script>
import MenuData from '../data/MenuData'
export default {
    data() {
        return {
            MenuData
        };
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        //页面跳转
        clickItem(item){
            // 防止自己跳自己的报错
            if(this.$route.path!==item.path&&!(this.$route.path==='/home'&&(item.path==='/'))){
                this.$router.push(item.path)
            }
            // 面包屑
            this.$store.commit('SelectMenu',item)
        }

    },
    computed:{
        //判断有无子目录
        noChildren(){
            // 如果没有children则返回true,会被过滤器留下
            return this.MenuData.filter(item=>!item.children)
        },
        hasChildren(){
            return this.MenuData.filter(item=>item.children)
        },
        MenuData() {
            return JSON.parse(cookie.get('menu')) || this.$store.state.tab.menu
        }
    }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.el-menu{
    height:100%;
    background-color:#606266;
    h3 {
        text-align: center;
        line-height: 48px;
        color: #fff;
        font-size: 16px;
        font-weight: 400;
    }
}
</style>