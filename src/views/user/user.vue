<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名"/>
      <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="用户ID" prop="id"/>

      <el-table-column align="center" label="用户名" prop="username"/>

      <el-table-column align="center" label="手机号码" prop="mobile"/>

      <!-- <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="scope">
          <el-tag >{{ genderDic[scope.row.gender] }}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" label="收货人姓名" prop="receiver_name"/>
      <el-table-column align="center" label="收货人电话" prop="receiver_mobile"/>
      <el-table-column align="center" label="地址" prop="address"/> -->
      <el-table-column align="center" label="代理商号" prop="agent_no"/>
      <el-table-column align="center" label="用户角色" prop="role">
        <template slot-scope="scope">
          <!-- <el-tag >{{ levelDic[scope.row.role] }}</el-tag> -->
          {{ levelDic[scope.row.role] }}
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="状态" prop="is_active">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.is_active] }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="center" width="150px" label="操作" class-name="small-padding fixed-width">
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="dataForm.username"/>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model.trim="dataForm.password" type="password" auto-complete="off"/>
        </el-form-item> -->
        <!-- <el-form-item label="角色" prop="role">
          <el-select v-model="dataForm.role" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.text"
              :value="item.id"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="角色" prop="role">
          <el-select v-model="dataForm.role">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.text" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="dataForm.mobile"/>
        </el-form-item>
        <!-- <el-form-item label="收货人姓名" prop="receiver_name">
          <el-input v-model="dataForm.receiver_name"/>
        </el-form-item>
        <el-form-item label="收货人电话" prop="receiver_mobile">
          <el-input v-model="dataForm.receiver_mobile"/>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="dataForm.address"/>
        </el-form-item> -->
        <el-form-item label="代理商号" prop="agent_no">
          <el-input v-model="dataForm.agent_no"/>
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

<script>
import { fetchList, createAdmin, updateAdmin, deleteAdmin } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        mobile: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        mobile: undefined,
        receiver_name: undefined,
        receiver_mobile: undefined,
        address: undefined,
        agent_no: undefined,
        avatar: undefined,
        role: []
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
        username: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        mobile: [{ required: true, pattern: /^1[345789]\d{9}$/, message: '电话格式不正确', trigger: 'blur' }],
        receiver_mobile: [{ required: true, pattern: /^1[345789]\d{9}$/, message: '电话格式不正确', trigger: 'blur' }]
      },
      downloadLoading: false,
      genderDic: ['未知', '男', '女'],
      levelDic: ['未知', '超级管理员', '仓库管理员', '业务员', '业务管理员'],
      statusDic: ['注销', '可用', '禁用'],
      roleOptions: [
        { id: 1, text: '超级管理员' },
        { id: 2, text: '仓库管理员' },
        { id: 3, text: '业务员' },
        { id: 4, text: '业务管理员' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
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
        username: undefined,
        password: undefined,
        avatar: undefined,
        role: []
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
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.createBtnDisabled = true
          setTimeout(() => {
            createAdmin(this.dataForm)
              .then(response => {
                this.dialogFormVisible = false
                this.createBtnDisabled = false
                console.log(response)
                if (response.data.message === '500') {
                  this.$notify.error({
                    title: '失败',
                    message: response.data.data.errmsg
                  })
                } else {
                  this.list.unshift(response.data.data)
                  this.$notify.success({
                    title: '成功',
                    message: '添加管理员成功'
                  })
                }
              })
              .catch(response => {
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
                  message: '更新管理员成功'
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
              message: '删除管理员成功'
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
        const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
        const filterVal = ['username', 'mobile', 'gender', 'birthday', 'is_active']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
