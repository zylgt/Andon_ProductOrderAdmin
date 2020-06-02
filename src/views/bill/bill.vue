<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-date-picker v-model="value1" type="date" class="filter-item" placeholder="入库日期" style="width: 200px;" />
      <el-date-picker v-model="value1" type="date" class="filter-item" placeholder="出库日期" style="width: 200px;" />
      <el-select v-model="listQuery.status" style="width: 200px" class="filter-item" placeholder="请选择状态">
        <el-option v-for="item in statusList" :key="item.id" :label="item.text" :value="item.id"/>
      </el-select>
      <el-select v-permission="['POST /admin/order/selectuser']" v-model="listQuery.user" style="width: 200px" class="filter-item" placeholder="请选择业务员">
        <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" label="渠道名称" prop="order_no"/>

      <el-table-column align="center" label="业务员名称" prop="username"/>

      <el-table-column align="center" label="商品名称" prop="total_price"/>
      <el-table-column align="center" label="入库金额" prop="total_price"/>
      <el-table-column align="center" label="入库数量" prop="total_price"/>
      <el-table-column align="center" label="入库日期" prop="total_price"/>
      <el-table-column align="center" label="出库金额" prop="total_price"/>
      <el-table-column align="center" label="出库数量" prop="total_price"/>
      <el-table-column align="center" label="出库日期" prop="total_price"/>
      <el-table-column align="center" label="合计金额" prop="total_price"/>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listRefund } from '@/api/orderFlow'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import checkPermission from '@/utils/permission' // 权限判断函数
import { getToken } from '@/utils/auth'

const statusMap = {
  1: '出库',
  2: '入库'
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
      users: [],
      statusList: [
        { id: '', text: '全部' },
        { id: 1, text: '出库' },
        { id: 2, text: '入库' }
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        status: '',
        orderStatusArray: [],
        user: [],
        token: getToken(),
        sort: 'add_time',
        order: 'desc'
      },
      statusMap,
      orderDialogVisible: false,
      textTips: '提示',
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      listRefund(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.all = response.data.data.all
        this.total = response.data.data.total
        this.users = response.data.data.users
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单编号', '业务员名称', '订单状态', '下单日期', '发货日期', '物流单号（自提为空）', '物流公司', '订单商品数量', '订单商品价格']
        // const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
        const filterVal = ['order_no', 'username', 'status_text', 'create_time', 'send_time', 'logistics_no', 'logistics_company_name_text', 'product_count', 'total_price']
        excel.export_json_to_excel2(tHeader, this.all, filterVal, '订单信息')
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
