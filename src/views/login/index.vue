<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="title-container">
        <h3 class="title">九安订单助手管理后台</h3>
      </div>
      <el-form-item prop="phone">
        <!-- <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="username" /> -->
        <el-input v-model="loginForm.phone" name="phone" placeholder="手机号">
          <template slot="append">
            <el-button :disabled="disabled" type="button" class="btns" @click="sendcode">{{ btntxt }}</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="loginForm.code" name="code" type="text" placeholder="验证码"/>
        <!-- <el-input type="button" value="查询" class="btns search" @click="query"/> -->
        <!-- <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="passwordType" v-model="loginForm.password" name="password" auto-complete="on" placeholder="password" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span> -->
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        phone: '',
        code: ''
      },
      loginRules: {
        phone: [{ required: true, message: '电话不允许为空', trigger: 'blur' }],
        code: [
          { required: true, message: '验证码不允许为空', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      loading: false,
      disabled: false,
      time: 0,
      btntxt: '获取验证码',
      formMess: {
        phone: this.phone
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }

  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    sendcode() {
      console.log(this.loginForm.phone)
      var reg = /^1[0-9]{10}$/
      // var url="/nptOfficialWebsite/apply/sendSms?mobile="+this.ruleForm.phone;
      if (this.loginForm.phone === '') {
        alert('请输入手机号码')
      } else if (!reg.test(this.loginForm.phone)) {
        alert('手机格式不正确')
      } else {
        this.time = 60
        this.disabled = true
        this.timer()
        this.query()
      }
    },
    timer() {
      if (this.time > 0) {
        this.time--
        this.btntxt = this.time + 's后重新获取'
        setTimeout(this.timer, 1000)
      } else {
        this.time = 0
        this.btntxt = '获取验证码'
        this.disabled = false
      }
    },
    query() {
      if (!this.loading) {
        this.loading = true
        this.$store.dispatch('SendMessageCode', this.loginForm).then(() => {
          this.loading = false
          this.$notify.success({
            title: '成功',
            message: '发送验证码成功'
          })
        }).catch(response => {
          console.log('respxxxx', response)
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
          this.loading = false
        })
      } else {
        return false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid && !this.loading) {
          this.loading = true
          this.$store.dispatch('LoginByCode', this.loginForm).then(() => {
            this.loading = false
            // this.$router.push({ path: this.redirect || '/' })
            this.$router.push({ path: '/' })
          }).catch(response => {
            console.log('respxxxx', response)
            this.$notify.error({
              title: '失败',
              message: response.data.data.errmsg
            })
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;
input {
  height: 42px !important;
}
/* reset element-ui css */
.login-container {
  // .el-input {
  //   display: inline-block;
  //   height: 47px;
  //   width: 85%;
  //   input {
  //     background: transparent;
  //     border: 0px;
  //     -webkit-appearance: none;
  //     border-radius: 0px;
  //     padding: 12px 5px 12px 15px;
  //     color: $light_gray;
  //     height: 47px;
  //     &:-webkit-autofill {
  //       box-shadow: 0 0 0px 1000px $bg inset !important;
  //       -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
  //       -webkit-text-fill-color: #fff !important;
  //     }
  //   }
  // }
  // .el-form-item {
  //   border: 1px solid rgba(255, 255, 255, 0.1);
  //   background: rgba(0, 0, 0, 0.1);
  //   border-radius: 5px;
  //   color: #454545;
  // }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    // color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
