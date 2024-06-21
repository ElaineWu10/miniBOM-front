<template>
  <div style="padding: 5px 20px;">
    <br>
    <!-- 标题 -->
    <el-form :inline="true" :model="listQuery" class="demo-form-inline" :rules="rules">
    <el-row type="flex">
      <el-col>
        <el-form-item>
            <el-radio-group v-model="searchType">
              <el-row type="flex">
                <el-col :span="10">
                <el-radio label="partId">按编码查询
                    <el-input v-model="searchPartId" :readonly="searchType=='partName'"></el-input>
                </el-radio>
                </el-col>
                <el-col :span="5"></el-col>
                <el-col :span="10">
                <el-radio label="partName">按部件名称
                    <el-input v-model="searchPartName" :readonly="searchType=='partId'"></el-input>
                </el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
        </el-form-item>
      </el-col>
        <el-form-item> 
            <el-button type="primary" @click="submitSearch" icon="el-icon-search">查询</el-button>
        </el-form-item>  
        <el-form-item>
            <el-button type="success" @click="addNewPart" icon="el-icon-edit">新增</el-button>
        </el-form-item>
        <el-form-item> 
            <el-button type="primary" @click="refreshMenu" icon="el-icon-refresh">重置</el-button>
        </el-form-item> 
    </el-row>
    </el-form>

    <!-- 表格 -->
    <el-table :data="partList" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="部件编码" prop="id">
        <template slot-scope="scope">
          <el-link type="primary" @click="detailInfo(scope)">{{scope.row.id}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="部件名称" prop="name">
      </el-table-column>
      <el-table-column label="版本号" prop="version">
      </el-table-column>
      <el-table-column label="迭代版本" prop="iteration">
      </el-table-column>
      <el-table-column label="装配模式" prop="partType.cnName">
      </el-table-column>
      <el-table-column label="分类编码" prop="clsAttrs.id">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button icon="el-icon-edit" circle @click="editPart(scope)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button icon="el-icon-delete" circle @click="deleteVisible(scope)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"
      :background="true" >
    </el-pagination>

    <!-- 新增/编辑/详情弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="handleClose">
    <!-- tab -->
    <el-tabs v-model="dialogTab">
      <el-tab-pane label="基本属性" name="basicInfo" :key="'basicInfo'">
      <el-form ref="collectionform" :rules="rules" :model="ruleForm" label-width="100px" label-position="left">
        <el-row type="flex">   
          <el-col :span="10">
            <el-form-item label="产品" >笔记本电脑
            </el-form-item>
          </el-col>
          <el-col :span="4"></el-col>
          <el-form-item label="部件名称" prop="name">
            <el-input placeholder="请输入" v-model="ruleForm.name" :readonly="dialogStatus=='detail'"></el-input>
          </el-form-item>
        </el-row>

        <el-row type="flex">   
          <el-col :span="10">
            <el-form-item label="默认单位" prop="master.measuringUnit">
              <el-select ref="selectUnit" v-model="ruleForm.master.measuringUnit.name" placeholder="请选择" @focus="getUnit" @change="selectUnit" :disabled="dialogStatus=='detail'">
                <el-option v-for="item in unitData" :key="item.id" :value="item.name" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4"></el-col>
          <el-form-item label="来源" prop="source">
            <el-select ref="selectSource" v-model="ruleForm.source.cnName" placeholder="请选择" @focus="getSource" @change="selectSource" :disabled="dialogStatus=='detail'">
              <el-option v-for="item in sourceData" :key="item.code" :value="item.enName" :label="item.cnName"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row type="flex">   
          <el-col :span="10">
            <el-form-item label="装配模式" prop="partType">
              <el-select ref="selectPartType" v-model="ruleForm.partType.cnName" placeholder="请选择" @focus="getPartType" @change="selectPartType" :disabled="dialogStatus=='detail'" >
                <el-option v-for="item in partTypeData" :key="item.code" :value="item.enName" :label="item.cnName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4"></el-col>  
          <el-form-item label="分类" prop="classification">
            <el-select ref="selectClassification" v-model="ruleForm.classification.name" placeholder="请选择" @focus="getClassification" @change="selectClassification" :disabled="dialogStatus=='detail'" >
              <el-option v-for="item in classificationData" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-divider content-position="left">扩展属性</el-divider>

         <!-- 根据选择项动态显示不定数量的文本框 -->
        <template v-for="item in dynamicEXA">
          <el-col :span="15">
          <el-form-item :label="item.source.name">
            <el-input v-model="formData[item.source.nameEn]" :readonly="dialogStatus=='detail'"></el-input>
          </el-form-item>
          </el-col>
        </template>
        </el-form>

      <el-col>
      <div class="dialog-footer" v-if="dialogStatus!='detail'">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus=='create'" @click="submitCollectionForm('collectionform')">提 交</el-button>
        <el-button type="warning" v-else @click="updateCollectionForm('collectionform')">修 改</el-button>
      </div>
      </el-col>
      </el-tab-pane>

      <!-- BOM清单tab -->
      <el-tab-pane label="BOM清单" name="BOMInfo" :key="'BOMInfo'" v-if="dialogStatus!='create'">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline" :rules="rules">
          <el-form-item> 
              <el-button @click="addChild">新增子项</el-button>
          </el-form-item>  
          <el-form-item>
              <el-button @click="checkBOM">查看BOM清单</el-button>
          </el-form-item>
          <el-form-item> 
              <el-button @click="checkParent">查看父项</el-button>
          </el-form-item> 
        </el-form>

        <el-table :data="BOMList" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column label="编码" prop="id">
            <template slot-scope="scope">
              <el-link type="primary" @click="detailInfo(scope)">{{scope.row.id}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name">
          </el-table-column>
          <el-table-column label="数量" prop="quentity">
          </el-table-column>
          <el-table-column label="位号" prop="referenceDesignator">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="danger" icon="el-icon-delete" circle @click="deleteVisible(scope)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 版本管理tab -->
      <el-tab-pane label="版本管理" name="versionManage" :key="'VersionManage'" v-if="dialogStatus!='create'">
        <el-table :data="partVersionList" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column label="部件编码" prop="id">
            <template slot-scope="scope">
              <el-link type="primary" @click="detailInfo(scope)">{{scope.row.id}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="部件名称" prop="name">
          </el-table-column>
          <el-table-column label="版本号" prop="version">
          </el-table-column>
          <el-table-column label="迭代版本" prop="iteration">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" v-if="dialogStatus=='update'">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button icon="el-icon-delete" circle @click="deleteVisible(scope)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
export default{
    data(){
        return{
          searchType: 'partId',
          searchPartId: '',
          searchPartName: '',
          allPartList: [],
          partList: [],
          partVersionList: [],
          BOMList: [],

          listQuery: {
            page: 1,
            limit: 10
          },
          total: 0,

          dialogFormVisible: false,
          dialogStatus: 'create',
          textMap: {
          update: '修改部分',
          create: '添加部分',
          detail: '部分详情',
          },

          dialogTab: "basicInfo",

          ruleForm:{
            id:'',
            name: '',
            master:{
              measuringUnit: ''
            },
            source:{
              cnName:'',
              enName:''
            },
            partType: {
              cnName:'',
              enName:''
            },
            classification:{
              name:'',
              id:''
            }
          },

          //规定输入框规则：必填
          rules: {
            name: [{
              required: true,
              message: '请输入中文名称',
              trigger: 'blur'
            }],
            'master.measuringUnit':[{
              required: true,
              message: '请选择单位',
              trigger: 'change'
            }],
            source:[{
              required: true,
              message: '请选择来源',
              trigger: 'change'
            }],
            partType:[{
              required: true,
              message: '请选择装配模式',
              trigger: 'change'
            }],
            classification:[{
              required: true,
              message: '请选择分类',
              trigger: 'change'
            }]
          },

          unitData: [],
          sourceData: [],
          partTypeData: [],
          classificationData: [],
          dynamicEXA: null,
          formData: {}, // 存储文本框内容的对象

          partMasterId:'' //记录当前处理的part的masterId

        }
    },
    created(){
        this.axiosdata()
    },
    methods:{
        //处理分页
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.axiosdata();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.axiosdata();
        },

        /* 获取part数据 */
        axiosdata(){
            this.$axios({
                method: 'post',
                url: 'part/getAllLatestPart',
            }).then((response) => {
                console.log(response)
                this.allPartList = response.data.data;
                this.partList = response.data.data.slice(
                    (this.listQuery.page - 1) * 10,
                    this.listQuery.page * 10 );
                this.total = response.data.data.length;
            })
        },

        /* 提交查询 */
        submitSearch(){
          if(this.searchPartId==''&&this.searchPartName=='') return this.$message.error('请输入查询字段');

          if(this.searchType=='partId'){
              this.$axios({
                  method: 'post',
                  url: '/part/findById/'+this.searchPartId
              }).then((response)=>{
                  console.log(response)
                  if (response.data.result == "SUCCESS"){
                      this.partList=response.data.data
                      this.total=1;
                      this.$message.success('查询部分成功');
                  } else this.$message.error('查询部分失败');
              })
          }else{
              this.$axios({
                  method: 'post',
                  url: '/part/findByName/'+this.searchPartName
              }).then((response)=>{
                  console.log(response)
                  if (response.data.result == "SUCCESS"){
                      this.partList=response.data.data
                      this.total=response.data.data.length;
                      this.$message.success('查询部分成功');
                  } else this.$message.error('查询部分失败');
              })
          }
        },

        /* 新增部分 */
        addNewPart(){          
            Object.assign(this.$data.ruleForm, this.$options.data().ruleForm);

            this.dialogStatus = "create"
            this.dialogFormVisible = true
        },

        /* 关闭弹窗时重置弹窗内容 */
        handleClose(){
           // 重置下拉框相关数据
            this.unitData = [];
            this.sourceData = [];
            this.partTypeData = [];
            this.classificationData = [];
            this.formData = {};
            this.dynamicEXA = null;
            this.$refs.collectionform.resetFields();
        },

        /* 重置菜单 */
        refreshMenu(){
            this.searchPartId= '';
            this.searchPartName= '';
            this.listQuery.page=1;
            this.axiosdata();
        },

        /* 编辑部分 */
        async editPart(scope){
          //获取行信息放置在编辑弹窗中
          this.ruleForm.name=scope.row.name||'';
          this.ruleForm.id=scope.row.id;

          if(scope.row.source!=null){
            this.ruleForm.source.cnName=scope.row.source.cnName;
            this.ruleForm.source.enName=scope.row.source.enName;
          }
          else{
            this.ruleForm.source.cnName='';
            this.ruleForm.source.enName='';
          }

          this.ruleForm.master.measuringUnit=scope.row.master.measuringUnit||'';

          if(scope.row.partType!=null){
            this.ruleForm.partType.cnName=scope.row.partType.cnName;
            this.ruleForm.partType.enName=scope.row.partType.enName;
          }
          else {
            this.ruleForm.partType.cnName='';
            this.ruleForm.partType.enName='';
          }

          const classificationAttr = scope.row.extAttrs.find(attr => attr.name === 'classification');
          if (classificationAttr){
            this.ruleForm.classification.name = classificationAttr.value?.name || ''; 
            this.ruleForm.classification.id = classificationAttr.value?.id || '';
          } 
          else{
            this.ruleForm.classification.name = ''; 
            this.ruleForm.classification.id = '';
          } 
          
          this.dynamicEXA=null;
          this.partMasterId='';
          //异步处理
          if (classificationAttr){
            await this.selectClassification(classificationAttr.value?.id);
            if(this.dynamicEXA!=null){
              if (scope.row.clsAttrs && scope.row.clsAttrs.length > 0) {
                this.formData = scope.row.clsAttrs[0].classification;
              } else this.formData = {};
            } 
          } 
          this.partMasterId=scope.row.master.id;   
          this.getPartVersion(this.partMasterId)
          //this.getBOMList()

          this.dialogStatus = "update";
          this.dialogFormVisible = true
        },

        /* 获取版本信息 */
        getPartVersion(partMasterId){
          this.$axios({
            method:'post', 
            url:'part/getAllVersions',
            data:{
              'masterId':partMasterId
            }
          }).then((response)=>{
            console.log(response)
            this.partVersionList=response.data.data;
          })
        },

        /* 获取BOM清单 */
        /*
        getBOMList(){
          let that=this;
          this.$axios({
            method:'post',
            url:'bomlink/queryRelatedObjects',
            data:{                 
              "role": "Source",
              "objectId": this.ruleForm.id
            }
          }).then((response)=>{
            console.log("找masterId")
            console.log(response)
            response.data.data.forEach((item)=>{
              that.$axios({
                method:'post',
                url:'part/getLatestVersion',
                data:{
                  "masterId":item.id,
                  "version":"A"
                }
              }).then((response)=>{
                console.log("找part最新版本")
                console.log(response)
                if(response.data.result=="SUCCESS"){
                  let name= response.data.data[0].name;
                  let id=response.data.data[0].id;
                  that.$axios({
                    method:'post',
                    url:'bomUsesOccurrence/findBySourceId/'+this.ruleForm.id,
                  }).then((response)=>{
                    console.log("找bomoccurrence")
                    console.log(response)
                    let quentity=response.data.data[0].bomlink.quentity;
                    let bomLinkId=response.data.data[0].bomLink.id;
                    let referenceDesignator=response.data.data.referenceDesignator;
                    that.BOMList.push({
                      "name":name,
                      "id":id,
                      "quentity":quentity,
                      "referenceDesignator":referenceDesignator,
                      "bomLinkId":bomLinkId
                    })
                  })
                }
              })
            })
          })
        },
        */

        /* 删除部分 */
        deleteVisible(scope){
          console.log(scope.row)
          this.$confirm('确定要删除【' + scope.row.name + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios({
              method: 'post',
              url: '/part/delete',
              data: {
                masterId: scope.row.master.id
              }
            }).then((response)=>{
               if (response.data.result == "SUCCESS") {
                this.axiosdata();
                this.$message.success('删除成功')
              } else {
                this.$message.error('删除失败');
              }
            })
          }).catch((error)=>{
            if(error !== 'cancel'){
              this.$message.error('操作失败');
            }
          });
        },

        /* 查看详情 */
        async detailInfo(scope){
          this.ruleForm.name=scope.row.name||'';

          if(scope.row.source!=null){
            this.ruleForm.source.cnName=scope.row.source.cnName;
            this.ruleForm.source.enName=scope.row.source.enName;
          }
          else{
            this.ruleForm.source.cnName='';
            this.ruleForm.source.enName='';
          }

          this.ruleForm.master.measuringUnit=scope.row.master.measuringUnit||'';

          if(scope.row.partType!=null){
            this.ruleForm.partType.cnName=scope.row.partType.cnName;
            this.ruleForm.partType.enName=scope.row.partType.enName;
          }
          else {
            this.ruleForm.partType.cnName='';
            this.ruleForm.partType.enName='';
          }

          const classificationAttr = scope.row.extAttrs.find(attr => attr.name === 'classification');
          if (classificationAttr){
            this.ruleForm.classification.name = classificationAttr.value?.name || ''; 
            this.ruleForm.classification.id = classificationAttr.value?.id || '';
          } 
          else{
            this.ruleForm.classification.name = ''; 
            this.ruleForm.classification.id = '';
          } 
          
          this.dynamicEXA=null;
          //异步处理
          if (classificationAttr){
            await this.selectClassification(classificationAttr.value?.id);
            if(this.dynamicEXA!=null){
              if (scope.row.clsAttrs && scope.row.clsAttrs.length > 0) {
                this.formData = scope.row.clsAttrs[0].classification;
              } else this.formData = {};
            } 
          }   
          this.partMasterId=scope.row.master.id;   
          this.getPartVersion(this.partMasterId) 

          this.dialogStatus = "detail";
          this.dialogFormVisible = true
        },


        /* 接收单位下拉框数据 */
        selectUnit(val){
          console.log(val)
          this.unitData.forEach((item)=>{
            if(item.name==val) this.ruleForm.master.measuringUnit=item;
          })
          console.log(this.ruleForm.master.measuringUnit)
        },

        /* 获取单位数据 */
        getUnit(){
          this.$axios({
            method:'post',
            url: 'measuringUnit/find'
          }).then((response)=>{
            this.unitData=response.data.data;
            console.log(this.unitData)
          })
        },

        /* 接收来源下拉框数据 */
        selectSource(val){
          this.ruleForm.source.enName=val;
        },

        /* 获取来源数据 */
        getSource(){
          this.$axios({
            method:'get',
            url: 'enum/query?enumType=PartSource'
          }).then((response)=>{
            this.sourceData=response.data;
            console.log(response)
          })
        },

        /* 接收装配模式下拉框数据 */
        selectPartType(val){
          this.ruleForm.partType.enName=val;
        },

        /* 获取装配模式数据 */
        getPartType(){
          this.$axios({
            method:'get',
            url: 'enum/query?enumType=AssemblyMode'
          }).then((response)=>{
            this.partTypeData=response.data;
            console.log(response)
          })
        },

        /* 接收分类下拉框数据 */
        selectClassification(val){
          this.classificationData.forEach((item)=>{
            if(item.id==val) {
              this.ruleForm.classification.id=item.id;
              this.ruleForm.classification.name=item.name;
            }
          })

          if(this.ruleForm.classification.id!=''){
            //获取分类的属性
            return new Promise((resolve,reject)=>{
              this.$axios({
                method: 'post',
                url: 'exaDefinitionLink/findById/'+val
              }).then((response)=>{
                this.dynamicEXA=[];
                this.dynamicEXA=response.data.data;
                resolve();
              }).catch((error)=>{
                reject(error);
              })
            })
          }else{
            this.dynamicEXA=[];
          }
          
        },

        /* 获取分类数据 */
        getClassification(){
          this.$axios({
            method:'post',
            url: 'classificationNode/find'
          }).then((response)=>{
            this.classificationData=response.data.data;
          })
        },

        /* 提交创建 */
        submitCollectionForm(formname){          
          this.$refs[formname].validate((valid) => {
            if (valid) {
              this.$axios({
                method: 'post',
                url: 'part/create',
                data: {
                  'name' : this.ruleForm.name,
                  'partType': this.ruleForm.partType.enName,
                  'source': this.ruleForm.source.enName,
                  'master':{
                    measuringUnit:{
                      'id':this.ruleForm.master.measuringUnit.id
                    }
                  },
                  'branch': {
                  },
                  'extAttrs': [
                    {
                      'name':"classification",
                      'value':this.ruleForm.classification.id 
                    },
                  ],
                  'clsAttrs':[
                    {
                      'classification': this.formData
                    }
                  ],  
                }
              }).then((response) => {
                if (response.data.result == "SUCCESS") {
                  this.axiosdata();
                  this.dialogFormVisible = false;
                  this.$message.success('添加部分成功');
                } else {
                  this.$message.error('添加部分失败');
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          }); 
       },

        /* 提交修改 */
        updateCollectionForm(formname){
          console.log(this.partMasterId)
          console.log(this.ruleForm.classification)
          console.log(this.ruleForm.partType)
          console.log(this.ruleForm.source)
          this.$refs[formname].validate((valid) => {
            if (valid) {
              this.$axios({
                method: 'post',
                url:'part/checkout',
                data:{
                  'masterId': this.partMasterId
                }
              }).then((response)=>{
                if(response.data.result=='SUCCESS'){
                  this.$axios({
                    method: 'post',
                    url: 'part/updateAndCheckin',
                    data: {
                      "masterId": this.partMasterId,
                      "data":{
                        'name' : this.ruleForm.name,
                        'partType': this.ruleForm.partType.enName,
                        'source': this.ruleForm.source.enName,
                        'master':{
                          measuringUnit:{
                            'id':this.ruleForm.master.measuringUnit.id
                          }
                        },
                        'branch': {
                        },
                        'extAttrs': [
                          {
                            'name':"classification",
                            'value':this.ruleForm.classification.id
                          },
                        ],
                        'clsAttrs':[
                          {
                            'classification': this.formData
                          }
                        ],  
                      }   
                    }
                  }).then((response) => {
                    console.log(response)
                    if (response.data.result == "SUCCESS") {
                      this.axiosdata();
                      this.dialogFormVisible = false;
                      this.$message.success('修改部分成功');
                    } else {
                      this.$message.error('修改部分失败');
                    }
                  })  
                } else {
                  this.$message.error('检出失败');
                  return false;
                }
              });
            }
          })            
        }
    }
}
</script>

<style>

</style>