<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" clearable class="filter-item" style="width: 200px;" placeholder="请输入公告名称"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button> -->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="公告ID" width="100" prop="id"/>

      <el-table-column align="center" label="公告名称" prop="title"/>
      <el-table-column align="center" label="公告内容" prop="text"/>
      <el-table-column align="center" label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="公告名称" prop="title">
          <el-input v-model.trim="dataForm.title"/>
        </el-form-item>
        <el-form-item label="公告内容" prop="text">
          <el-input v-model="dataForm.text" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" :disabled="createBtnDisabled" type="primary" @click="createData">确定</el-button>
        <el-button v-else :disabled="updateBtnDisabled" type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 确认删除对话框 -->
    <el-dialog :title="textTips" :visible.sync="dialogDeleteVisible" width="30%">
      <span style="font-size:20px;margin-left:30px;">是否确定删除？</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取消</el-button>
        <el-button :disabled="deleteBtnDisabled" type="primary" @click="deleteData">确定</el-button>
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
import { listAdmin, createAdmin, updateAdmin, deleteAdmin } from '@/api/admin'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Admin',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        title: undefined,
        password: undefined,
        avatar: undefined
      },
      dialogFormVisible: false,
      textTips: '提示',
      dialogDeleteVisible: false,
      deleteRow: 0,
      createBtnDisabled: false,
      updateBtnDisabled: false,
      deleteBtnDisabled: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        title: [
          { required: true, message: '公告名称不能为空', trigger: 'blur' }
        ],
        text: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }]
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
  },
  methods: {
    getList() {
      this.listLoading = true
      listAdmin(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        title: undefined,
        password: undefined,
        avatar: undefined
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.avatar = response.data.url
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.createBtnDisabled = true
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          setTimeout(() => {
            createAdmin(this.dataForm)
              .then(response => {
                this.createBtnDisabled = false
                this.list.unshift(response.data.data)
                this.dialogFormVisible = false
                this.$notify.success({
                  title: '成功',
                  message: '添加公告成功'
                })
              })
              .catch(response => {
                this.createBtnDisabled = false
                this.$notify.error({
                  title: '失败',
                  message: response.data.errmsg
                })
              })
          }, 500)
        } else {
          this.createBtnDisabled = false
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
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.updateBtnDisabled = true
          setTimeout(() => {
            updateAdmin(this.dataForm)
              .then(() => {
                this.updateBtnDisabled = false
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
                  message: '更新公告成功'
                })
              })
              .catch(response => {
                this.updateBtnDisabled = false
                this.$notify.error({
                  title: '失败',
                  message: response.data.errmsg
                })
              })
          }, 500)
        }
      })
    },
    handleDelete(row) {
      this.deleteRow = row
      this.dialogDeleteVisible = true
    },
    deleteData() {
      this.deleteBtnDisabled = true
      const row = this.deleteRow
      setTimeout(() => {
        deleteAdmin(row)
          .then(response => {
            this.deleteBtnDisabled = false
            this.dialogDeleteVisible = false
            this.$notify.success({
              title: '成功',
              message: '删除公告成功'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
          .catch(response => {
            this.deleteBtnDisabled = false
            this.dialogDeleteVisible = false
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
      }, 500)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['公告ID', '公告名称', '公告内容']
        const filterVal = ['id', 'title', 'avatar']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '公告信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
