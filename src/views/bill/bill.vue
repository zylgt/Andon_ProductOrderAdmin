<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-date-picker v-model="listQuery.start_date" value-format="yyyy-MM-dd" type="date" class="filter-item" placeholder="开始日期" style="width: 200px;" />
      <el-date-picker v-model="listQuery.end_date" value-format="yyyy-MM-dd" type="date" class="filter-item" placeholder="截止日期" style="width: 200px;" />
      <el-input v-model="listQuery.agent_name" clearable class="filter-item" style="width: 200px;" placeholder="请输入渠道名称"/>
      <el-select v-model="listQuery.style" style="width: 200px" class="filter-item" placeholder="请选择状态">
        <el-option v-for="item in statusList" :key="item.id" :label="item.text" :value="item.id"/>
      </el-select>
      <el-select v-permission="['POST /admin/order/selectuser']" v-model="listQuery.user_id" style="width: 200px" class="filter-item" placeholder="请选择业务员">
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
      <el-table-column align="center" label="总金额" prop="total_price">
        <template slot-scope="scope">
          {{ scope.row.price*scope.row.count }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" prop="style">
        <template slot-scope="scope">
          {{ scope.row.style | orderStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="日期" prop="create_time"/>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listFlow, listFlowExport } from '@/api/orderFlow'
import { getAllUser } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import checkPermission from '@/utils/permission' // 权限判断函数
import { nowDate } from '@/utils/getDate'
import { nowTime } from '@/utils/getDate'

const statusMap = {
  1: '售出',
  2: '退货'
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
        { id: 1, text: '售出' },
        { id: 2, text: '退货' }
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        user_id: '',
        style: '',
        start_date: '',
        end_date: '',
        agent_name: ''
      },
      statusMap,
      orderDialogVisible: false,
      textTips: '提示',
      downloadLoading: false
    }
  },
  created() {
    this.intDate()
    this.getList()
    this.getUser()
  },
  methods: {
    checkPermission,
    intDate() {
      this.listQuery.start_date = nowDate(1)
      this.listQuery.end_date = nowDate(2)
    },
    getList() {
      this.listLoading = true
      listFlow(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.all = response.data.data.all
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
        user_id: this.listQuery.user_id,
        style: this.listQuery.style,
        start_date: this.listQuery.start_date,
        end_date: this.listQuery.end_date
      }
      listFlowExport(requestData).then(response => {
        var exportList = response.data.data
        exportList.forEach(element => {
          element.allMoney = element.price * element.count
          if (element.style === 1) {
            element.style = '售出'
          } else if (element.style === 2) {
            element.style = '退货'
          }
        })
        import('@/vendor/Export2Excel').then(excel => {
          const fileName = '出入库台账' + nowTime()
          const tHeader = ['渠道名称', '业务员名称', '商品名称', '商品金额', '商品数量', '日期', '类型', '总金额']
          const filterVal = ['agent_name', 'username', 'product_name', 'price', 'count', 'create_time', 'style', 'allMoney']
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
