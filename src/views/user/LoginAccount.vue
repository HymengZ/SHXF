<template>
  <div>
    <a-form-model
      ref="form"
      :model="model"
      :rules="validatorRules"
      layout="horizontal"
      :labelCol="{ span: 5 }"
      :wrapperCol="{ span: 19 }"
    >
      <a-form-model-item required prop="username" label="手机号码">
        <a-input v-model="model.username" size="large" placeholder="请输入帐户名"> </a-input>
      </a-form-model-item>
      <a-form-model-item required prop="password" label="登录密码">
        <a-input v-model="model.password" size="large" type="password" autocomplete="false" placeholder="请输入密码">
        </a-input>
      </a-form-model-item>

      <a-row :gutter="3" v-if="isShow">
        <a-col :span="20">
          <a-form-model-item
            required
            prop="inputCode"
            label="图片验证码"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 18 }"
            help="点击图片可自动刷新"
          >
            <a-input v-model="model.inputCode" size="large" type="text" placeholder="请输入验证码"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4" style="text-align: right">
          <img
            v-if="requestCodeSuccess"
            style="margin-top: 2px; width: 100%; height: 40px"
            :src="randCodeImage"
            @click="handleChangeCheckCode"
          />
          <img v-else style="margin-top: 2px" src="../../assets/checkcode.png" @click="handleChangeCheckCode" />
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import { getAction } from '@/api/manage'
import Vue from 'vue'
import { mapActions } from 'vuex'

export default {
  name: 'LoginAccount',
  data() {
    return {
      requestCodeSuccess: false,
      randCodeImage: '',
      currdatetime: '',
      count: 1,
      loginType: 0,
      isShow: false,
      model: {
        username: '',
        password: '',
        inputCode: '',
      },
      validatorRules: {
        username: [{ required: true, message: '请输入手机号!' }, { validator: this.handleUsernameOrEmail }],
        password: [
          {
            required: true,
            message: '请输入密码!',
            validator: 'click',
          },
        ],
        inputCode: [
          {
            required: true,
            message: '请输入验证码!',
          },
        ],
      },
    }
  },
  created() {},
  methods: {
    ...mapActions(['Login']),
    /**刷新验证码*/
    handleChangeCheckCode() {
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
    },
    // 判断登录类型
    handleUsernameOrEmail(rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    /**
     * 验证字段
     * @param arr
     * @param callback
     */
    validateFields(arr, callback) {
      let promiseArray = []
      for (let item of arr) {
        let p = new Promise((resolve, reject) => {
          this.$refs['form'].validateField(item, (err) => {
            if (!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        })
        promiseArray.push(p)
      }
      Promise.all(promiseArray)
        .then(() => {
          callback()
        })
        .catch((err) => {
          callback(err)
        })
    },
    acceptUsername(username) {
      this.model['username'] = username
    },
    //账号密码登录
    handleLogin(rememberMe) {
      let validateList = ['username', 'password']
      if (this.isShow) {
        validateList = ['username', 'password', 'inputCode']
      }
      this.validateFields(validateList, (err) => {
        if (!err) {
          let loginParams = {
            username: this.model.username,
            password: this.model.password,
            captcha: this.model.inputCode,
            checkKey: this.currdatetime,
            remember_me: rememberMe,
          }
          this.Login(loginParams)
            .then((res) => {
              this.$emit('success', res.result)
            })
            .catch((err) => {
              console.log(this.count)
              if (this.count == 5) {
                this.isShow = true
                this.handleChangeCheckCode()
              } else if (!this.isShow) {
                this.count++
              }
              this.$emit('fail', err)
            })
        } else {
          this.$emit('validateFail')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
// 去掉表单校验星号
/deep/ .ant-form-item-required::before {
  display: none;
}
</style>