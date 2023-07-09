<template>
  <div class="modify-password">
    <div class="top-title">
      <span>修改密码</span>
    </div>
    <a-form-model ref="form" :model="model" :rules="validatorRules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item prop="oldPhone" label="">
        <a-input v-model="model.oldPhone" size="large" placeholder="请输入当前11位手机号"> </a-input>
      </a-form-model-item>
      <a-row :gutter="3" class="imageCode">
        <a-col :span="8">
          <a-form-model-item
            prop="inputCode"
            label="图片验证码"
            help="点击图片可自动刷新，输入正确才可获取短信验证码"
            :labelCol="{ span: 24 }"
            :wrapperCol="{ span: 24 }"
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
        <a-col :span="2" style="text-align: right">
          <img
            v-if="requestCodeSuccess"
            style="margin-top: 2px; width: 100%; height: 40px"
            :src="randCodeImage"
            @click="handleChangeCheckCode"
          />
          <img v-else style="margin-top: 2px" src="~@/assets/checkcode.png" @click="handleChangeCheckCode" />
        </a-col>
      </a-row>
      <a-form-model-item prop="oldSmscode" label="短信验证码">
        <a-input v-model="model.oldSmscode" size="large" placeholder="请输入验证码">
          <div slot="suffix">
            <a
              tabindex="-1"
              :disabled="oldState.smsSendBtn"
              @click.stop.prevent="getCaptcha($event, 'oldPhone')"
              v-text="(!oldState.smsSendBtn && '获取验证码') || oldState.time + ' s'"
            ></a>
          </div>
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="newPhone" label="新手机号码">
        <a-input v-model="model.newPhone" size="large" placeholder="请输入11位手机号"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="newSmscode" label="短信验证码">
        <a-input v-model="model.newSmscode" size="large" placeholder="请输入验证码">
          <div slot="suffix">
            <a
              tabindex="-1"
              :disabled="newState.smsSendBtn"
              @click.stop.prevent="getCaptcha($event, 'newPhone')"
              v-text="(!newState.smsSendBtn && '获取验证码') || newState.time + ' s'"
            ></a>
          </div>
        </a-input>
      </a-form-model-item>
    </a-form-model>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-modal title="手机号修改提示" :visible="visible" :closable="false" :footer="false">
      <div class="modal-content">
        <div class="icon">
          <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
        </div>
        <div class="text-blod">手机号修改成功</div>
        <a-button @click="handleAgainLogin" block>重新登录</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getAction, postAction } from '@/api/manage'
import { updateMobile } from '@/api/center/userInfo'
import { mapActions } from 'vuex'
export default {
  props: {
    username: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
      // 图片验证码是否输入成功
      inputCodeSuccess: false,
      // 图片是否获取成功
      requestCodeSuccess: false,
      // 图片验证码
      randCodeImage: '',
      // 时间戳
      currdatetime: '',
      // 当前手机号短信验证码
      oldState: {
        time: 5,
        smsSendBtn: false,
      },
      // 新手机号短信验证码
      newState: {
        time: 5,
        smsSendBtn: false,
      },
      labelCol: { span: 24 },
      wrapperCol: { span: 10 },
      model: {
        // 图片验证码
        inputCode: '',
        oldPhone: '',
        oldSmscode: '',
        newPhone: '',
        newSmscode: '',
      },
      validatorRules: {
        oldPhone: [
          { required: true, message: '当前手机号码不能为空' },
          { pattern: /^1[345789]\d{9}$/, message: '手机号格式不正确' },
        ],
        inputCode: [{ required: true, message: '图片验证码不能为空' }],
        oldSmscode: [{ required: true, message: '短信验证码不能为空' }],
        newPhone: [
          { required: true, message: '新手机号码不能为空' },
          { pattern: /^1[345789]\d{9}$/, message: '手机号格式不正确' },
        ],
        newSmscode: [{ required: true, message: '短信验证码不能为空' }],
      },
    }
  },
  created() {
    this.handleChangeCheckCode()
  },
  methods: {
    ...mapActions(['Logout']),
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
    // 短信验证码获取
    getCaptcha(e, type) {
      e.preventDefault()
      const that = this
      that.$refs['form'].validateField(type, (err) => {
        if (!err) {
          that.$refs['form'].validateField('inputCode', (err) => {
            if (!err) {
              let state = type === 'oldPhone' ? 'oldState' : 'newState'
              that[state].smsSendBtn = true
              let interval = window.setInterval(() => {
                if (that[state].time-- <= 0) {
                  that[state].time = 5
                  that[state].smsSendBtn = false
                  window.clearInterval(interval)
                }
              }, 1000)
              let codeParams =
                type === 'oldPhone'
                  ? {
                      captcha: this.model.inputCode,
                      checkKey: this.currdatetime,
                    }
                  : {}
              let smsParams = {
                mobile: type === 'oldPhone' ? that.model.oldPhone : that.model.newPhone,
                smsmode: '1',
                ...codeParams,
              }
              const hide = that.$message.loading('验证码发送中..', 0)
              postAction('/sys/sms', smsParams).then((res) => {
                if (!res.success) {
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
    // 重新登录
    handleAgainLogin() {
      this.$router.push({ path: '/home' })
      window.location.reload()
    },
    async handleOk() {
      let that = this
      that.$refs['form'].validate(async (success) => {
        if (success) {
          let data = {
            oldPhone: that.model.oldPhone,
            oldSmscode: that.model.oldSmscode,
            newPhone: that.model.newPhone,
            newSmscode: that.model.newSmscode,
          }
          const { success, message } = await updateMobile(data)
          if (!success) {
            that.$message.warning(message)
            return
          }
          that
            .Logout({})
            .then(() => {
              that.visible = true
            })
            .catch((err) => {
              that.$message.error({
                title: '错误',
                description: err.message,
              })
            })
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.modify-password {
  .top-title {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
    text-align: left;
    color: rgba(0, 0, 0, 0.85);
    line-height: 20px;
    padding: 8px 0;
  }
}
.imageCode {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
// 弹框内容
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
    margin-bottom: 20px;
  }
  .text {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #8c8c8c;
    line-height: 22px;
    margin-bottom: 20px;
    span {
      color: #ff6d6f;
    }
  }
}
</style>
