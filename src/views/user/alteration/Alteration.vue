<template>
  <div :bordered="false">
    <h2 style="text-align: center; margin-bottom: 30px">重置密码</h2>
    <a-form-model ref="form" :model="model" :rules="validatorRules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item prop="phone" label="手机号码">
        <a-input v-model="model.phone" size="large" placeholder="请输入11位手机号"> </a-input>
      </a-form-model-item>
      <a-row :gutter="3" style="margin-bottom: 10px">
        <a-col :span="20">
          <a-form-model-item
            required
            prop="inputCode"
            label="图片验证码"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 18 }"
            help="点击图片可自动刷新，输入正确才可获取短信验证码"
          >
            <a-input
              :disabled="inputCodeSuccess"
              v-model="model.inputCode"
              size="large"
              type="text"
              placeholder="请输入验证码"
            >
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4" style="text-align: right">
          <img
            v-if="requestCodeSuccess"
            style="margin-top: 2px; width: 100%; height: 40px"
            :src="randCodeImage"
            @click="handleChangeCheckCode"
          />
          <img v-else style="margin-top: 2px" src="~@/assets/checkcode.png" @click="handleChangeCheckCode" />
        </a-col>
      </a-row>
      <a-form-model-item required prop="captcha" label="短信验证码">
        <a-input v-model="model.captcha" size="large" placeholder="请输入验证码">
          <div slot="suffix">
            <a
              tabindex="-1"
              :disabled="state.smsSendBtn"
              @click.stop.prevent="getCaptcha"
              v-text="(!state.smsSendBtn && '获取验证码') || state.time + ' s'"
            ></a>
          </div>
        </a-input>
      </a-form-model-item>
      <a-form-model-item required prop="password" label="新密码设置">
        <a-input
          v-model="model.password"
          size="large"
          type="password"
          autocomplete="new-password"
          placeholder="请输入新密码"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item required prop="confirmPassword" label="确认密码">
        <a-input v-model="model.confirmPassword" size="large" type="password" placeholder="请确认密码"> </a-input>
      </a-form-model-item>

      <div>
        <a-button :loading="loading" type="primary" size="large" block @click="handleConfirm">确认</a-button>
      </div>
      <div style="margin-top: 15px">
        <a-button size="large" block @click="handleBack">返回登录页</a-button>
      </div>
    </a-form-model>
    <a-modal title="重置密码提示" :visible="visible" :closable="false" :footer="false">
      <div class="modal-content">
        <div class="icon">
          <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
        </div>
        <div class="text-blod">重置密码成功</div>
        <div class="text">请使用新密码登录</div>
        <a-button @click="handleBack" block>返回登录页</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { postAction, putAction, getAction } from '@/api/manage'
export default {
  name: 'Alteration',
  data() {
    return {
      requestCodeSuccess: false,
      randCodeImage: '',
      currdatetime: '',
      // 图片验证码是否输入成功
      inputCodeSuccess: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 短信验证码
      state: {
        time: 60,
        smsSendBtn: false,
      },
      // 确认
      loading: false,
      // 重置密码成功提示
      visible: false,
      validatorRules: {
        phone: [
          { required: true, message: '请输入手机号!' },
          { pattern: /^1[345789]\d{9}$/, message: '手机号格式不正确' },
        ],
        captcha: [{ required: true, message: '请输入短信验证码!' }],
        inputCode: [
          {
            required: true,
            message: '请输入验证码!',
          },
        ],
        password: [
          {
            required: true,
            message: '密码由8位数字、大小写字母和特殊符号组成!!',
          },
        ],
        confirmPassword: [{ required: true, message: '确认密码不能为空!' }, { validator: this.handlePasswordCheck }],
      },
      model: {
        phone: '',
        captcha: '',
        password: '',
        confirmPassword: '',
        inputCode: '',
      },
    }
  },
  created() {
    this.handleChangeCheckCode()
  },
  methods: {
    /**刷新验证码*/
    handleChangeCheckCode() {
      if (!this.inputCodeSuccess) {
        this.currdatetime = new Date().getTime()
        this.model.inputCode = ''
        getAction(`/sys/randomImage/${this.currdatetime}`)
          .then((res) => {
            if (res.success) {
              this.randCodeImage = res.result
              this.requestCodeSuccess = true
            } else {
              this.$message.error(res.message)
              this.requestCodeSuccess = false
            }
          })
          .catch(() => {
            this.requestCodeSuccess = false
          })
      }
    },
    // 校验密码
    handlePasswordCheck(rule, value, callback) {
      let password = this.model['password']
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    // 返回登录页
    handleBack() {
      this.$router.push('login')
    },
    // 短信验证码获取
    getCaptcha(e) {
      e.preventDefault()
      const that = this
      that.$refs['form'].validateField('phone', (err) => {
        if (!err) {
          that.$refs['form'].validateField('inputCode', (err) => {
            if (!err) {
              that.state.smsSendBtn = true
              let interval = window.setInterval(() => {
                if (that.state.time-- <= 0) {
                  that.state.time = 60
                  that.state.smsSendBtn = false
                  window.clearInterval(interval)
                }
              }, 1000)
              let smsParams = {
                mobile: that.model.phone,
                smsmode: '1',
                captcha: this.model.inputCode,
                checkKey: this.currdatetime,
              }
              const hide = that.$message.loading('验证码发送中..', 0)
              postAction('/sys/sms', smsParams).then((res) => {
                if (!res.success) {
                  that.model.inputCode = ''
                  setTimeout(hide, 1)
                  that.cmsFailed(res.message)
                  return
                }
                this.inputCodeSuccess = true
                setTimeout(hide, 500)
              })
            } else {
              that.cmsFailed(err)
            }
          })
        } else {
          that.cmsFailed(err)
        }
      })
    },

    cmsFailed(err) {
      this.$notification['error']({
        message: '验证错误',
        description: err,
        duration: 4,
      })
    },
    // 验证码改变
    captchaChange(val) {
      this.$refs['form'].validateField('captcha')
    },
    // 确认
    handleConfirm() {
      let that = this
      that.loading = true
      that.$refs['form'].validate((success) => {
        if (success === true) {
          let params = {
            username: that.model.phone,
            password: that.model.password,
            // 短信验证码
          }
          console.log('params', params)
          putAction('/sys/common/changePassword', params).then((res) => {
            if (res.success) {
              this.visible = true
              that.loading = false
            } else {
              that.passwordFailed(res.message)
              that.loading = false
            }
          })
        } else {
          that.loading = false
        }
      })
    },
    passwordFailed(err) {
      this.$notification['error']({
        message: '更改密码失败',
        description: err,
        duration: 4,
      })
    },
  },
}
</script>

<style lang="less" scoped>
// 保存弹出框内容
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    margin-bottom: 20px;
  }
  .text-blod {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
    margin-bottom: 6px;
  }
  .text {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #8c8c8c;
    line-height: 22px;
    margin-bottom: 20px;
  }
}
</style>

