<template>
  <div>
    <a-form-model
      ref="form"
      :model="model"
      :rules="rules"
      layout="horizontal"
      :labelCol="{ span: 5 }"
      :wrapperCol="{ span: 19 }"
    >
      <a-form-model-item :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
        <a-alert message="手机号码即账号，用于登录、找回密码和接受平台消息提醒，请正确填写！" banner />
      </a-form-model-item>

      <a-form-model-item required prop="phone" label="手机号码">
        <a-input size="large" type="text" v-model="model.phone" autocomplete="false" placeholder="请输入用户名" />
      </a-form-model-item>
      <a-form-model-item required prop="smscode" label="短信验证码">
        <a-input size="large" v-model="model.smscode" autocomplete="false" placeholder="请输入短信验证码">
          <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
          <div slot="suffix" @click.stop.prevent="getCaptcha">
            <a>{{ (!state.smsSendBtn && '获取验证码') || state.time + ' s' }}</a>
          </div>
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="password" required label="密码设置">
        <a-input size="large" v-model="model.password" type="password" autocomplete="false" placeholder="请输入密码">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="affirm" required label="确认密码">
        <a-input size="large" v-model="model.affirm" type="password" autocomplete="false" placeholder="请确认密码">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="realname" required label="真实姓名">
        <a-input size="large" v-model="model.realname" type="text" autocomplete="false" placeholder="请输入真实姓名">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="certType" required label="证件类型">
        <a-select size="large" v-model="model.certType" autocomplete="false" placeholder="请选择证件类型">
          <a-select-option v-for="(item, index) in certList" :key="index" :value="item.id">
            {{ item.itemText }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item prop="certCode" required label="证件号码">
        <a-input size="large" v-model="model.certCode" type="text" autocomplete="false" placeholder="请输入证件号码">
          <a-icon slot="prefix" type="credit-card" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-model-item>
      <a-divider dashed />
      <a-form-model-item prop="departId" required label="所属单位">
        <a-select size="large" v-model="model.departId" autocomplete="false" placeholder="请选择所属单位">
          <a-select-option v-for="(item, index) in departList" :key="index" :value="item.key">
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <div style="color: red; text-align: center; margin-bottom: 30px">
        温馨提示：
        注册成功后账号已生成，可访问消防服务平台查看信息，如需发布科技需求/参与建言献策，必须等待所属单位管理员认领。
      </div>
      <a-form-model-item :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
        <a-button
          size="large"
          type="primary"
          block
          :loading="registerBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="registerBtn"
          >下一步
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
// import { mixinDevice } from '@/utils/mixin.js'
import { getSmsCaptcha } from '@/api/login'
import { getAction, postAction } from '@/api/manage'
import { checkOnlyUser } from '@/api/api'
export default {
  name: 'Register',
  components: {},
  // mixins: [mixinDevice],
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.model.password) {
        callback(new Error('请确认密码是否一致'))
      } else {
        callback()
      }
    }
    return {
      model: {
        phone: '',
        smscode: '',
        password: '',
        affirm: '',
        realname: '',
        certType: '',
        certCode: '',
      },
      certList: [],
      departList: [],
      rules: {
        phone: [{ required: true, pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }],
        smscode: [{ required: true, message: '请输入短信验证码', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        affirm: [{ required: true, validator: validatePass2, trigger: 'change' }],
        realname: [{ required: true, message: '请输入真实姓名', trigger: 'change' }],
        certType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
        certCode: [{ required: true, message: '请输入证件号码', trigger: 'change' }],
        departId: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
      },
      validatorRules: {},
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000',
      },
      registerBtn: false,
    }
  },

  mounted() {
    this.certType()
    this.depart()
  },

  methods: {
    //获取证件类型
    certType() {
      getAction('sys/dictItem/listByDictCode', { dictCode: 'cert_type' }).then((res) => {
        if (res.success) {
          this.certList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //获取所属单位
    depart() {
      getAction('/sys/sysDepart/queryIdTree').then((res) => {
        if (res.success) {
          this.departList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    handleSubmit() {
      console.log(this.model)
      this.$refs['form'].validate((err) => {
        if (err) {
          postAction('/sys/user/register', this.model).then((res) => {
            if (res.success) {
              this.$emit('finsh')
              this.$message.success(res.message || '注册成功')
            } else {
              this.$message.warning(res.message || '注册失败')
            }
          })
        }
      })
    },

    getCaptcha(e) {
      e.preventDefault()
      let that = this
      console.log(this.$refs['form'].validateField)
      this.$refs['form'].validateField('phone', (err) => {
        if (!err) {
          this.state.smsSendBtn = true
          let interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)
          const hide = this.$message.loading('验证码发送中..', 3)
          const params = {
            mobile: this.model.phone,
            smsmode: '1',
          }
          postAction('/sys/sms', params)
            .then((res) => {
              if (!res.success) {
                this.registerFailed(res.message)
                setTimeout(hide, 0)
              }
              setTimeout(hide, 500)
            })
            .catch((err) => {
              setTimeout(hide, 1)
              clearInterval(interval)
              that.state.time = 60
              that.state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    registerFailed(message) {
      this.$notification['error']({
        message: '注册失败',
        description: message,
        duration: 2,
      })
    },
    requestFailed(err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4,
      })
      this.registerBtn = false
    },
  },
  watch: {
    'state.passwordLevel'(val) {
      console.log(val)
    },
  },
}
</script>
<style lang="less">
.steps {
  padding: 0 130px;
}
.user-register {
  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }
}

.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>
<style lang="less" scoped>
.user-layout-register {
  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .register-button {
    width: 50%;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
</style>