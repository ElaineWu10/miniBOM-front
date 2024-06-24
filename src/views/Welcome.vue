<template>
  <div class="container">
      <h1 style="text-align: center; font-size: 40px;">miniBOM管理系统</h1>
    <div class="row" style="justify-content: center;">
      <div class="col-md-4" style="background-color: #e0e0e0; padding: 20px; text-align: center;">
        <h2 >属性管理</h2>
        <ul>
          <li><a href="#">创建属性</a></li>
          <li><a href="#">修改属性</a></li>
          <li><a href="#">删除属性</a></li>
          <li><a href="#">查询属性</a></li>
        </ul>
      </div>
      <div class="col-md-4" style="background-color: #e0e0e0; padding: 20px; text-align: center;">
        <h2>分类管理</h2>
        <ul>
          <li><a href="#">创建分类模板</a></li>
          <li><a href="#">修改分类模板</a></li>
          <li><a href="#">作废分类模板</a></li>
          <li><a href="#">查询单个分类</a></li>
          <li><a href="#">查询所有分类</a></li>
        </ul>
      </div>
      <div class="col-md-4" style="background-color: #e0e0e0; padding: 20px; text-align: center;">
        <h2 >Part管理 & BOM管理</h2>
        <ul>
          <li><a href="#">创建部件</a></li>
          <li><a href="#">修改部件</a></li>
          <li><a href="#">删除部件版本</a></li>
          <li><a href="#">查询部件</a></li>
          <li><a href="#">查询小版本</a></li>
          <li><a href="#">父子项管理</a></li>
          <li><a href="#">BOM属性管理</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import AttrManage from './AttrManage.vue';

export default {
name: 'Welcome',
methods: {
  // goToAttrManage() {
  //   this.$router.replace({path: "/attrManage"});
  // },
  // goToCategoryManage() {
  //   this.$router.replace({path:"./categoryManage"});
  // },
  // goToPartBOMManage() {
  //   this.$router.replace({path:"./artManage"})
  // }
}
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
}

.col-md-4 {
  padding: 10px;
  width: 25%;
  margin: 0 10px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  text-decoration: underline;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

a {
  text-decoration: none;
  color: #007bff;
}

</style>
