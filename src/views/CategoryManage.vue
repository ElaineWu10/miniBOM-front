<template>
  <div style="padding: 5px 20px;">
    <br>
    <!-- 标题 -->
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="分类信息查询">
            <el-input v-model="searchData" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item> 
            <el-button type="primary" @click="onSubmitSelect" icon="el-icon-search" plain>查询</el-button>
        </el-form-item>  
        <el-form-item>
            <el-button type="success" @click="TJCollectionForm" icon="el-icon-edit" plain>新增</el-button>
        </el-form-item>
        <el-form-item> 
            <el-button type="primary" @click="refreshMenu" icon="el-icon-refresh" plain>重置</el-button>
        </el-form-item> 
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="分类码" width="200" prop="businessCode">
      </el-table-column>
      <el-table-column label="分类中文名称" prop="name">
        <template slot-scope="scope">
          <el-link type="primary" @click="detailInfo(scope)">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类英文名称" prop="nameEn">
      </el-table-column>
      <el-table-column label="分类描述" prop="description">
      </el-table-column>
      <el-table-column label="分类英文描述" prop="descriptionEn">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="BJCollectionForm(scope)" plain></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteVisible(scope)" plain></el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="handleClose">
    <!-- 增加tab -->
    <el-tabs v-model="dialogTab">
      <el-tab-pane label="基本信息" name="basicInfo" :key="'basicInfo'">
      <el-form ref="collectionform" :rules="rules" :model="ruleForm" label-width="100px" label-position="left">
        <!-- 并排显示 -->
        <el-row type="flex">   
            <el-col :span="10">
                <el-form-item label="中文名称" prop="name">
                <!-- :readonly="dialogStatus=='detail'"  设置只读 -->
                <el-input placeholder="请输入" v-model="ruleForm.name" :readonly="dialogStatus=='detail'"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="3"></el-col>
            <el-form-item label="中文描述" prop="description">
            <el-input placeholder="请输入" v-model="ruleForm.description" :readonly="dialogStatus=='detail'"></el-input>
            </el-form-item>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
                <el-form-item label="英文名称" prop="nameEn">
                <el-input placeholder="请输入" v-model="ruleForm.nameEn" :readonly="dialogStatus=='detail'"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="3"></el-col>
            <el-form-item label="英文描述" prop="descriptionEn">
            <el-input placeholder="请输入" v-model="ruleForm.descriptionEn" :readonly="dialogStatus=='detail'"></el-input>
        </el-form-item>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
                <el-form-item label="分类码" prop="businessCode">
                <el-input placeholder="请输入" v-model="ruleForm.businessCode" :readonly="dialogStatus=='detail'"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="3"></el-col>

            <el-form-item label="分类父节点" prop="parentNode"  v-if="dialogStatus=='create'">
            <el-select ref="selectParent" v-model="parentData.name" placeholder="请选择" @focus="getParent" @change="selectParent(parentData.name)" :disabled="dialogStatus=='detail'">
              <el-option v-for="item in parentData" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
            </el-form-item>
            
            <!-- 详情时显示 -->
            <el-form-item label="分类父节点" v-if="dialogStatus=='detail'">
                <el-input v-model="parentName" :readonly="dialogStatus=='detail'"></el-input>
            </el-form-item>
        </el-row type="flex">
        </el-form> 
      <div class="dialog-footer" v-if="dialogStatus!='detail'">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus=='create'" @click="submitCollectionForm('collectionform')">添 加</el-button>
        <el-button type="warning" v-else @click="updateCollectionForm('collectionform')">修 改</el-button>
      </div>
      </el-tab-pane>
      <el-tab-pane label="属性" name="EXAInfo" :key="'EXAInfo'" v-if="dialogStatus!='create'">
        <el-form ref="existEXAform" :model="ruleForm" label-width="100px" label-position="left">
        <!-- 属性表格 -->
        <el-form-item label="已选属性列表" prop="EXAlist">
          <el-table :data="existEXAList" v-loading="loading" @selection-change="handleExistSelectionChange">
           <el-table-column type="selection" :selectable="checkSelectable">
           </el-table-column>
           <el-table-column label="属性中文名称" prop="source.name">
           </el-table-column>
           <el-table-column label="属性中文描述" prop="source.description">
           </el-table-column>
           <el-table-column label="属性英文名称" prop="source.nameEn">
           </el-table-column>
           <el-table-column label="属性英文描述" prop="source.descriptionEn">
           </el-table-column>
           <el-table-column label="数据类型" prop="source.type">
           </el-table-column>
          </el-table>
        </el-form-item>
        </el-form>
        <el-form ref="notExistEXAform" :model="ruleForm" label-width="100px" label-position="left" v-if="dialogStatus=='update'">
        <el-form-item label="未选属性列表" prop="EXAlist">
          <el-table :data="notExistEXAList" @selection-change="handleNotExistSelectionChange">
           <el-table-column type="selection">
           </el-table-column>
           <el-table-column label="属性中文名称" prop="name">
           </el-table-column>
           <el-table-column label="属性中文描述" prop="description">
           </el-table-column>
           <el-table-column label="属性英文名称" prop="nameEn">
           </el-table-column>
           <el-table-column label="属性英文描述" prop="descriptionEn">
           </el-table-column>
           <el-table-column label="数据类型" prop="type">
           </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" v-if="dialogStatus=='update'">
        <el-button type="primary" @click="submitEXAForm()">添 加</el-button>
        <el-button @click="deleteEXAForm()">移 除</el-button>
      </div>
      </el-tab-pane>
      </el-tabs>
    </el-dialog>
 
 
  </div>
</template>
 
<script>
 
  export default {
    data() {
      return {
        listLoading: true,

        //属性列表
        EXAlist: null,
        existEXAList: [],
        notExistEXAList: null,

        //全部分类列表
        AllList: null,
        total: 0,
        //分页的分类列表
        list: null,

        //获取父节点
        parentData: [],
        parentName: '',

        listQuery: {
          page: 1,
          limit: 10
        },

        //查询所用数据
        searchData: '',
        searchId: '',

        //添加属性的分类id
        addEXAId: '',
        //添加属性的列表
        addEXAList: null,
        //移除属性的列表
        deleteEXAList: [], 

        dialogFormVisible: false,
        dialogStatus: 'create',
        textMap: {
          update: '修改分类',
          create: '添加分类',
          detail: '分类详情',
        },

        dialogTab: "basicInfo",
 
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

        //规定输入框规则：必填
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

      //查询
      onSubmitSelect() {
        if(this.searchData=='') this.$message.error("请输入查询关键字")
        else{
          this.AllList.forEach((item)=>{
            if(item.name==this.searchData) this.searchId=item.id;
          })
          this.$axios({
            method: 'post',
            url: 'classificationNode/get',
            data: {
              'id': this.searchId
            }
          }).then((response) => {
            this.listLoading = false;
            this.list = response.data.data;
            console.log(response.data.data);
            console.log(this.list);
            this.total=1;
          })
        }
      },

      //重置
      refreshMenu(){
        this.searchData= '';
        this.axiosdata();
      },

      //向后端发送获取分类的请求
      axiosdata() {
        this.listLoading = true;
        this.$axios({
          method: 'post',
          url: 'classificationNode/find/',
        }).then((response) => {
          this.listLoading = false;
          this.AllList=response.data.data;
          this.list = response.data.data.slice(
            (this.listQuery.page - 1) * 10,
            this.listQuery.page * 10 );
          console.log(response.data.data);
          console.log(this.list);
          this.total = response.data.data.length;
        })
      }, 

      //向后端发送获取属性数据的请求
      axiosEXAdata(classificationId){
        this.$axios({
          method: 'post',
          url: 'exaDefinition/find'
        }).then((response)=>{
          this.EXAList=[];
          if(response.data.result=="SUCCESS"){
            this.EXAList=response.data.data;
            console.log(this.EXAList);
            this.$axios({
              method: 'post',
              url: 'exaDefinitionLink/findById/'+classificationId
            }).then((response)=>{
              this.existEXAList=response.data.data;
              console.log(this.existEXAList);
              this.notExistEXAList = [];
              this.EXAList.forEach((item)=>{
                let tag=0;
                this.existEXAList.forEach((item1)=>{
                  if(item1.source.id==item.id) tag=1;
                })
                if(tag==0) this.notExistEXAList.push(item)
              })
            })
          }
        });
        
      },
  
      /* 处理父节点select下拉框，获取父节点 */
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

       /* 添加分类基本信息 */
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
                    //this.dialogFormVisible = false;
                    this.$message.success('添加数据成功');
                } else {
                    this.$message.error('添加数据失败');
                }
                })
            }else{
                //没有父节点时，重新构建数据向后端传输。
                this.$axios({
                method: 'post',
                url: 'classificationNode/create',
                data: {
                  'name' : this.ruleForm.name,
                  'nameEn': this.ruleForm.nameEn,
                  'description': this.ruleForm.description,
                  'descriptionEn': this.ruleForm.descriptionEn,
                  'businessCode': this.ruleForm.businessCode
                }
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


      /* 显示编辑弹窗 */
      BJCollectionForm(scope) {
        //显示修改对话框
        this.ruleForm = JSON.parse(JSON.stringify(this.list[scope.$index]))
 
        this.dialogStatus = "update"
        this.dialogFormVisible = true
        this.addEXAId=scope.row.id;
        this.axiosEXAdata(scope.row.id)
      },

      handleClose(){
        this.$refs.collectionform.resetFields();
      },

      /* 分类中已存在属性 多选 */
      handleExistSelectionChange(val){
        console.log(val);
        this.deleteEXAList=[];
        val.forEach((item)=>{
          this.deleteEXAList.push(item.id);
        })
      },

      /* 分类发送移除属性请求 */
      deleteEXAForm(){
        if(this.deleteEXAList==null) this.$message.error('请选择移除的分类');
        else{
          this.$axios({
            method:'post',
            url:'exaDefinitionLink/batchDelete',
            data: {
              'ids':this.deleteEXAList
            }
          }).then((response)=>{
            console.log(response)
            if (response.data.result == "SUCCESS") {
                this.axiosEXAdata(this.addEXAId);
                this.$message.success('移除分类成功');
            } else {
                this.$message.error('移除分类失败');
            }
          })
        }     
      },

      /* 分类中未存在属性 多选 */
      handleNotExistSelectionChange(val){
        console.log(val);
        this.addEXAList=[];
        val.forEach((item)=>{
          this.addEXAList.push({
            "target": {
              "id": this.addEXAId,
              "clazz": "ClassificationNode"
            },
            "source":{
              "id": item.id
            }
          })
        })
      },

      /* 分类发送提交新属性请求 */
      submitEXAForm(){ 
        if(this.addEXAList==null) this.$message.error('请选择要添加的分类');
        else{
          this.$axios({
            method:'post',
            url:'exaDefinitionLink/batchCreate',
            data: this.addEXAList
          }).then((response)=>{
            if (response.data.result == "SUCCESS") {
                this.axiosEXAdata(this.addEXAId);
                this.$message.success('添加分类成功');
            } else {
                this.$message.error('添加分类失败');
            }
          })
        }      
      },

      /* 提交修改 */
      updateCollectionForm(formname) {
        this.$refs[formname].validate((valid) => {
          if (valid) {
            this.$axios({
              method: 'post',
              url: 'classificationNode/update',
              data: {
                'id': this.addEXAId,
                'name' : this.ruleForm.name,
                'nameEn': this.ruleForm.nameEn,
                'description': this.ruleForm.description,
                'descriptionEn': this.ruleForm.descriptionEn,
                'businessCode': this.ruleForm.businessCode
              }
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
          }
        });
      },    
 
      /* 显示添加弹窗 */
      TJCollectionForm() {
        /* 表单重置*/
        Object.assign(this.$data.ruleForm, this.$options.data().ruleForm);
 
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },

      /* 显示详情弹窗 */
      detailInfo(scope){
        this.ruleForm = JSON.parse(JSON.stringify(this.list[scope.$index]))
        this.parentName='';
        console.log(this.ruleForm.parentNode)
        if(this.ruleForm.parentNode==null) this.parentName="ROOT";
        else{
          this.getParent();
          this.parentData.forEach((item)=>{
            if(item.id==this.ruleForm.parentNode.id) {
              this.parentName=item.name;
            }
          })
        }
        this.dialogStatus = "detail"
        this.dialogFormVisible = true
        this.axiosEXAdata(scope.row.id)
      },

      /* 禁用属性多选 */
      checkSelectable(){
        if(this.dialogStatus=='detail') return false;
        else return true;
      },
      
      /* 删除 */
      deleteVisible(scope) {
        this.$confirm('确定要删除【' + scope.row.name + '】吗？', '提示', {
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
              console.log("删除：",response)
            if (response.data.result == "SUCCESS") {
              this.axiosdata();
              this.dialogFormVisible = false;
              this.$message.success('删除成功')
            } else {
              this.$message.error('删除失败');
            }
          })
          //一定要加上catch处理，否则会报错
        }).catch((error)=>{
          if(error !== 'cancel'){
            this.$message.error('操作失败');
          }
        });
 
      },
    },
  }

</script>
 
<style>
</style>