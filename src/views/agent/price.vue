<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="商品名称" prop="name"/>

      <el-table-column align="center" label="市场价格" prop="original_price"/>

      <el-table-column align="center" label="渠道价格" prop="current_price"/>

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status | orderStatusFilter }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button type="info" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> -->
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品名称" prop="product_id">
          <el-select v-model="dataForm.product_id" :disabled="dialogStatus=='update'" @change="product_change">
            <el-option v-for="item in curproducts" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="市场价格" prop="original_price">
          <el-input v-model="dataForm.original_price" :disabled="true"/>
        </el-form-item>
        <el-form-item label="渠道价格" prop="current_price">
          <el-input-number v-model="dataForm.current_price" :min="0" placeholder="0.00"/>
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
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<script>
import { listPrice, createPrice, updatePrice, deletePrice } from '@/api/agent'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'
const statusMap = {
  1: '待审核',
  2: '审核通过',
  3: '审核驳回'
}
export default {
  name: 'Price',
  components: { Pagination },
  filters: {
    orderStatusFilter(status) {
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      products: [],
      allproducts: [],
      curproducts: [],
      total: 0,
      listLoading: true,
      listQuery: {
        agent_id: 0,
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        status: undefined,
        token: getToken(),
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        product_id: undefined,
        agent_id: undefined,
        original_price: undefined,
        current_price: undefined
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
        current_price: [
          { required: true, message: '渠道价格不能为空', trigger: 'blur' }
        ],
        product_id: [
          { required: true, message: '商品不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false
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
      const agent_id = this.$route.query.id
      this.listQuery.agent_id = agent_id
      this.dataForm.agent_id = agent_id
      this.listLoading = true
      this.getList()
    },
    getList() {
      this.listLoading = true
      listPrice(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.products = response.data.data.products
          this.allproducts = response.data.data.allproducts
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
          this.$notify.error({
            title: '失败',
            message: '参数不符'
          })
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        product_id: undefined,
        agent_id: this.$route.query.id,
        original_price: undefined,
        current_price: undefined
      }
    },
    product_change(value) {
      var price = null
      const products = this.products
      for (let index = 0; index < products.length; index++) {
        const element = products[index]
        if (value === element.id) {
          price = element.price
          break
        }
      }
      console.log(price)
      this.dataForm.original_price = price
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.curproducts = this.products
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createPrice(this.dataForm)
            .then(response => {
              // console.log(response.data.data)
              // this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              // location.reload()
              if (response.data.message === 100) {
                this.$notify.success({
                  title: '成功',
                  message: '创建成功'
                })
                this.getList()
              } else {
                this.$notify.warning({
                  title: '失败',
                  message: response.data.data
                })
              }
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
      this.curproducts = this.allproducts
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updatePrice(this.dataForm)
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
    //   deletePrice(row)
    //     .then(response => {
    //       this.$notify.success({
    //         title: '成功',
    //         message: '删除成功'
    //       })
    //       location.reload()
    //       // const index = this.list.indexOf(row)
    //       // this.list.splice(index, 1)
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
      deletePrice(row)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          location.reload()
          // const index = this.list.indexOf(row)
          // this.list.splice(index, 1)
          this.dialogDeleteVisible = false
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
          location.reload()
          this.dialogDeleteVisible = false
        })
    },
    handleDetail(row) {
      this.$router.push({ path: '/promotion/couponDetail', query: { id: row.id }})
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '优惠券ID',
          '名称',
          '内容',
          '标签',
          '最低消费',
          '减免金额',
          '每人限领',
          '优惠券数量'
        ]
        const filterVal = [
          'id',
          'name',
          'desc',
          'tag',
          'min',
          'discount',
          'limit',
          'total'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '优惠券信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
