<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入渠道名称"/>
      <el-select v-permission="['POST /admin/order/selectuser']" v-model="listQuery.userid" style="width: 200px" class="filter-item" placeholder="请选择业务员">
        <el-option v-for="item in userLists" :key="item.id" :label="item.username" :value="item.id"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <!-- <el-table-column align="center" label="渠道ID" prop="id" sortable/> -->

      <el-table-column align="center" label="渠道编号" prop="NO"/>
      <el-table-column align="center" label="渠道名称" prop="name"/>
      <el-table-column align="center" label="业务员名称" prop="username"/>
      <el-table-column align="center" label="收货人姓名" prop="receiver_name"/>
      <el-table-column align="center" label="收货人电话" prop="receiver_mobile"/>
      <el-table-column align="center" label="地址" prop="receiver_address"/>

      <el-table-column align="center" label="操作" width="400" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" style="width:72px !important" @click="handlePrice(scope.row)">价格维护</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="业务员名称" prop="name">
          <el-select v-permission="['POST /admin/order/selectuser']" v-model.trim="dataForm.token" class="filter-item" placeholder="请选择业务员">
            <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称" prop="name">
          <el-input v-model.trim="dataForm.name"/>
        </el-form-item>
        <el-form-item label="渠道编号" prop="NO">
          <el-input v-model.trim="dataForm.NO"/>
        </el-form-item>
        <el-form-item label="收货人姓名" prop="receiver_name">
          <el-input v-model.trim="dataForm.receiver_name"/>
        </el-form-item>
        <el-form-item label="收货人电话" prop="receiver_mobile">
          <el-input v-model.trim="dataForm.receiver_mobile"/>
        </el-form-item>
        <el-form-item label="收货地址" prop="receiver_address">
          <el-input v-model.trim="dataForm.receiver_address"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 确认删除对话框 -->
    <el-dialog :title="textTips" :visible.sync="dialogDeleteVisible" width="30%">
      <span style="font-size:20px;margin-left:30px;">是否确定删除？</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-select{
  width:100%;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
</style>

<script>
import { listAgent, createAgent, updateAgent, deleteAgent } from '@/api/agent'
import { getAllUser } from '@/api/user'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Ad',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: [],
      all: [],
      userList: [],
      userLists: [{ id: 0, username: '全部' }],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        userid: '',
        NO: undefined,
        token: '',
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        NO: undefined,
        token: ''
      },
      dialogFormVisible: false,
      textTips: '提示',
      dialogDeleteVisible: false,
      deleteRow: 0,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '渠道名称不能为空', trigger: 'blur' }
        ],
        NO: [
          { required: true, message: '渠道编号不能为空', trigger: 'blur' }
        ],
        receiver_name: [
          { required: true, message: '收货人姓名不能为空', trigger: 'blur' }
        ],
        receiver_mobile: [
          { required: true, message: '收货人联系方式不能为空', trigger: 'blur' }
        ],
        receiver_address: [
          { required: true, message: '收货人地址不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  created() {
    this.getList()
    this.getUser()
  },
  methods: {
    getList() {
      this.listLoading = true
      listAgent(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.all = response.data.data.all
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    getUser() {
      getAllUser().then(response => {
        this.userList = response.data.data
        this.userLists = this.userLists.concat(response.data.data)
      }).catch((response) => {
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        NO: undefined,
        token: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    uploadUrl: function(response) {
      this.dataForm.url = response.data.url
    },
    checkFileSize: function(file) {
      if (file.size > 1048576) {
        this.$message.error(`${file.name}文件大于1024KB，请选择小于1024KB大小的图片`)
        return false
      }
      return true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.dataForm.token = this.dataForm.token.toString()
          createAgent(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '创建成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlePrice(row) {
      this.$router.push({ path: '/agent/price', query: { id: row.id }})
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateAgent(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    // handleDelete(row) {
    //   deleteAgent(row)
    //     .then(response => {
    //       this.$notify.success({
    //         title: '成功',
    //         message: '删除成功'
    //       })
    //       const index = this.list.indexOf(row)
    //       this.list.splice(index, 1)
    //     })
    //     .catch(response => {
    //       this.$notify.error({
    //         title: '失败',
    //         message: response.data.errmsg
    //       })
    //     })
    // },
    handleDelete(row) {
      this.deleteRow = row
      this.dialogDeleteVisible = true
    },
    deleteData() {
      this.deleteBtnDisabled = true
      const row = this.deleteRow
      deleteAgent(row)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.dialogDeleteVisible = false
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
          this.dialogDeleteVisible = false
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '渠道名称',
          '渠道编号',
          '业务员名称',
          '收货人姓名',
          '收货人电话',
          '收货人地址'
        ]
        const filterVal = [
          'name',
          'NO',
          'username',
          'receiver_name',
          'receiver_mobile',
          'receiver_address'
        ]
        excel.export_json_to_excel2(tHeader, this.all, filterVal, '渠道信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
