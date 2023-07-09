<template>
  <div class="account-message">
    <a-alert banner>
      <div slot="message" class="message">
        1、手机号码即账号，用于登录、密码找回和平台信息提醒；
        <br />
        2、请保证证件信息正确，会自动匹配内部用户库中信息，如内部用户库中无此证件，无法注册。
      </div>
    </a-alert>
    <div class="content">
      <a-form-model
        ref="form"
        layout="horizontal"
        :model="model"
        :rules="validatorRules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-model-item prop="phone" label="手机号码">
          <a-input v-model="model.phone" size="large" placeholder="请输入11位手机号" />
        </a-form-model-item>
        <a-row :gutter="3" style="margin-bottom: 10px">
          <a-col :span="20">
            <a-form-model-item
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
        <a-form-model-item prop="captcha" label="短信验证码">
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
        <a-form-model-item prop="password" label="密码设置">
          <a-input
            v-model="model.password"
            size="large"
            type="password"
            autocomplete="new-password"
            placeholder="请输入数字+字母不少于8位数的密码"
          >
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="confirmPassword" label="确认密码">
          <a-input v-model="model.confirmPassword" size="large" type="password" placeholder="再次输入密码"> </a-input>
        </a-form-model-item>
        <a-form-model-item prop="realname" label="真实姓名">
          <a-input v-model="model.realname" size="large" type="text" placeholder="请输入姓名"> </a-input>
        </a-form-model-item>
        <a-form-model-item prop="sex" label="性别">
          <a-radio-group v-model="model.sex">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item prop="certType" label="证件类型">
          <a-radio-group v-model="model.certType">
            <a-radio value="rescueCard">消防救援人员证</a-radio>
            <a-radio value="officersCard">军官证</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item prop="certCode" label="证件号码">
          <a-input v-model="model.certCode" size="large" type="text" placeholder="请输入18位身份证号"> </a-input>
        </a-form-model-item>
      </a-form-model>
      <a-modal title="账号注册提示" :visible="visible" :closable="false" :footer="false">
        <div class="modal-content">
          <div class="icon">
            <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
          </div>
          <div class="text-blod">账号注册完成</div>
          <div class="text">
            证件信息已匹配完成，账号注册成功，后续请确认组织关系，只有被所在支队、业务处室认领后，才可参与科技业务。
          </div>
          <a-button @click="handlePerfect" type="primary" style="margin-bottom: 16px" block>选择单位</a-button>
          <a-button @click="handleBack" block>返回登录页</a-button>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { postAction, getAction } from '@/api/manage'
export default {
  data() {
    return {
      // 图片是否获取成功
      requestCodeSuccess: false,
      // 图片验证码
      randCodeImage: '',
      // 时间戳
      currdatetime: '',
      // 图片验证码是否输入成功
      inputCodeSuccess: false,
      // 短信验证码
      state: {
        time: 5,
        smsSendBtn: false,
      },
      visible: false,
      model: {
        phone: '',
        inputCode: '',
        captcha: '',
        password: '',
        confirmPassword: '',
        realname: '',
        sex: 1,
        certType: '',
        certCode: '',
      },
      validatorRules: {
        phone: [
          { required: true, message: '手机号码不能为空' },
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
            message: '密码由8位数字+字母组成!!',
          },
        ],
        confirmPassword: [{ required: true, message: '密码不能为空!' }, { validator: this.handlePasswordCheck }],
        realname: [{ required: true, message: '真实姓名不能为空!' }],
        sex: [{ required: true, message: '请选择性别!' }],
        certType: [{ required: true, message: '请选择证件类型' }],
        certCode: [
          { required: true, message: '输入证件号码' },
          {
            pattern: /^([1-9]\d{5}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/,
            message: '证件号码格式不正确',
          },
        ],
      },
    }
  },
  created() {
    this.handleChangeCheckCode()
  },
  methods: {
    // 校验密码
    handlePasswordCheck(rule, value, callback) {
      let password = this.model['password']
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
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
                  that.state.time = 5
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
    handleSubmit() {
      this.$refs['form'].validate((success) => {
        if (success) {
          let params = {
            username: this.model.phone,
            phone: this.model.phone,
            code: this.model.captcha,
            password: this.model.password,
            realname: this.model.realname,
            sex: this.model.sex,
            certType: this.model.certType,
            certCode: this.model.certCode,
            userType: 1,
          }
          postAction('/sys/user/register', params).then((res) => {
            if (res.success) {
              this.$emit('sendCurrentData', res.result)
              this.visible = true
            } else {
              this.$notification['error']({
                message: '注册失败',
                description: res.message,
                duration: 4,
              })
            }
          })
        }
      })
    },
    // 完善单位信息
    handlePerfect() {
      this.$emit('nextStep', 1)
    },
    // 返回登录页
    handleBack() {
      this.$router.push('login')
    },
  },
}
</script>
<style lang="less" scoped>
.ant-alert {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 2px;
  margin: 20px 0;
  .message {
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
  }
}
.content {
  width: 500px;
  margin: 0 auto;
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
    margin-bottom: 6px;
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
