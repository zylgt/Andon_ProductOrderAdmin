<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-date-picker v-model="listQuery.date" type="date" class="filter-item" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 200px;" />
      <el-select v-model="listQuery.status" style="width: 200px" class="filter-item" placeholder="请选择退货状态">
        <el-option v-for="item in statusList" :key="item.id" :label="item.text" :value="item.id"/>
      </el-select>
      <el-select v-permission="['POST /admin/order/selectuser']" v-model="listQuery.operator_id" style="width: 200px" class="filter-item" placeholder="请选择业务员">
        <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.id"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" label="渠道名称" prop="agent_name"/>

      <el-table-column align="center" label="业务员名称" prop="username"/>

      <el-table-column align="center" label="商品名称" prop="product_name"/>
      <el-table-column align="center" label="渠道价格" prop="price"/>
      <el-table-column align="center" label="商品数量" prop="count"/>

      <el-table-column align="center" label="退货状态" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status | orderStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="退货时间" prop="create_time"/>
      <el-table-column align="center" min-width="100" label="完成时间" prop="receive_time"/>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listRefund, listRefundExport } from '@/api/orderFlow'
import { getAllUser } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import checkPermission from '@/utils/permission' // 权限判断函数
import { nowTime } from '@/utils/getDate'
// eslint-disable-next-line no-unused-vars
import { getToken } from '@/utils/auth'

const statusMap = {
  1: '未完成',
  2: '已完成',
  3: '已取消'
}

export default {
  name: 'Order',
  components: { Pagination },
  filters: {
    orderStatusFilter(status) {
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      all: [],
      userList: [],
      statusList: [
        { id: 0, text: '全部' },
        { id: 1, text: '未完成' },
        { id: 2, text: '已完成' },
        { id: 3, text: '已取消' }
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: '',
        operator_id: '',
        date: ''
      },
      statusMap,
      orderDialogVisible: false,
      textTips: '提示',
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getUser()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      var listQuery = this.listQuery
      listRefund(listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    getUser() {
      getAllUser().then(response => {
        this.userList = response.data.data
        this.userList.unshift({ id: 0, username: '全部' })
      }).catch((response) => {
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      var requestData = {
        status: this.listQuery.status,
        operator_id: this.listQuery.operator_id,
        date: this.listQuery.date
      }
      listRefundExport(requestData).then(response => {
        var exportList = response.data.data
        exportList.forEach(element => {
          if (element.status === 1) {
            element.status = '未完成'
          } else if (element.status === 2) {
            element.status = '已完成'
          } else if (element.status === 3) {
            element.status = '已取消'
          }
        })
        import('@/vendor/Export2Excel').then(excel => {
          const fileName = '退货信息' + nowTime()
          const tHeader = ['渠道名称', '业务员名称', '商品名称', '商品金额', '商品数量', '退货状态', '退货时间', '完成时间']
          const filterVal = ['agent_name', 'username', 'product_name', 'price', 'count', 'status', 'create_time', 'receive_time']
          excel.export_json_to_excel2(tHeader, exportList, filterVal, fileName)
          this.downloadLoading = false
        })
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    printOrder() {
      this.$print(this.$refs.print)
      this.orderDialogVisible = false
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  tr.el-table__row.expanded {
    background-color: #87CEFA !important;
  }
</style>
