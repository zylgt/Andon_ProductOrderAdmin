<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.user_id" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户ID"/> -->
      <el-input v-model="listQuery.order_no" clearable class="filter-item" style="width: 200px;" placeholder="请输入订单编号"/>
      <!-- <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item" placeholder="请选择订单状态">
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
      </el-select> -->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="商品信息">
              <el-table :data="props.row.details" border fit highlight-current-row>
                <el-table-column align="center" label="商品名称" prop="name" />
                <el-table-column align="center" label="货品图片" prop="img_url">
                  <template slot-scope="scope">
                    <img :src="scope.row.img_url" width="40">
                  </template>
                </el-table-column>
                <el-table-column align="center" label="商品编号" prop="goodsSn" />
                <!-- <el-table-column align="center" label="货品规格" prop="specifications" /> -->
                <el-table-column align="center" label="货品价格" prop="price" />
                <el-table-column align="center" label="货品数量" prop="count" />
              </el-table>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100" label="订单编号" prop="order_no"/>

      <el-table-column align="center" label="业务员名称" prop="username"/>

      <el-table-column align="center" label="订单状态" prop="status">
        <template slot-scope="scope">
          <!-- <el-tag>{{ scope.row.status | orderStatusFilter }}</el-tag> -->
          {{ scope.row.status | orderStatusFilter }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单金额" prop="total_price"/>

      <el-table-column align="center" min-width="100" label="下单时间" prop="create_time"/>
      <el-table-column align="center" min-width="100" label="发货时间" prop="send_time"/>
      <el-table-column align="center" min-width="110" label="预约发货时间" prop="schedule_delivery_date"/>
      <el-table-column align="center" label="配送方式" prop="shipping_method">
        <template slot-scope="scope">
          <!-- <el-tag>{{ scope.row.status | orderStatusFilter }}</el-tag> -->
          {{ scope.row.shipping_method | shippingMethodFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物流单号" prop="logistics_no"/>
      <el-table-column align="center" label="物流渠道" prop="logistics_company_name">
        <template v-if="scope.row.logistics_company_name!=null" slot-scope="scope">
          <!-- <el-tag>{{ scope.row.logistics_company_name | logisticFilter }}</el-tag> -->
          {{ scope.row.logistics_company_name | logisticFilter }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="物流渠道" prop="logistics_company_name"/> -->
      <el-table-column align="center" label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/order/check']" v-if="scope.row.status==1" type="primary" size="mini" @click="handleCheck(scope.row)">审核</el-button>
          <el-button v-if="scope.row.status>1&&scope.row.shipping_method!=1" type="primary" size="mini" @click="handleShip(scope.row)">物流</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="orderDialogVisible" title="订单详情" width="800">
      <section ref="print">
        <el-form :data="orderDetail" label-position="left">
          <el-form-item label="订单编号">
            <span>{{ orderDetail.order.order_no }}</span>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-tag>{{ orderDetail.order.status | orderStatusFilter }}</el-tag>
          </el-form-item>
          <el-form-item label="订单用户">
            <span>{{ orderDetail.user.nickname }}</span>
          </el-form-item>
          <el-form-item label="用户留言">
            <span>{{ orderDetail.order.message }}</span>
          </el-form-item>
          <el-form-item label="收货信息">
            <span>（收货人）{{ orderDetail.order.consignee }}</span>
            <span>（手机号）{{ orderDetail.order.mobile }}</span>
            <span>（地址）{{ orderDetail.order.address }}</span>
          </el-form-item>
          <el-form-item label="商品信息">
            <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
              <el-table-column align="center" label="商品名称" prop="goodsName" />
              <el-table-column align="center" label="商品编号" prop="goodsSn" />
              <el-table-column align="center" label="货品规格" prop="specifications" />
              <el-table-column align="center" label="货品价格" prop="price" />
              <el-table-column align="center" label="货品数量" prop="number" />
              <el-table-column align="center" label="货品图片" prop="picUrl">
                <template slot-scope="scope">
                  <img :src="scope.row.picUrl" width="40">
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="费用信息">
            <span>
              (商品总价){{ orderDetail.order.goodsPrice }}元 +
              (快递费用){{ orderDetail.order.freightPrice }}元 -
              (优惠减免){{ orderDetail.order.couponPrice }}元 -
              (积分减免){{ orderDetail.order.integralPrice }}元
            </span>
          </el-form-item>
          <el-form-item label="快递信息">
            <span>（快递公司）{{ orderDetail.order.logistics_company_name }}</span>
            <span>（快递单号）{{ orderDetail.order.logistics_no }}</span>
            <span>（发货时间）{{ orderDetail.order.shipTime }}</span>
          </el-form-item>
          <el-form-item label="收货信息">
            <span>（确认收货时间）{{ orderDetail.order.confirmTime }}</span>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="printOrder">打 印</el-button>
      </span>
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog :visible.sync="shipDialogVisible" title="更新">
      <el-form ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="快递公司" prop="logistics_company_name">
          <el-select v-model="shipForm.logistics_company_name">
            <el-option v-for="item in logisticList" :key="item.id" :label="item.text" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="快递编号" prop="logistics_no">
          <el-input v-model="shipForm.logistics_no"/>
        </el-form-item>
        <!-- <el-form-item v-if="shipForm.status!=2" label="状态">
          <el-select v-model="shipForm.status">
            <el-option v-for="item in statusList" :key="item.id" :label="item.text" :value="item.id"/>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button :disabled="shipDisabled" type="primary" @click="confirmShip">确定</el-button>
      </div>
    </el-dialog>

    <!-- 退款对话框 -->
    <el-dialog :visible.sync="refundDialogVisible" title="退款">
      <el-form ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="退款金额" prop="refundMoney">
          <el-input v-model="refundForm.refundMoney" :disabled="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRefund">确定</el-button>
      </div>
    </el-dialog>
    <!-- 审核确认对话框 -->
    <el-dialog :title="textTips" :visible.sync="dialogDeleteVisible" width="30%">
      <span style="font-size:20px;margin-left:30px;">是否确定审核通过？</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取消</el-button>
        <el-button :disabled="btnChangeEnable" type="primary" @click="deleteData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { detailOrder, listOrder, refundOrder, shipOrder, checkOrder } from '@/api/order'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import checkPermission from '@/utils/permission' // 权限判断函数
import { getToken } from '@/utils/auth'

const statusMap = {
  1: '待审核',
  2: '待发货',
  3: '待收货',
  4: '已完成'
}
const logisticMap = {
  0: '百世快运',
  1: '跨越物流',
  2: '顺丰速运',
  3: '圆通速递',
  4: '中通快递'
}
const shippingMethodMap = {
  1: '自提',
  2: '物流'
}

export default {
  name: 'Order',
  components: { Pagination },
  filters: {
    orderStatusFilter(status) {
      return statusMap[status]
    },
    logisticFilter(status) {
      return logisticMap[status]
    },
    shippingMethodFilter(status) {
      return shippingMethodMap[status]
    }
  },
  data() {
    return {
      list: [],
      statusList: [
        { id: 1, text: '待审核' },
        { id: 2, text: '待发货' },
        { id: 3, text: '待收货' },
        { id: 4, text: '已完成' }
      ],
      logisticList: [
        { id: 0, text: '百世快运' },
        { id: 1, text: '跨越物流' },
        { id: 2, text: '顺丰速运' },
        { id: 3, text: '圆通速递' },
        { id: 4, text: '中通快递' }
      ],
      shippingMethodList: [
        { id: 1, text: '自提' },
        { id: 2, text: '物流' }
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        orderStatusArray: [],
        token: getToken(),
        sort: 'add_time',
        order: 'desc'
      },
      statusMap,
      orderDialogVisible: false,
      textTips: '提示',
      dialogDeleteVisible: false,
      btnChangeEnable: false,
      shipDisabled: false,
      deleteRow: 0,
      orderDetail: {
        order: {},
        user: {},
        orderGoods: []
      },
      shipForm: {
        orderId: undefined,
        logistics_company_name: undefined,
        logistics_no: undefined
      },
      shipDialogVisible: false,
      refundForm: {
        orderId: undefined,
        refundMoney: undefined
      },
      refundDialogVisible: false,
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
      listOrder(this.listQuery).then(response => {
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
    handleDetail(row) {
      detailOrder(row.id).then(response => {
        this.orderDetail = response.data.data
      })
      this.orderDialogVisible = true
    },
    handleShip(row) {
      this.shipForm.orderId = row.id
      this.shipForm.logistics_company_name = row.logistics_company_name
      this.shipForm.logistics_no = row.logistics_no
      // this.shipForm.status = row.status

      this.shipDialogVisible = true
      this.$nextTick(() => {
        this.$refs['shipForm'].clearValidate()
      })
    },
    handleCheck(row) {
      this.deleteRow = row
      this.dialogDeleteVisible = true
    },
    deleteData() {
      this.btnChangeEnable = true
      const row = this.deleteRow
      setTimeout(() => {
        checkOrder({ order_id: row.id }).then(response => {
          this.dialogDeleteVisible = false
          this.shipDialogVisible = false
          this.btnChangeEnable = false
          this.$notify.success({
            title: '成功',
            message: '审核成功'
          })
          this.getList()
        }).catch(response => {
          this.btnChangeEnable = false
          this.dialogDeleteVisible = false
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
      }, 500)
    },
    confirmShip() {
      this.shipDisabled = true
      this.$refs['shipForm'].validate((valid) => {
        if (valid) {
          console.log('shipForm', this.shipForm)
          setTimeout(() => {
            shipOrder(this.shipForm).then(response => {
              this.shipDisabled = false
              this.shipDialogVisible = false
              this.$notify.success({
                title: '成功',
                message: '物流更新成功'
              })
              this.getList()
            }).catch(response => {
              this.shipDisabled = false
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
          }, 500)
        } else {
          this.shipDisabled = false
        }
      })
    },
    handleRefund(row) {
      this.refundForm.orderId = row.id

      this.refundDialogVisible = true
      this.$nextTick(() => {
        this.$refs['refundForm'].clearValidate()
      })
    },
    confirmRefund() {
      this.$refs['refundForm'].validate((valid) => {
        if (valid) {
          refundOrder(this.refundForm).then(response => {
            this.refundDialogVisible = false
            this.$notify.success({
              title: '成功',
              message: '确认退款成功'
            })
            this.getList()
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单编号', '业务员名称', '订单状态', '下单日期', '发货日期', '物流单号（自提为空）', '物流公司', '订单商品数量', '订单商品价格']
        // const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
        const filterVal = ['order_no', 'username', 'status_text', 'create_time', 'send_time', 'logistics_no', 'logistics_company_name_text', 'product_count', 'total_price']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '订单信息')
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
