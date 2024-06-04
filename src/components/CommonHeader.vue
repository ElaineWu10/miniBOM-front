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
                <span class="el-dropdown-link">
                    <img class="user" src="../assets/pic1.jpg" alt="">
                </span>
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
        })
    }
}
</script>


<style lang="less" scoped>

.header-container {
    background-color: #333;
    height: 60px;

    // 让按钮和头像居中
    //display: flex;
    justify-content: space-between;
    align-items: center;
    // 不要紧贴边框
    padding: 0 20px;

    .r-content{
        float: right;
        margin-top: 10px;
    }


    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    
        .user {
            width: 40px;
            height: 40px;
            // 50%变圆形
            border-radius: 50%;
        }
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
                    color: #fff;
                }
            }
        }
    }
}
</style>