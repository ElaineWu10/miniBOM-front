<template>
    <el-container>
        <el-aside width="200px">
            <common-aside/>
        </el-aside>
        <el-container>
            <el-header>
              <common-header/>
            </el-header>
            <el-main>
             <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
//引用通用组件components
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'
export default {
    data(){
        return{}
    },
    components:{
        CommonAside,
        CommonHeader
    }
}
</script>

<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
    padding: 0px;
  }
  
  .el-aside {
    color: #333;
  }

  .el-container {
    margin: 0px;
    height:100vh;
  }

</style>