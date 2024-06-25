<template>   
  <div style="padding: 5px 20px;">
    <br>
    <!-- 属性查询表单 -->       
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">           
      <el-form-item label="属性信息查询">              
        <el-input v-model="queryForm.name" placeholder="请输入属性中文"></el-input>             
      </el-form-item>
           
      <el-form-item>               
        <el-button type="primary" @click="hanldeSearch(1)" icon="el-icon-search" plain>查询</el-button>             
      </el-form-item>

      <el-form-item>               
        <el-button type="success" @click="addAttr" icon="el-icon-edit" plain>新增</el-button>             
      </el-form-item>

      <el-form-item>               
        <el-button type="primary" @click="resetSearch" icon="el-icon-refresh" plain>重置</el-button>             
      </el-form-item>           
         
    </el-form>
       
    <!-- 属性列表 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="中文名称"></el-table-column>    
      <el-table-column prop="nameEn" label="英文名称"></el-table-column>      
      <el-table-column
        prop="description"
        label="属性中文描述"></el-table-column>     
      <el-table-column
        prop="descriptionEn"
        label="属性英文描述"></el-table-column>
      <el-table-column prop="type" label="数据类型"></el-table-column>    
       
      <el-table-column prop="category" label="查看属性所在分类" align="center" >      
        <template slot-scope="scope">  
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="handleCheck(scope.row)"
            plain></el-button>          
        </template>    
      </el-table-column>
           
      <el-table-column label="操作" align="center" width="200">              
        <template slot-scope="scope">                  
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleEdit(scope.row)"
            plain></el-button>
                   
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.row)"
            plain></el-button>     
        </template>  
      </el-table-column>      
    </el-table>
       
    <!-- 分页 -->       
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="queryForm.page"
      :page-sizes="[10]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryForm.total"
      :background="true">        
    </el-pagination>

       
    <!-- 属性查看 -->       
    <el-dialog :title="dialogTitle" width="800px" :visible.sync="attrCheckShow">           
      <!-- 表格 -->           
      <el-table :data="attrTableData" border style="width: 100%">               
        <el-table-column
          align="center"
          label="分类码"
          width="200"
          prop="businessCode">                 
        </el-table-column>               
        <el-table-column label="属性中文名称" prop="description">                 
        </el-table-column>               
        <el-table-column label="属性英文名称" prop="descriptionEn">                 
        </el-table-column>               
        <el-table-column label="分类中文名称" prop="name">                  
          <template slot-scope="scope">
             <el-link type="primary">{{ scope.row.name }}</el-link>                     
          </template>                
        </el-table-column>              
        <el-table-column label="分类英文名称" prop="nameEn"> </el-table-column>             
      </el-table>
           
      <el-pagination
        @current-change="handleAttrTableDataParams"
        :current-page="attrTableDataParams.page"
        :page-sizes="[10]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="attrTableDataParams.total"
        :background="true">             
      </el-pagination>        
    </el-dialog>
       
    <!-- 属性编辑弹窗 -->      
    <el-dialog :title="dialogTitle" width="800px" :visible.sync="dialogVisible">           
      <el-form
        :model="attributeForm"
        :inline="true"
        :rules="rules"
        label-position="right"
        label-width="120px"
        ref="attributeForm">               
        <el-form-item label="中文名称" prop="name">                   
          <el-input
            style="width: 250px"
            v-model="attributeForm.name"></el-input>                 
        </el-form-item>               
        <el-form-item label="英文名称" prop="nameEn">                   
          <el-input
            style="width: 250px"
            v-model="attributeForm.nameEn"></el-input>                 
        </el-form-item>               
        <el-form-item label="属性中文描述" prop="description">                  
          <el-input
            type="textarea"
            style="width: 250px"
            v-model="attributeForm.description"></el-input>                 
        </el-form-item>
               
        <el-form-item label="属性英文描述" prop="descriptionEn">                   
          <el-input
            type="textarea"
            style="width: 250px"
            v-model="attributeForm.descriptionEn"></el-input>                 
        </el-form-item>               
        <el-form-item label="数据类型" prop="type">                   
          <el-select
            v-model="attributeForm.type"
            :disabled="!isAdd"
            style="width: 250px">                      
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">                         
            </el-option>                     
          </el-select>                
        </el-form-item>
               
        <el-form-item label="属性状态" prop="disableFlag">                  
          <el-select v-model="attributeForm.disableFlag" style="width: 250px">
                        <el-option label="有效" :value="false"> </el-option>    
                    <el-option label="失效" :value="true"> </el-option>                    
          </el-select>                
        </el-form-item>
               
        <el-form-item label="属性类型" prop="attributeType">                  
          <el-input
            :disabled="true"
            style="width: 250px"
            v-model="attributeForm.attributeType"></el-input>                  
          <!-- <el-select
            v-model="attributeForm.attributeType"
            :disabled="!isAdd"
            style="width: 250px">
            <el-option
              v-for="item in attributeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->                
        </el-form-item>            
      </el-form>
           
      <span slot="footer" class="dialog-footer">
         <el-button @click="dialogVisible = false">取消</el-button>      
         <el-button type="primary" @click="handleSubmit">确定</el-button>      
      </span>         
    </el-dialog>     
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        name: "",
        id: "", // 第几页
        page: 1, // 总页数

        total: 0,
      },
      tableDatalist: [],
      tableData: [], // 属性列表
      dialogTitle: "",
      dialogVisible: false,
      attrCheckShow: false,
      attrTableDatalist: [],
      attrTableData: [],
      checkId: "",
      attrTableDataParams: {
        // 第几页
        page: 1, // 总页数
        total: 0,
      },
      isAdd: true,
      attributeForm: {
        id: "",
        name: "",
        nameEn: "",
        description: "",
        descriptionEn: "",
        type: "",
        disableFlag: false,
        attributeType: "拓展属性",
      },
      rules: {
        name: [
          { required: true, message: "请输入属性中文名称", trigger: "blur" },
        ],
        nameEn: [
          { required: true, message: "请输入属性英文名称", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入属性英文名称", trigger: "blur" },
        ],
        descriptionEn: [
          { required: true, message: "请输入属性英文名称", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请输入属性英文名称", trigger: "blur" },
        ],
      },
      typeOptions: [
        { label: "字符型", value: "STRING" },
        { label: "整数型", value: "INTEGER" },
        { label: "实数型", value: "DECIMAL" },
      ],
      attributeTypeOptions: [],
    };
  },
  created() {
    this.hanldeSearch();
  },
  methods: {
    // 查询表格
    hanldeSearch(num) {
      if (num) {
        this.queryForm.page = 1;
      } // 名字为空
      if (this.queryForm.name === "") {
        // 调查询接口
        this.$axios({
          method: "post",
          url: '/exaDefinition/find',
        }).then((res) => {
          this.tableDatalist = res.data.data;
          this.queryForm.total = res.data.data.length;
          this.tableData = res.data.data.slice(
            (this.queryForm.page - 1) * 10,
            this.queryForm.page * 10
          );
        });
      } else {
        // 调查询接口
        this.$axios({
          method: "post",
          url: '/exaDefinition/findByName?name=' + encodeURIComponent(this.queryForm.name), // data: { //   name: this.queryForm.name, // },
        }).then((res) => {
          this.tableDatalist = res.data.data;
          this.queryForm.total = res.data.data.length;
          this.tableData = res.data.data.slice(
            (this.queryForm.page - 1) * 10,
            this.queryForm.page * 10
          );
        });
      }
    }, //处理分页

    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.hanldeTableData();
    }, // 处理表格数据
    hanldeTableData() {
      this.tableData = this.tableDatalist.slice(
        (this.queryForm.page - 1) * 10,
        this.queryForm.page * 10
      );
    },

    resetSearch() {
      this.queryForm = {
        name: "",
        id: "", // 第几页
        page: 1, // 总页数

        total: 0,
      };
      this.hanldeSearch();
    },

    handleCheck(row) {
      this.attrCheckShow = true;
      this.checkId = row.id;
      this.$axios({
        method: "post",
        url: '/exaDefinition/nodeRefered/10/${this.attrTableDataParams.page}?id=${this.checkId}',
      }).then((res) => {
        this.attrTableData = res.data.data;
        this.attrTableDataParams.total = res.data.pageInfo.totalRows;
      });
    },
    handleAttrTableDataParams(val) {
      this.attrTableDataParams.page = val;
      this.$axios({
        method: "post",
        url: '/exaDefinition/nodeRefered/10/${this.attrTableDataParams.page}?id=${this.checkId}',
      }).then((res) => {
        this.attrTableData = res.data.data;
        this.attrTableDataParams.total = res.data.pageInfo.totalRows;
      });
    }, // 处理表格数据
    hanldeAttrTableData() {
      this.attrTableData = this.attrTableDatalist.slice(
        (this.attrTableDataParams.page - 1) * 10,
        this.attrTableDataParams.page * 10
      );
    },

    addAttr() {
      // 新增属性的逻辑
      this.dialogTitle = "新增属性";
      this.dialogVisible = true;
      this.isAdd = true;
      this.resetForm();
    },

    handleEdit(row) {
      // 显示编辑弹窗，并填充当前行的数据
      this.dialogTitle = "编辑属性";
      this.dialogVisible = true;
      this.isAdd = false;
      Object.assign(this.attributeForm, row);
    },
    handleDelete(row) {
      console.log(row, "row");
      this.$confirm("确认是否需要删除属性?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调删除接口
          this.$axios({
            method: "post",
            url: "/exaDefinition/delete",
            data: {
              // 参数自己调
              id: row.id,
            },
          }).then((res) => {
            if (res.data.result == "SUCCESS") {
              // 重新查询列表
              this.resetSearch();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {});
    },

    handleSubmit() {
      // 提交编辑/新增表单
      this.$refs.attributeForm.validate((valid) => {
        if (valid) {
          // 新增
          if (this.attributeForm.id === "") {
            let obj = JSON.parse(JSON.stringify(this.attributeForm));
            delete obj.id; // 调新增接口
            this.$axios({
              method: "post",
              url: "/exaDefinition/create",
              data: {
                // 参数自己调
                ...obj,
              },
            }).then((res) => {
              console.log(res, "res");
              if (res.data.result == "SUCCESS") {
                // 重新查询列表
                this.resetSearch(1);
                this.$message({
                  type: "success",
                  message: "新增属性成功!",
                });
                this.dialogVisible = false;
              }
            });
          } else {
            let obj = JSON.parse(JSON.stringify(this.attributeForm));

            let submitObj = {
              name: obj.name,
              nameEn: obj.nameEn,
              description: obj.description,
              descriptionEn: obj.descriptionEn,
              type: obj.type,
              disableFlag: obj.disableFlag,
              attributeType: obj.attributeType,
              id: obj.id,
              constraint: obj.constraint,
            }; // 编辑 // 调编辑接口
            this.$axios({
              method: "post",
              url: "/exaDefinition/update",
              data: {
                // 参数自己调
                ...submitObj,
              },
            }).then((res) => {
              console.log(res, "res");
              if (res.data.result == "SUCCESS") {
                // 重新查询列表
                this.resetSearch(1);
                this.$message({
                  type: "success",
                  message: "编辑属性成功!",
                });
                this.dialogVisible = false;
              }
            });
          }
          console.log("yes submit!!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$nextTick(() => {
        // 重置表单
        this.$refs.attributeForm.resetFields();
      });
    },
  },
};
</script>