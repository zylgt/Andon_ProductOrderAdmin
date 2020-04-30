<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button v-if="fileCount<8" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="文件名称" prop="name"/>
      <el-table-column align="center" label="说明" prop="description"/>
      <el-table-column align="center" label="文件路径" prop="url"/>
      <el-table-column align="center" property="url" label="图片预览">
        <template slot-scope="scope">
          <img v-if="scope.row.url.indexOf('.pdf')==-1" :src="scope.row.url" width="100">
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> -->
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="文件名称" prop="name">
          <el-input v-model.trim="dataForm.name"/>
        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            :action="uploadPath"
            :show-file-list="true"
            :auto-upload="false"
            :on-remove="onRemoveUpload"
            :on-change="onUploadChange"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif,.pdf"
            list-type="picture-card">
            <img v-if="picUrl" :src="picUrl" width="100" height="100" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="dataForm.description"/>
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
    <!-- 对话框 -->
    <el-dialog :title="textTips" :visible.sync="dialogEnoughVisible" width="30%">
      <span style="font-size:20px;margin-left:30px;">一次只可选择一张图片</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="enough">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listRole, createRole, updateRole, deleteRole, updatePermission } from '@/api/role'
import { createStorage, uploadPath } from '@/api/storage'
import Pagination from '@/components/Pagination'

export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      fileCount: 0,
      uploadPic: [],
      fileList: [],
      picUrl: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        product_id: '',
        name: undefined,
        sort: 'add_time',
        order: 'description'
      },
      dataForm: {
        id: undefined,
        product_id: '',
        urlList: [],
        name: undefined,
        description: undefined
      },
      dialogFormVisible: false,
      dialogEnoughVisible: false,
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
      file_types: [],
      rules: {
        name: [
          { required: true, message: '文件名称不能为空', trigger: 'blur' }
        ]
      },
      permissionDialogFormVisible: false,
      systemPermissions: null,
      assignedPermissions: null,
      permissionForm: {
        roleId: undefined,
        permissions: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      if (this.$route.query.id == null) {
        return
      }
      const product_id = this.$route.query.id
      console.log('product_id', product_id)
      this.listQuery.product_id = product_id
      this.dataForm.product_id = product_id
      this.listLoading = true
      this.getList()
    },
    getList() {
      this.listLoading = true
      listRole(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.fileCount = response.data.data.list.length
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    uploadFileNow(file, name) {
      const formData = new FormData()
      formData.append(name, file)
      createStorage(formData).then(res => {
        console.log('res.data.data.url', res.data.data.url)
        this.dataForm.urlList.push(res.data.data.url)
        this.fileList.push({ name: '', url: res.data.data.url })
      }).catch(() => {
        console.log('上传失败，请重新上传')
      })
    },
    onRemoveUpload(file) {
      const urlList = this.dataForm.urlList
      urlList.splice(file.url.indexOf(urlList), 1)
      const fileList = this.fileList
      fileList.splice(file.url.indexOf(urlList), 1)
      console.log(this.fileList)
    },
    onUploadChange(file) {
      this.uploadFileNow(file.raw, 'img_url')
    },
    handleExceed() {
      this.dialogEnoughVisible = true
    },
    enough() {
      this.dialogEnoughVisible = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        urlList: [],
        product_id: this.$route.query.id,
        title: undefined,
        description: undefined
      }
      this.fileList = []
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.createBtnDisabled = true
          // const formData = new FormData()
          // Object.keys(this.dataForm).forEach((key) => {
          //   formData.append(key, this.dataForm[key])
          // })
          // formData.append('uploadPic', this.uploadPic.raw)
          setTimeout(() => {
            createRole(this.dataForm)
              .then(response => {
                this.resetForm()
                this.createBtnDisabled = false
                this.list.unshift(response.data.data)
                this.dialogFormVisible = false
                this.$notify.success({
                  title: '成功',
                  message: '添加文件成功'
                })
                location.reload()
              })
              .catch(response => {
                this.resetForm()
                this.createBtnDisabled = false
                this.$notify.error({
                  title: '失败',
                  message: response.data.errmsg
                })
              })
          }, 500)
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      console.log(row)
      this.fileList = []
      this.dataForm.urlList = []
      if (row.url1) {
        this.fileList.push({ name: '', url: row.url1 })
        this.dataForm.urlList.push(row.url1)
      }
      if (row.url2) {
        this.fileList.push({ name: '', url: row.url2 })
        this.dataForm.urlList.push(row.url2)
      }
      if (row.url3) {
        this.fileList.push({ name: '', url: row.url3 })
        this.dataForm.urlList.push(row.url3)
      }
      if (row.url4) {
        this.fileList.push({ name: '', url: row.url4 })
        this.dataForm.urlList.push(row.url4)
      }
      if (row.url5) {
        this.fileList.push({ name: '', url: row.url5 })
        this.dataForm.urlList.push(row.url5)
      }
      if (row.url6) {
        this.fileList.push({ name: '', url: row.url6 })
        this.dataForm.urlList.push(row.url6)
      }
      if (row.url7) {
        this.fileList.push({ name: '', url: row.url7 })
        this.dataForm.urlList.push(row.url7)
      }
      if (row.url8) {
        this.fileList.push({ name: '', url: row.url8 })
        this.dataForm.urlList.push(row.url8)
      }
      // this.fileList = [{ name: '', url: row.url }]
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
          // const formData = new FormData()
          // Object.keys(this.dataForm).forEach((key) => {
          //   formData.append(key, this.dataForm[key])
          // })
          // formData.append('uploadPic', this.uploadPic.raw)
          setTimeout(() => {
            updateRole(this.dataForm)
              .then((response) => {
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
                  message: '更新管理员成功'
                })
                location.reload()
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
        deleteRole(row)
          .then(response => {
            this.deleteBtnDisabled = false
            this.dialogDeleteVisible = false
            this.$notify.success({
              title: '成功',
              message: '删除文件成功'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            location.reload()
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
    updatePermission() {
      this.permissionForm.permissions = this.$refs.tree.getCheckedKeys(true)
      updatePermission(this.permissionForm)
        .then(response => {
          this.permissionDialogFormVisible = false
          this.$notify.success({
            title: '成功',
            message: '授权成功'
          })
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    }
  }
}
</script>
