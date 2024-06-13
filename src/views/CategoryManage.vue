<template>
  <div style="padding: 5px 20px;">
    <br>
    <!-- 标题 -->
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="分类信息查询">
            <el-input v-model="listQuery.unit_name" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item> 
            <el-button type="primary" @click="onSubmitSelect" icon="el-icon-search">查询</el-button>
        </el-form-item>  
        <el-form-item>
            <el-button type="success" @click="TJCollectionForm" icon="el-icon-edit">新增</el-button>
        </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="分类码" width="200" prop="businessCode">
      </el-table-column>
      <el-table-column label="分类中文名称" prop="name">
      </el-table-column>
      <el-table-column label="分类英文名称" prop="nameEn">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="BJCollectionForm(scope.$index)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteVisible(scope)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"
      :background="true" >
    </el-pagination>
 
    <!-- 新增弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="collectionform" :rules="rules" :model="ruleForm" label-width="100px" label-position="left">
        <!-- 并排显示 -->
        <el-row type="flex">
            <el-col :span="10">
                <el-form-item label="分类码" prop="businessCode">
                <el-input placeholder="请输入" v-model="ruleForm.businessCode"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="3"></el-col>
            <el-form-item label="分类父节点" prop="parentNode" >
        <!-- 下拉框参考https://juejin.cn/post/6993316433509744677 -->
            <el-select v-model="parentData.name" placeholder="请选择" @focus="getParent" @change="selectParent(parentData.name)">
              <el-option v-for="item in parentData" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
            </el-form-item>
        </el-row>
        <el-row type="flex">   
            <el-col :span="10">
                <el-form-item label="中文名称" prop="name">
                <el-input placeholder="请输入" v-model="ruleForm.name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="3"></el-col>
            <el-form-item label="中文描述" prop="description">
            <el-input placeholder="请输入" v-model="ruleForm.description"></el-input>
            </el-form-item>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
                <el-form-item label="英文名称" prop="nameEn">
                <el-input placeholder="请输入" v-model="ruleForm.nameEn"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="3"></el-col>
            <el-form-item label="英文描述" prop="descriptionEn">
            <el-input placeholder="请输入" v-model="ruleForm.descriptionEn"></el-input>
        </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus=='create'" @click="submitCollectionForm('collectionform')">添 加</el-button>
        <el-button type="warning" v-else @click="updateCollectionForm('collectionform')">修 改</el-button>
      </div>
    </el-dialog>
 
 
  </div>
</template>
 
<script>
 
  export default {
    data() {
      return {
        listLoading: true,
        list: null,
        total: 0,
        parentData: [],
        listQuery: {
          page: 1,
          limit: 10,
          unit_name: ''
        },
        dialogFormVisible: false,
        dialogStatus: 'create',
        textMap: {
          update: '修改分类',
          create: '添加分类'
        },
 
        ruleForm: {
          businessCode: '',
          name: '',
          nameEn: '',
          description: '',
          descriptionEn: '',
          parentNode: {
            id: ''
          },
        },

        ruleFormNoParent:{
          businessCode: '',
          name: '',
          nameEn: '',
          description: '',
          descriptionEn: '', 
        },

        //输入框规则：必填
        rules: {
          name: [{
            required: true,
            message: '请输入中文名称',
            trigger: 'blur'
          }],
          nameEn: [{
            required: true,
            message: '请输入英文名称',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.axiosdata()
    },
    methods: {
      //处理分页
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.axiosdata();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.axiosdata();
      },

      onSubmitSelect() {
        this.axiosdata()
      },

      //向后端发送请求
      axiosdata() {
        this.listLoading = true;
        this.$axios({
          method: 'post',
          url: 'classificationNode/find/',
          headers: {
            //'token': this.$store.getters.token
          }
        }).then((response) => {
          this.listLoading = false;
          
          this.list = response.data.data.slice(
        (this.listQuery.page - 1) * 10,
        this.listQuery.page * 10 );
          console.log(response.data.data);
          console.log(this.list);
          this.total = response.data.data.length;
        })
      },  

      /* 处理父节点select下拉框 */
      getParent(){
        this.$axios({
            method:'post',
            url: 'classificationNode/find'
        }).then((response)=>{
            this.parentData=response.data.data;
            console.log(this.parentData)
        })
      }, 

      /* 接收父节点下拉框选择数据 */
      selectParent(val){
        this.ruleForm.parentNode.id=val;
        console.log(val);
      },

       /* 添加 */
      submitCollectionForm(formname) {
        this.$refs[formname].validate((valid) => {
          if (valid) {
            if(this.ruleForm.parentNode.id){
                this.$axios({
                method: 'post',
                url: 'classificationNode/create',
                data: this.ruleForm
                }).then((response) => {
                    console.log(response.data.result);
                if (response.data.result == "SUCCESS") {
                    this.axiosdata();
                    this.dialogFormVisible = false;
                    this.$message.success('添加数据成功');
                } else {
                    this.$message.error('添加数据失败');
                }
                })
            }else{
                //没有父节点时，使用ruleFormNoParent向后端传输数据。
                this.ruleFormNoParent.name=this.ruleForm.name;
                this.ruleFormNoParent.nameEn=this.ruleForm.nameEn;
                this.ruleFormNoParent.description=this.ruleForm.description;
                this.ruleFormNoParent.descriptionEn=this.ruleForm.descriptionEn;
                this.ruleFormNoParent.businessCode=this.ruleForm.businessCode;
                this.$axios({
                method: 'post',
                url: 'classificationNode/create',
                data: this.ruleFormNoParent
                }).then((response) => {
                    console.log(response.data.result);
                if (response.data.result == "SUCCESS") {
                    this.axiosdata();
                    this.dialogFormVisible = false;
                    this.$message.success('添加数据成功');
                } else {
                    this.$message.error('添加数据失败');
                }
                })
            }
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }, 

      /* 修改 */
      updateCollectionForm(formname) {
        this.$refs[formname].validate((valid) => {
          /*if (valid) {
            this.$axios({
              method: 'post',
              url: '',
              data: this.ruleForm
            }).then((response) => {
              if (response.data.result == "SUCCESS") {
                this.axiosdata();
                this.dialogFormVisible = false;
                this.$message.success('修改数据成功');
              } else {
                this.$message.error('修改数据失败');
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }*/
        });
      },  
 
      /* 添加表单*/
      TJCollectionForm() {
        /* 表单重置*/
        Object.assign(this.$data.ruleForm, this.$options.data().ruleForm);
 
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      /* 编辑表单*/
      BJCollectionForm($index) {
        //显示修改对话框
        this.ruleForm = JSON.parse(JSON.stringify(this.list[$index]))
        //以下效果和上面的不一样
        //this.ruleForm=this.list[$index]
 
        this.dialogStatus = "update"
        this.dialogFormVisible = true
 
      },
 
     
      
      /* 删除 */
      deleteVisible(scope) {
        this.$confirm('确定要删除【' + scope.row.id + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            method: 'post',
            url: 'classificationNode/delete',
            data: {
                id:scope.row.id,
            },
            }).then((response) => {
            if (response.data.result == "SUCCESS") {
              this.axiosdata();
              this.dialogFormVisible = false;
              this.$message.success('删除成功')
            } else {
              this.$message.error('删除失败');
            }
          })
        });
 
      },
    },
  }

</script>
 
<style>
</style>