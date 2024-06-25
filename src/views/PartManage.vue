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
            <el-button type="primary" @click="submitSearch" icon="el-icon-search" plain>查询</el-button>
        </el-form-item>  
        <el-form-item>
            <el-button type="success" @click="addNewPart" icon="el-icon-edit" plain>新增</el-button>
        </el-form-item>
        <el-form-item> 
            <el-button type="primary" @click="refreshMenu" icon="el-icon-refresh" plain>重置</el-button>
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
      <el-table-column label="分类名称" prop="extAttrs[0].value.name">
      </el-table-column>
      </el-table-column>
      <el-table-column label="状态" prop="workingState.cnName">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="检出" placement="top">
            <el-button type="success" icon="el-icon-upload2" circle @click="checkoutPart(scope)" plain></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="editPart(scope)" plain></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="检入" placement="top">
            <el-button type="warning" icon="el-icon-download" circle @click="checkinPart(scope)" plain></el-button>
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
          <el-form-item label="来源" prop="source.cnName">
            <el-select ref="selectSource" v-model="ruleForm.source.cnName" placeholder="请选择" @focus="getSource" @change="selectSource" :disabled="dialogStatus=='detail'">
              <el-option v-for="item in sourceData" :key="item.code" :value="item.enName" :label="item.cnName"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row type="flex">   
          <el-col :span="10">
            <el-form-item label="装配模式" prop="partType.cnName">
              <el-select ref="selectPartType" v-model="ruleForm.partType.cnName" placeholder="请选择" @focus="getPartType" @change="selectPartType" :disabled="dialogStatus=='detail'" >
                <el-option v-for="item in partTypeData" :key="item.code" :value="item.enName" :label="item.cnName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4"></el-col>  
          <el-form-item label="分类" prop="classification.name">
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
              <el-button @click="addChild" :disabled="dialogStatus=='detail'">新增子项</el-button>
          </el-form-item>  
          <el-form-item>
              <el-button @click="checkBOM">查看BOM清单</el-button>
          </el-form-item>
          <el-form-item> 
              <el-button @click="toggleParentTable">查看父项</el-button>
          </el-form-item> 
        </el-form>

        <el-table :data="BOMList" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column label="编码" prop="id" width="180">
          </el-table-column>
          <el-table-column label="名称" prop="name">
          </el-table-column>
          <el-table-column label="数量" prop="quantity" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.editingQuantity">
                <el-input v-model="scope.row.quantity" @blur="finishEdit(scope.row, 'quantity')" />
              </div>
              <div v-else>
                {{ scope.row.quantity }}
                <el-button class="no-border" icon="el-icon-edit" size="mini" @click="editField(scope.row, 'quantity')" :disabled="dialogStatus=='detail'"></el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="位号" prop="referenceDesignator">
            <template slot-scope="scope">
              <div v-if="scope.row.editingReferenceDesignator">
                <el-input v-model="scope.row.referenceDesignator" @blur="finishEdit(scope.row, 'referenceDesignator')" />
              </div>
              <div v-else>
                {{ scope.row.referenceDesignator }}
                <el-button class="no-border" icon="el-icon-edit" size="mini" @click="editField(scope.row, 'referenceDesignator')" :disabled="dialogStatus=='detail'"></el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button icon="el-icon-delete" circle @click="deleteBOM(scope)" :disabled="dialogStatus=='detail'"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

      <el-divider content-position="left"></el-divider>

      <!-- 父项表格 -->
      <el-table v-show="showParentTable" :data="parentBOMList" border fit highlight-current-row>
        <el-table-column label="部件编码" prop="id">
        </el-table-column>
        <el-table-column label="部件名称" prop="name">
        </el-table-column>
        <el-table-column label="版本号" prop="version">
        </el-table-column>
        <el-table-column label="迭代版本" prop="iteration">
        </el-table-column>
      </el-table>

      <!-- 树形下拉 -->
      <el-tree
        v-if="showTree"
        :show-checkbox="false"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        lazy
        :load="loadNode"
        @node-click="handleNodeClick">
      </el-tree>

      </el-tab-pane>

      <!-- 版本管理tab -->
      <el-tab-pane label="版本管理" name="versionManage" :key="'VersionManage'" v-if="dialogStatus!='create'">
        <el-table :data="partVersionList" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column label="部件编码" prop="id">
          </el-table-column>
          <el-table-column label="部件名称" prop="name">
          </el-table-column>
          <el-table-column label="版本号" prop="version">
          </el-table-column>
          <el-table-column label="迭代版本" prop="iteration">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" v-if="dialogStatus=='detail'">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button icon="el-icon-delete" circle @click="deleteVersion(scope)"></el-button>
              </el-tooltip>
            </template> 
          </el-table-column>
        </el-table>
      </el-tab-pane>

      </el-tabs>
    </el-dialog>

    <!-- 添加子项弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="bomDialogFormVisible" @close="handleChildClose">
      <el-form ref="collectionbomform" :model="ruleForm" label-width="100px" label-position="left">
        <el-row type="flex">
          <el-form-item>
              <el-radio-group v-model="searchType1">
                <el-row type="flex">
                  <el-col :span="8">
                  <el-radio label="partId">按编码查询
                      <el-input v-model="searchChildPartId" :readonly="searchType1=='partName'"></el-input>
                  </el-radio>
                  </el-col>
                  <el-col :span="5"></el-col>
                  <el-col :span="8">
                  <el-radio label="partName">按部件名称
                      <el-input v-model="searchChildPartName" :readonly="searchType1=='partId'"></el-input>
                  </el-radio>
                  </el-col>
                </el-row>
              </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item> 
              <el-button type="primary" @click="submitChildSearch" icon="el-icon-search" plain>查询</el-button>
              <el-button type="primary" @click="refreshChildMenu" icon="el-icon-refresh" plain>重置</el-button>
          </el-form-item> 
        </el-row>

        <!-- 查询部件表格 -->
        <el-table :data="addChildPartList" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="部件编码" prop="id">
        </el-table-column>
        <el-table-column label="部件名称" prop="name">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top">
              <el-button type="primary" :class="{ active: isActive }" @click="addChildPart(scope)" plain>
                {{isActive ? '已添加': '添加选定项'}}
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-divider content-position="left">BOM信息</el-divider>

      <el-form :inline="true" :rules="rules" :model="childFormData">
        <el-row type="flex">
        <el-col :span="8">
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="childFormData.childQuantity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3"></el-col>
        <el-col :span="8">
          <el-form-item label="位号" prop="referenceDesignator">
            <el-input v-model="childFormData.childReferenceDesignator"></el-input>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>

      <div class="dialog-footer">
        <el-button @click="bomDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddChildForm()">提 交</el-button>
      </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ElTable, ElTableColumn } from 'element-ui';

export default{
    data(){
        return{
          //查询模式
          searchType: 'partId',
          searchType1: 'partId',
          //查询部分
          searchPartId: '',
          searchPartName: '',
          //查询子项
          searchChildPartId: '',
          searchChildPartName: '',
          //子项数量和区位
          childFormData:{
            childQuantity:'',
            childReferenceDesignator:'',
          },

          allPartList: [],
          partList: [],
          partVersionList: [],
          addChildPartList:[],
          BOMList: [],
          parentBOMList:[],
          ChildPartData:[],

          listQuery: {
            page: 1,
            limit: 10
          },
          total: 0,

          dialogFormVisible: false,
          bomDialogFormVisible: false,
          dialogStatus: 'create',
          isActive:false,  //选中子项
          showParentTable:false,

          textMap: {
          update: '修改部分',
          create: '添加部分',
          detail: '部分详情',
          addChild: '添加子项'
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
            'source.cnName':[{
              required: true,
              message: '请选择来源',
              trigger: 'change'
            }],
            'partType.cnName':[{
              required: true,
              message: '请选择装配模式',
              trigger: 'change'
            }],
            'classification.name':[{
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

          partMasterId:'', //记录当前处理的part的masterId
          currentPartId:'',

          treeData: [],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          showTree: false,

        }
    },
    created(){
        this.axiosdata()
    },
    methods:{
        /* 处理分页 */
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
            this.unitData = [];
            this.sourceData = [];
            this.partTypeData = [];
            this.classificationData = [];
            this.formData = {};
            this.dynamicEXA = null;
            this.ruleForm={
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
            };
            this.$refs.collectionform.resetFields();
            this.BOMList=[];
            this.showParentTable=false;
            this.parentBOMList=[];
            this.treeData=[];
            this.showTree=false;
            this.axiosdata()
        },

        /* 重置菜单 */
        refreshMenu(){
            this.searchPartId= '';
            this.searchPartName= '';
            this.listQuery.page=1;
            this.allPartList=[];
            this.partList=[];
            this.axiosdata();
        },

        /* 检出部分 */
        checkoutPart(scope){
          console.log("检出：",scope.row);
          if(scope.row.workingState.cnName=="工作中") this.$message.error("不可重复检出")
          else{
            this.$axios({
              method:'post',
              url:'part/checkout',
              data:{
                "masterId":scope.row.master.id
              }
            }).then((response)=>{
              if(response.data.result=="SUCCESS"){
                this.$message.success("检出成功");
                this.allPartList=[];
                this.axiosdata();
              } else{
                this.$message.error("检出失败")
              }
            })
          }
        },

        /* 编辑部分 */
        async editPart(scope){
          if(scope.row.workingState.cnName!="工作中")this.$message.error("请先检出")
          else{
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
            console.log("masterId:",this.partMasterId)
            this.currentPartId=scope.row.id;   
            this.getPartVersion(this.partMasterId)
            this.BOMList=[]
            this.getBOMList()

            this.dialogStatus = "update";
            this.dialogFormVisible = true
          }
        },

        /* 检入部分 */
        checkinPart(scope){
          if(scope.row.workingState.cnName!="工作中") this.$error.message("请先检出")
          else{
            this.$axios({
              method:'post',
              url:'part/checkin',
              data:{
                "masterId":scope.row.master.id
              }
            }).then((response)=>{
              if(response.data.result=="SUCCESS"){
                this.$message.success("检入成功");
                this.allPartList=[];
                this.axiosdata();
              } else{
                this.$message.error("检入失败")
              }
            })
          }
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
        async getBOMList() {
          let that = this;
          try {
            const response = await this.$axios({
              method: 'post',
              url: 'bomlink/queryRelatedObjects',
              data: {
                "role": "Source",
                "objectId": this.ruleForm.id
              }
            });
            console.log("找masterId");
            console.log(response);
            for (const item of response.data.data) {
              try {
                const partResponse = await this.$axios({
                  method: 'post',
                  url: 'part/getLatestVersion',
                  data: {
                    "masterId": item.id,
                    "version": "A"
                  }
                });

                console.log("找part最新版本");
                console.log(partResponse);

                if (partResponse.data.result == "SUCCESS") {
                  const BOMname = partResponse.data.data[0].name;
                  const BOMid = partResponse.data.data[0].id;

                  try {
                    const bomResponse = await this.$axios({
                      method: 'post',
                      url: 'bomUsesOccurrence/findBySourceId/' + that.ruleForm.id,
                    });
                    console.log("找bomoccurrence");
                    console.log(bomResponse);
                    console.log(bomResponse.data.data.length);
                    if(bomResponse.data.data.length>0){
                      //遍历master对应的每个bomoccurrence，找到这一行对应的那个
                      bomResponse.data.data.forEach((item1)=>{
                        if(item1.bomLink.target.id==item.id){
                          const bomLinkId = item1.bomLink.id;
                          var BOMquantity='';
                          this.$axios({
                            method:'post',
                            url:'bomlink/get',
                            data:{
                              "id": item1.bomLink.id
                            }
                          }).then((bomLinkResponse)=>{
                            console.log('bomlink',bomLinkResponse)
                            if(bomLinkResponse.data.result=="SUCCESS"){
                              BOMquantity=bomLinkResponse.data.data[0].quantity; 
                              const bomOccurrenceId= item1.id;
                              const BOMreferenceDesignator = item1.referenceDesignator;
                              that.BOMList.push({
                                "name": BOMname,
                                "id": BOMid,
                                "quantity": BOMquantity,
                                "referenceDesignator": BOMreferenceDesignator,
                                "bomLinkId": bomLinkId,
                                "bomOccurrenceId":bomOccurrenceId,
                                "editingQuantity": false, 
                                "editingReferenceDesignator": false
                              });
                            }                    
                          })                         
                        }
                      })                      
                    }                   
                  } catch (bomError) {
                    console.error("Error fetching BOM occurrence data:", bomError);
                  }
                }
              } catch (partError) {
                console.error("Error fetching latest part version:", partError);
              }
            }
          } catch (error) {
            console.error("Error fetching related objects:", error);
          }
        },

        /* 删除部分 */
        deleteVisible(scope){
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
          this.ruleForm.id=scope.row.id;

          if(scope.row.source!=null){
            this.ruleForm.source.cnName=scope.row.source.cnName;
            this.ruleForm.source.enName=scope.row.source.enName;
          }else{
            this.ruleForm.source.cnName='';
            this.ruleForm.source.enName='';
          }

          this.ruleForm.master.measuringUnit=scope.row.master.measuringUnit||'';

          if(scope.row.partType!=null){
            this.ruleForm.partType.cnName=scope.row.partType.cnName;
            this.ruleForm.partType.enName=scope.row.partType.enName;
          }else {
            this.ruleForm.partType.cnName='';
            this.ruleForm.partType.enName='';
          }

          const classificationAttr = scope.row.extAttrs.find(attr => attr.name === 'classification');
          if (classificationAttr){
            this.ruleForm.classification.name = classificationAttr.value?.name || ''; 
            this.ruleForm.classification.id = classificationAttr.value?.id || '';
          } else{
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
          this.currentPartId=scope.row.id; 
          this.BOMList=[]
          this.getBOMList()

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
              this.$axios({
                method: 'post',
                url: 'part/update',
                data: {
                  "id": this.currentPartId,
                  'name' : this.ruleForm.name,
                  'partType': this.ruleForm.partType.enName,
                  'source': this.ruleForm.source.enName,
                  'master':{
                    measuringUnit:{
                      'id':this.ruleForm.master.measuringUnit.id
                    }
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
                  "modifier": "xulinxia fceced4b9dbf41f2af68a3ebda28a20f" 
                }
              }).then((response) => {
                console.log("update:",response)
                if (response.data.result == "SUCCESS") {
                  this.axiosdata();
                  this.dialogFormVisible = false;
                  this.$message.success('修改部分成功');
                } else {
                  this.$message.error(response.data.errors[0].message);
                }
              })  
          });          
        },



        /* 添加子项 */
        addChild(){
          this.bomDialogFormVisible=true;
          this.dialogStatus='addChild';
        },
       
        /* 重置子项查询 */
        refreshChildMenu(){
          this.searchChildPartId= '';
          this.searchChildPartName= '';
          this.addChildPartList=[];
        },

        /* 添加子项查询 */
        submitChildSearch(){
          if(this.searchChildPartId==''&&this.searchChildPartName=='') return this.$message.error('请输入查询字段');

          if(this.searchType1=='partId'){
              this.$axios({
                  method: 'post',
                  url: '/part/findById/'+this.searchChildPartId
              }).then((response)=>{
                  console.log(response)
                  if (response.data.result == "SUCCESS"){
                      this.addChildPartList=response.data.data
                      this.total=1;
                      this.$message.success('查询成功');
                  } else this.$message.error('查询失败');
              })
          }else{
              this.$axios({
                  method: 'post',
                  url: '/part/findByName/'+this.searchChildPartName
              }).then((response)=>{
                  console.log(response)
                  if (response.data.result == "SUCCESS"){
                      this.addChildPartList=response.data.data
                      this.total=response.data.data.length;
                      this.$message.success('查询成功');
                  } else this.$message.error('查询失败');
              })
          }
        },

        /* 添加选定项 */
        addChildPart(scope){
          if(!this.isActive){
            this.isActive=!this.isActive
            this.ChildPartData=scope.row;
          } else{
            this.isActive=!this.isActive
            this.ChildPartData=null;
          }
          console.log(this.ChildPartData);
        },

        /* 提交添加子项 */
        submitAddChildForm(){
          let that=this
          if(this.ChildPartData==null) this.$message.error("请选中子项")
          else{
            this.$axios({
              method:'post',
              url:'bomlink/create',
              data:{                  
                "source":{
                    "id":that.currentPartId
                },
                "target":{
                    "id":that.ChildPartData.master.id
                },
                "quantity": that.childFormData.childQuantity
              }
            }).then((response)=>{
              console.log(response)
              if(response.data.msg!="成功") this.$message.error(response.data.msg)
              else{
                if(response.data.msg=="成功"){
                  const bomLinkId=response.data.data.id
                  console.log(bomLinkId)
                  this.$axios({
                    method:'post',
                    url:'bomUsesOccurrence/create',
                    data:{
                      "referenceDesignator":that.childFormData.childReferenceDesignator,
                      "bomLink":{
                        "id": bomLinkId
                      }
                    }
                  }).then((response1)=>{
                    console.log(response1)
                    if(response1.data.result=="SUCCESS"){
                      this.$message.success("创建成功")
                      this.bomDialogFormVisible=false
                      this.BOMList=[];
                      this.getBOMList()
                    }else this.$message.error("创建失败")
                  })
                }
              }
              
            })
          }
        },

        /* 删除bom */
        deleteBOM(scope){
          console.log(scope)
          this.$confirm('确定要删除【' + scope.row.name + '】吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios({
              method:'post',
              url:'bomUsesOccurrence/delete',
              data:{
                "id":scope.row.bomOccurrenceId
              }
            }).then((response)=>{
              console.log(response)
              if(response.data.result=="SUCCESS"){
                this.$axios({
                  method:'post',
                  url:'bomlink/delete',
                  data:{
                    "id":scope.row.bomLinkId
                  }
                }).then((response)=>{
                  console.log(response)
                  if(response.data.result=="SUCCESS"){
                    this.$message.success("删除成功")
                    this.BOMList=[];
                    this.getBOMList()
                  }else{
                    this.$message.error("删除失败")
                  }
                })
              }else{
                this.$message.error("删除失败")
              }
            })
          }).catch((error)=>{
            if(error !== 'cancel'){
              this.$message.error('操作失败');
            }
          });
        },

        /* 关闭添加子项弹窗时重置弹窗内容 */
        handleChildClose(){
          this.searchChildPartId= '';
          this.searchChildPartName= '';
          this.addChildPartList=[];
          this.isActive=false;
          this.childFormData.childQuantity='';
          this.childFormData.childReferenceDesignator='';
        },

        /* bom表内编辑 */
        editField(row, field) {
          if (field === 'quantity') {
            row.editingQuantity = true;
          } else if (field === 'referenceDesignator') {
            row.editingReferenceDesignator = true;
          }
        },
        finishEdit(row, field) {
          if (field === 'quantity') {
            row.editingQuantity = false;
            this.updateQuantity(row)
          } else if (field === 'referenceDesignator') {
            row.editingReferenceDesignator = false;
            this.updateReferenceDesignator(row)
          }
        },

        /* 修改bom数量 */
        updateQuantity(row) {
          console.log(row);
          this.$axios({
            method:'post',
            url:'bomlink/update',
            data:{
              "id": row.bomLinkId,
              "quantity":row.quantity
            }
          }).then((response)=>{
            console.log(response)
            if(response.data.result=="SUCCESS"){
              this.$message.success("修改成功")
              this.BOMList=[]
              this.getBOMList()
            } 
            else {
              this.$message.error("修改失败")
              this.BOMList=[]
              this.getBOMList()
            }
          })
        },

        /* 修改bom位号 */
        updateReferenceDesignator(row) {
          console.log(row);
          this.$axios({
            method:'post',
            url:'bomUsesOccurrence/update',
            data:{
              "id": row.bomOccurrenceId,
              "referenceDesignator":row.referenceDesignator,
              "bomLink":{
                "id":row.bomLinkId
              }
            }
          }).then((response)=>{
            console.log(response)
            if(response.data.result=="SUCCESS"){
              this.$message.success("修改成功")
              this.BOMList=[]
              this.getBOMList()
            } 
            else {
              this.$message.error("修改失败")
              this.BOMList=[]
              this.getBOMList()
            }
          })
        },

        /* 删除版本 */
        deleteVersion(scope){
           this.$confirm('确定要删除【' + scope.row.name + '】吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios({
              method:'post',
              url:'part/deleteLatestVersion',
              data:{
                "masterId": scope.row.master.id
              }
            }).then((response)=>{
              console.log(response)
              if(response.data.result=="SUCCESS"){
                this.$message.success("删除成功")
                this.partVersionList=[]
                this.getPartVersion(this.partMasterId)
              }else{
                this.$message.success("删除成功")
              }
            })
          }).catch((error)=>{
            if(error !== 'cancel'){
              this.$message.error('操作失败');
            }
          });
        },

        /* 点击查看父项 */
        toggleParentTable(){
          if(!this.showParentTable){
            this.$axios({
              method:'post',
              url:'bomlink/queryRelatedObjects',
              data:{
                "role":"Target",
                "objectId":this.partMasterId
              }
            }).then((response)=>{
              console.log(response);
              if(response.data.result=="SUCCESS"){
                this.parentBOMList=response.data.data;
                this.$message.success("查询成功")
              }else{
                this.$message.error("查询失败")
              }
            })
          }
          this.showParentTable=!this.showParentTable;
        },

        /* 查看bom清单 */
        checkBOM(){
         this.showTree = !this.showTree;
          if (!this.showTree && this.treeData.length === 0) {
            this.loadNode({ level: 0 }, data => {
              this.treeData = data;
            });
          }else this.treeData=[];
        },

        /* 展开子项 */
        loadNode(node, resolve) {
          if (node.level === 0) {
            this.$axios.post('bomlink/findAllSourcePart')
              .then(response => {
                console.log("findAllSourcePart:",response)
                const data = response.data.data.map(item => ({
                  id: item.id,
                  label: item.name,
                  leaf: false // assuming first level nodes have children
                }));
                resolve(data);
              });
          } else {
            // Child nodes
            this.$axios.post('bomlink/queryRelatedObjects', {
              role: 'Source',
              objectId: node.data.id
            }).then(response1 => {
              if(response1.data.data!=null){
                console.log("queryRelatedObjects:",response1)
                //返回masterId，找最新版本
                let promises = response1.data.data.map(item => {
                  return this.$axios({
                    method: 'post',
                    url: 'part/getLatestVersion',
                    data: {
                      "masterId": item.id,
                      "version": "A"
                    }
                  }).then(response2 => {
                    return response2.data.data.map(part => ({
                      id: part.id,
                      label: part.name,
                      leaf: true // assuming child nodes are leaves
                    }));
                  });
                });

                Promise.all(promises).then(results => {
                  let data = [];
                  results.forEach(result => {
                    data = data.concat(result);
                  });
                  resolve(data);
                });
              } else {
                resolve([]);
              }
            });
          };
        },
        handleNodeClick(data, node, component) {
          console.log(data);
        }
    }
}
</script>

<style>
  .no-border {
    border: none !important;
    box-shadow: none !important;
  }
  .el-button {
    margin-left: 10px;
  }
</style>