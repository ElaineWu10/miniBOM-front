<!-- 顶部导航栏页面 -->

<template>
    <div class="header-container">
        <div class="l-content">
            <el-button @click="handleMenu" icon="el-icon-menu" size="mini"></el-button>
            <!-- 面包屑 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in tags" :key="item.path" :to="{ path: item.path }">{{ item.label }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown @command="handleCommand">
                <h1 class="username">{{showUsername}}</h1>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item command="Login">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import jsCookie from "js-cookie"
export default {
    methods:{
        //触发下拉框跳转
        handleCommand(command){
            this.$router.replace({name:command})
        },
    },
    computed: {
        ...mapState({
            tags: state => state.tab.tabList
        }),
        showUsername(){
            return jsCookie.get('username')
        }
    }
}
</script>


<style lang="less" scoped>

.header-container {
    background-color: #fff;
    height: 60px;
    
    border-bottom: 1px solid #ccc;

    // 让按钮和头像居中
    display: flex; 
    justify-content: space-between;
    align-items: center;
    // 不要紧贴边框
    padding: 0 20px;

    .r-content{
        float: right;
        margin-top: 10px;
    }
    
    .username {
        margin-top: 0px;
        color:#111;
        margin: 0px; 
        padding: 0px;
    }
}
.l-content{
    float: left;
    display: flex;
    // 上下居中
    align-items: center;
    margin-top: 15px;
    .el-breadcrumb {
        margin-left: 15px;
        // deep 强制生效
        /deep/.el-breadcrumb__item {
            .el-breadcrumb__inner {
                &.is-link {
                    color: #666;
                }
            }

            &:last-child {
                .el-breadcrumb__inner {
                    color: #111;
                }
            }
        }
    }
}
</style>