<template>
  <div class="dashboard-editor-container">
    <el-card element-loading-text="正在新增中。。。" class="box-card">
      <h3>用户信息</h3>
      <el-form ref="user" :model="user" label-width="150px">
        <el-form-item label="用户名" prop="username">
          {{ user.username }}
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          {{ user.mobile }}
        </el-form-item>
        <el-form-item label="角色" prop="role">
          {{ user.role==1?"超级管理员":user.role==2?"仓库管理员":user.role==3?"业务员":"业务管理员" }}
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户数量</div>
            <count-to :start-val="0" :end-val="userTotal" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">商品数量</div>
            <count-to :start-val="0" :end-val="productTotal" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">订单数量</div>
            <count-to :start-val="0" :end-val="orderTotal" :duration="3600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">文件数量</div>
            <count-to :start-val="0" :end-val="fileTotal" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { info } from '@/api/dashboard'
import CountTo from 'vue-count-to'
import { getToken } from '@/utils/auth'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      userTotal: 0,
      productTotal: 0,
      fileTotal: 0,
      orderTotal: 0,
      user: {}
    }
  },
  created() {
    info({ token: getToken() }).then(response => {
      this.userTotal = response.data.data.userTotal
      this.productTotal = response.data.data.productTotal
      this.fileTotal = response.data.data.fileTotal
      this.orderTotal = response.data.data.orderTotal
      this.user = response.data.data.user
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
